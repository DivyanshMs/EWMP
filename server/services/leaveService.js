/**
 * leaveService.js — Phase 4B: Leave Management Module
 * Contains all business logic for Leave Types, Leave Balances, and Leave Requests.
 *
 * Authority: API_SPECIFICATION.md Section 7.2, 7.4, 7.5
 *            ARCHITECTURE_REVISION.md Section 5 & 9
 *            DATABASE_DESIGN.md Section 7.7, 7.8, 7.9
 */

const LeaveType = require('../models/LeaveType');
const LeaveBalance = require('../models/LeaveBalance');
const LeaveRequest = require('../models/LeaveRequest');
const Employee = require('../models/Employee');
const Holiday = require('../models/Holiday');
const Attendance = require('../models/Attendance');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const SystemSetting = require('../models/SystemSetting');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const { buildFilterQuery, buildSearchQuery, buildSortQuery } = require('../utils/queryHelper');
const { getStartOfDay, getEndOfDay, formatDateString } = require('../utils/dateHelper');
const { NotFoundError, ConflictError, BadRequestError, ForbiddenError } = require('../utils/AppError');

// ─── Helper: Get Employee ID from reqUser ────────────────────────────────────

const getEmployeeIdFromUser = async (reqUser) => {
  if (reqUser.employeeId) return reqUser.employeeId;
  if (!reqUser.userId) return null;
  const emp = await Employee.findOne({ userId: reqUser.userId });
  return emp ? emp._id : null;
};

// ─── Helper: Get Manager Team Employee IDs ───────────────────────────────────

const getManagerTeamEmployeeIds = async (reqUser) => {
  const empId = await getEmployeeIdFromUser(reqUser);
  if (!empId) return [];
  const managerEmp = await Employee.findOne({ _id: empId });
  if (!managerEmp) return [];

  const teamQuery = {
    organizationId: reqUser.organizationId,
    status: { $ne: 'archived' },
    $or: [
      { managerId: managerEmp._id },
      ...(managerEmp.departmentId ? [{ departmentId: managerEmp.departmentId }] : [])
    ]
  };
  const teamEmployees = await Employee.find(teamQuery).select('_id');
  return teamEmployees.map(e => e._id);
};

// ─── Leave Types CRUD ────────────────────────────────────────────────────────

const createLeaveType = async (data, reqUser) => {
  const existing = await LeaveType.findOne({
    code: data.code,
    organizationId: reqUser.organizationId,
  });
  if (existing) {
    throw new ConflictError('Leave type with this code already exists in this organization.');
  }

  const leaveType = await LeaveType.create({
    ...data,
    organizationId: reqUser.organizationId,
    createdBy: reqUser.userId,
    status: 'active',
  });

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LEAVE_TYPE_CREATED',
    entityType: 'LeaveType',
    entityId: leaveType._id,
    newValue: data,
    outcome: 'Success',
  });

  return leaveType;
};

const getLeaveTypes = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = buildFilterQuery(query, ['status']);
  filter.organizationId = reqUser.organizationId;
  if (!query.status) {
    filter.status = { $ne: 'archived' };
  }

  const searchFields = ['name', 'code', 'description'];
  const searchQuery = buildSearchQuery(query.search, searchFields);
  const combinedQuery = Object.keys(searchQuery).length > 0 ? { $and: [filter, searchQuery] } : filter;

  const total = await LeaveType.countDocuments(combinedQuery);
  const items = await LeaveType.find(combinedQuery)
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getLeaveTypeById = async (id, reqUser) => {
  const leaveType = await LeaveType.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!leaveType) throw new NotFoundError('Leave type not found.');
  return leaveType;
};

const updateLeaveType = async (id, data, reqUser) => {
  const leaveType = await LeaveType.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!leaveType) throw new NotFoundError('Leave type not found.');

  if (data.code && data.code !== leaveType.code) {
    const existing = await LeaveType.findOne({
      code: data.code,
      organizationId: reqUser.organizationId,
      _id: { $ne: id },
    });
    if (existing) {
      throw new ConflictError('Leave type with this code already exists in this organization.');
    }
  }

  const previousValue = leaveType.toObject();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) leaveType[key] = data[key];
  });
  await leaveType.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LEAVE_TYPE_UPDATED',
    entityType: 'LeaveType',
    entityId: leaveType._id,
    previousValue,
    newValue: data,
    outcome: 'Success',
  });

  return leaveType;
};

const archiveLeaveType = async (id, reqUser) => {
  const leaveType = await LeaveType.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!leaveType) throw new NotFoundError('Leave type not found.');

  const pendingRequests = await LeaveRequest.countDocuments({
    leaveTypeId: id,
    approvalStatus: 'Pending',
    status: { $ne: 'archived' },
  });
  if (pendingRequests > 0) {
    throw new BadRequestError('Cannot archive leave type with pending leave requests.');
  }

  leaveType.status = 'archived';
  await leaveType.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LEAVE_TYPE_ARCHIVED',
    entityType: 'LeaveType',
    entityId: leaveType._id,
    outcome: 'Success',
  });

  return { message: 'Leave type archived successfully.' };
};

// ─── Leave Balances & Initialization ─────────────────────────────────────────

const initializeLeaveBalancesForEmployee = async (employeeId, year, organizationId) => {
  const activeTypes = await LeaveType.find({
    organizationId,
    status: 'active',
  });

  const balances = [];
  for (const type of activeTypes) {
    let balance = await LeaveBalance.findOne({
      employeeId,
      leaveTypeId: type._id,
      year,
      organizationId,
    });

    if (!balance) {
      balance = await LeaveBalance.create({
        employeeId,
        leaveTypeId: type._id,
        organizationId,
        year,
        entitledDays: type.maxDaysPerYear,
        usedDays: 0,
        pendingDays: 0,
        remainingDays: type.maxDaysPerYear,
        carryForwardDays: 0,
        status: 'active',
      });
    }
    balances.push(balance);
  }
  return balances;
};

const getLeaveBalances = async (query, reqUser) => {
  const year = query.year ? parseInt(query.year, 10) : new Date().getFullYear();
  const filter = {
    organizationId: reqUser.organizationId,
    year,
    status: 'active',
  };

  if (query.leaveTypeId) filter.leaveTypeId = query.leaveTypeId;

  if (reqUser.role === 'MANAGER') {
    if (!query.employeeId) {
      const teamIds = await getManagerTeamEmployeeIds(reqUser);
      filter.employeeId = { $in: teamIds };
    } else {
      const teamIds = await getManagerTeamEmployeeIds(reqUser);
      if (!teamIds.some(id => id.toString() === query.employeeId.toString())) {
        return [];
      }
      filter.employeeId = query.employeeId;
    }
  } else if (query.employeeId) {
    filter.employeeId = query.employeeId;
  }

  if (query.employeeId) {
    await initializeLeaveBalancesForEmployee(query.employeeId, year, reqUser.organizationId);
  }

  const balances = await LeaveBalance.find(filter)
    .populate('leaveTypeId', 'name code isPaidLeave')
    .populate('employeeId', 'firstName lastName email employeeId')
    .sort({ 'leaveTypeId.name': 1 });

  return balances;
};

const getMyLeaveBalances = async (query, reqUser) => {
  const empId = await getEmployeeIdFromUser(reqUser);
  if (!empId) throw new BadRequestError('User is not linked to an employee profile.');
  const year = query.year ? parseInt(query.year, 10) : new Date().getFullYear();

  await initializeLeaveBalancesForEmployee(empId, year, reqUser.organizationId);

  const balances = await LeaveBalance.find({
    employeeId: empId,
    organizationId: reqUser.organizationId,
    year,
    status: 'active',
  }).populate('leaveTypeId', 'name code isPaidLeave maxDaysPerYear isCarryForward');

  return balances;
};

// ─── Working Days Calculator ─────────────────────────────────────────────────

const calculateWorkingDays = async (startDate, endDate, isHalfDay, organizationId) => {
  if (isHalfDay) return 0.5;

  const start = getStartOfDay(startDate);
  const end = getEndOfDay(endDate);

  const holidays = await Holiday.find({
    organizationId,
    status: 'active',
    date: { $gte: start, $lte: end },
  });
  const holidayDates = new Set(holidays.map(h => formatDateString(h.date)));

  const setting = await SystemSetting.findOne({ organizationId });
  const workingDays = setting?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const dayName = dayNames[current.getDay()];
    const dateStr = formatDateString(current);

    if (workingDays.includes(dayName) && !holidayDates.has(dateStr)) {
      count += 1;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
};

// ─── Leave Requests Workflow ─────────────────────────────────────────────────

const submitLeaveRequest = async (data, reqUser) => {
  const empId = await getEmployeeIdFromUser(reqUser);
  if (!empId) throw new BadRequestError('User is not linked to an employee profile.');

  const startDate = getStartOfDay(new Date(data.startDate));
  const endDate = getEndOfDay(new Date(data.endDate));

  if (startDate < getStartOfDay(new Date())) {
    throw new BadRequestError('Leave start date cannot be in the past.');
  }
  if (endDate < startDate) {
    throw new BadRequestError('End date must be greater than or equal to start date.');
  }

  const overlapping = await LeaveRequest.find({
    employeeId: empId,
    status: { $ne: 'archived' },
    approvalStatus: { $in: ['Pending', 'Approved'] },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });

  if (overlapping.length > 0) {
    const isOppositeHalfDay = overlapping.every(req => 
      req.isHalfDay && data.isHalfDay &&
      req.startDate.getTime() === startDate.getTime() &&
      req.endDate.getTime() === endDate.getTime() &&
      req.halfDaySession !== data.halfDaySession
    );
    if (!isOppositeHalfDay) {
      throw new ConflictError('Leave request overlaps with an existing pending or approved leave.');
    }
  }

  const leaveType = await LeaveType.findOne({
    _id: data.leaveTypeId,
    organizationId: reqUser.organizationId,
    status: 'active',
  });
  if (!leaveType) throw new NotFoundError('Leave type not found.');

  const totalDays = await calculateWorkingDays(startDate, endDate, data.isHalfDay, reqUser.organizationId);
  if (totalDays === 0) {
    throw new BadRequestError('Selected date range contains only non-working days or holidays.');
  }

  const year = startDate.getFullYear();
  await initializeLeaveBalancesForEmployee(empId, year, reqUser.organizationId);

  const leaveBalance = await LeaveBalance.findOne({
    employeeId: empId,
    leaveTypeId: leaveType._id,
    year,
    organizationId: reqUser.organizationId,
  });

  if (!leaveBalance || leaveBalance.remainingDays < totalDays) {
    throw new BadRequestError(`Insufficient leave balance. Required: ${totalDays}, Available: ${leaveBalance ? leaveBalance.remainingDays : 0}`);
  }

  let approvalStatus = 'Pending';
  let approvedAt = null;
  let approverId = null;

  if (leaveType.requiresApproval === false) {
    approvalStatus = 'Approved';
    approvedAt = new Date();
    approverId = empId;

    leaveBalance.usedDays += totalDays;
    leaveBalance.remainingDays = Math.max(0, leaveBalance.entitledDays + (leaveBalance.carryForwardDays || 0) - leaveBalance.usedDays);
  } else {
    leaveBalance.pendingDays += totalDays;
  }
  await leaveBalance.save();

  const leaveRequest = await LeaveRequest.create({
    ...data,
    startDate,
    endDate,
    totalDays,
    employeeId: empId,
    leaveBalanceId: leaveBalance._id,
    organizationId: reqUser.organizationId,
    approvalStatus,
    approvedAt,
    approverId,
    createdBy: reqUser.userId,
    status: 'active',
  });

  if (approvalStatus === 'Approved') {
    await createAttendanceForLeave(leaveRequest, reqUser.userId);
  }

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LEAVE_REQUEST_SUBMITTED',
    entityType: 'LeaveRequest',
    entityId: leaveRequest._id,
    newValue: leaveRequest,
    outcome: 'Success',
  });

  const employee = await Employee.findById(empId);
  if (employee && employee.managerId) {
    await Notification.create({
      recipientId: employee.managerId,
      organizationId: reqUser.organizationId,
      title: 'New Leave Request Submitted',
      message: `${employee.firstName} ${employee.lastName} applied for ${totalDays} day(s) of ${leaveType.name}.`,
      notificationType: 'Leave',
      relatedEntityType: 'LeaveRequest',
      relatedEntityId: leaveRequest._id,
      priority: 'Normal',
      status: 'active',
    }).catch(() => {});
  }

  return leaveRequest;
};

const createAttendanceForLeave = async (leaveRequest, userId) => {
  const current = new Date(leaveRequest.startDate);
  const end = new Date(leaveRequest.endDate);

  while (current <= end) {
    const leaveDate = getStartOfDay(current);
    await Attendance.findOneAndUpdate(
      {
        employeeId: leaveRequest.employeeId,
        date: leaveDate,
        organizationId: leaveRequest.organizationId,
      },
      {
        $set: {
          attendanceStatus: 'Leave',
          leaveRequestId: leaveRequest._id,
          workingHours: 0,
          overtimeHours: 0,
          isLate: false,
          isEarlyExit: false,
          createdBy: userId,
          status: 'active',
        },
      },
      { upsert: true, new: true, runValidators: false }
    );
    current.setDate(current.getDate() + 1);
  }
};

const getLeaveRequests = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = buildFilterQuery(query, ['approvalStatus', 'leaveTypeId']);
  filter.organizationId = reqUser.organizationId;
  filter.status = { $ne: 'archived' };

  if (query.startDate && query.endDate) {
    filter.startDate = { $gte: getStartOfDay(query.startDate) };
    filter.endDate = { $lte: getEndOfDay(query.endDate) };
  }

  if (reqUser.role === 'MANAGER') {
    if (!query.employeeId) {
      const teamIds = await getManagerTeamEmployeeIds(reqUser);
      filter.employeeId = { $in: teamIds };
    } else {
      const teamIds = await getManagerTeamEmployeeIds(reqUser);
      if (!teamIds.some(id => id.toString() === query.employeeId.toString())) {
        return { items: [], ...getPaginationMetadata(0, page, limit) };
      }
      filter.employeeId = query.employeeId;
    }
  } else if (query.employeeId) {
    filter.employeeId = query.employeeId;
  }

  const total = await LeaveRequest.countDocuments(filter);
  const items = await LeaveRequest.find(filter)
    .populate('employeeId', 'firstName lastName email employeeId departmentId designationId')
    .populate('leaveTypeId', 'name code isPaidLeave')
    .populate('approverId', 'firstName lastName email')
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getMyLeaveRequests = async (query, reqUser) => {
  const empId = await getEmployeeIdFromUser(reqUser);
  if (!empId) throw new BadRequestError('User is not linked to an employee profile.');
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = {
    employeeId: empId,
    organizationId: reqUser.organizationId,
    status: { $ne: 'archived' },
  };

  if (query.approvalStatus) filter.approvalStatus = query.approvalStatus;
  if (query.year) {
    const start = new Date(parseInt(query.year, 10), 0, 1);
    const end = new Date(parseInt(query.year, 10), 11, 31, 23, 59, 59, 999);
    filter.startDate = { $gte: start };
    filter.endDate = { $lte: end };
  }

  const total = await LeaveRequest.countDocuments(filter);
  const items = await LeaveRequest.find(filter)
    .populate('leaveTypeId', 'name code isPaidLeave')
    .populate('approverId', 'firstName lastName email')
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getLeaveRequestById = async (id, reqUser) => {
  const leaveRequest = await LeaveRequest.findOne({
    _id: id,
    organizationId: reqUser.organizationId,
    status: { $ne: 'archived' },
  })
    .populate('employeeId', 'firstName lastName email employeeId departmentId designationId managerId')
    .populate('leaveTypeId', 'name code isPaidLeave')
    .populate('approverId', 'firstName lastName email');

  if (!leaveRequest) throw new NotFoundError('Leave request not found.');

  const empId = await getEmployeeIdFromUser(reqUser);
  if (reqUser.role === 'EMPLOYEE' && (!empId || leaveRequest.employeeId._id.toString() !== empId.toString())) {
    throw new ForbiddenError('You do not have permission to view this leave request.');
  }
  if (reqUser.role === 'MANAGER') {
    const teamIds = await getManagerTeamEmployeeIds(reqUser);
    if (!teamIds.some(teamId => teamId.toString() === leaveRequest.employeeId._id.toString())) {
      throw new ForbiddenError('You do not have permission to view this leave request.');
    }
  }

  return leaveRequest;
};

const approveLeaveRequest = async (id, data, reqUser) => {
  const leaveRequest = await LeaveRequest.findOne({
    _id: id,
    organizationId: reqUser.organizationId,
    status: { $ne: 'archived' },
  });
  if (!leaveRequest) throw new NotFoundError('Leave request not found.');

  if (reqUser.role === 'MANAGER') {
    const teamIds = await getManagerTeamEmployeeIds(reqUser);
    if (!teamIds.some(teamId => teamId.toString() === leaveRequest.employeeId.toString())) {
      throw new ForbiddenError('You do not have permission to approve this leave request.');
    }
  }

  if (leaveRequest.approvalStatus !== 'Pending') {
    throw new BadRequestError('Only pending leave requests can be approved.');
  }

  const leaveBalance = await LeaveBalance.findById(leaveRequest.leaveBalanceId);
  if (!leaveBalance) throw new NotFoundError('Associated leave balance not found.');

  leaveBalance.pendingDays = Math.max(0, leaveBalance.pendingDays - leaveRequest.totalDays);
  leaveBalance.usedDays += leaveRequest.totalDays;
  leaveBalance.remainingDays = Math.max(0, leaveBalance.entitledDays + (leaveBalance.carryForwardDays || 0) - leaveBalance.usedDays);
  await leaveBalance.save();

  const empId = await getEmployeeIdFromUser(reqUser);
  const previousValue = leaveRequest.toObject();
  leaveRequest.approvalStatus = 'Approved';
  leaveRequest.approverId = empId || null;
  leaveRequest.approverNotes = data.approverNotes || null;
  leaveRequest.approvedAt = new Date();
  await leaveRequest.save();

  await createAttendanceForLeave(leaveRequest, reqUser.userId);

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LEAVE_REQUEST_APPROVED',
    entityType: 'LeaveRequest',
    entityId: leaveRequest._id,
    previousValue,
    newValue: leaveRequest,
    outcome: 'Success',
  });

  await Notification.create({
    recipientId: leaveRequest.employeeId,
    organizationId: reqUser.organizationId,
    title: 'Leave Request Approved',
    message: `Your leave request for ${leaveRequest.totalDays} day(s) has been approved.`,
    notificationType: 'Leave',
    relatedEntityType: 'LeaveRequest',
    relatedEntityId: leaveRequest._id,
    priority: 'High',
    status: 'active',
  }).catch(() => {});

  return leaveRequest;
};

const rejectLeaveRequest = async (id, data, reqUser) => {
  const leaveRequest = await LeaveRequest.findOne({
    _id: id,
    organizationId: reqUser.organizationId,
    status: { $ne: 'archived' },
  });
  if (!leaveRequest) throw new NotFoundError('Leave request not found.');

  if (reqUser.role === 'MANAGER') {
    const teamIds = await getManagerTeamEmployeeIds(reqUser);
    if (!teamIds.some(teamId => teamId.toString() === leaveRequest.employeeId.toString())) {
      throw new ForbiddenError('You do not have permission to reject this leave request.');
    }
  }

  if (leaveRequest.approvalStatus !== 'Pending') {
    throw new BadRequestError('Only pending leave requests can be rejected.');
  }

  const leaveBalance = await LeaveBalance.findById(leaveRequest.leaveBalanceId);
  if (leaveBalance) {
    leaveBalance.pendingDays = Math.max(0, leaveBalance.pendingDays - leaveRequest.totalDays);
    await leaveBalance.save();
  }

  const empId = await getEmployeeIdFromUser(reqUser);
  const previousValue = leaveRequest.toObject();
  leaveRequest.approvalStatus = 'Rejected';
  leaveRequest.approverId = empId || null;
  leaveRequest.approverNotes = data.approverNotes;
  await leaveRequest.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LEAVE_REQUEST_REJECTED',
    entityType: 'LeaveRequest',
    entityId: leaveRequest._id,
    previousValue,
    newValue: leaveRequest,
    outcome: 'Success',
  });

  await Notification.create({
    recipientId: leaveRequest.employeeId,
    organizationId: reqUser.organizationId,
    title: 'Leave Request Rejected',
    message: `Your leave request for ${leaveRequest.totalDays} day(s) was rejected. Reason: ${data.approverNotes}`,
    notificationType: 'Leave',
    relatedEntityType: 'LeaveRequest',
    relatedEntityId: leaveRequest._id,
    priority: 'High',
    status: 'active',
  }).catch(() => {});

  return leaveRequest;
};

const cancelLeaveRequest = async (id, data, reqUser) => {
  const leaveRequest = await LeaveRequest.findOne({
    _id: id,
    organizationId: reqUser.organizationId,
    status: { $ne: 'archived' },
  });
  if (!leaveRequest) throw new NotFoundError('Leave request not found.');

  const empId = await getEmployeeIdFromUser(reqUser);
  const isOwnRequest = empId && leaveRequest.employeeId.toString() === empId.toString();
  const isAdminOrHrOrMgr = ['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER', 'MANAGER'].includes(reqUser.role);

  if (!isOwnRequest && !isAdminOrHrOrMgr) {
    throw new ForbiddenError('You do not have permission to cancel this leave request.');
  }
  if (reqUser.role === 'EMPLOYEE' && !isOwnRequest) {
    throw new ForbiddenError('Employees can only cancel their own leave requests.');
  }

  if (leaveRequest.approvalStatus === 'Cancelled' || leaveRequest.approvalStatus === 'Rejected') {
    throw new BadRequestError('Leave request is already cancelled or rejected.');
  }
  if (!isAdminOrHrOrMgr && leaveRequest.approvalStatus !== 'Pending') {
    throw new BadRequestError('Employees can only cancel pending leave requests.');
  }

  const leaveBalance = await LeaveBalance.findById(leaveRequest.leaveBalanceId);
  if (leaveBalance) {
    if (leaveRequest.approvalStatus === 'Pending') {
      leaveBalance.pendingDays = Math.max(0, leaveBalance.pendingDays - leaveRequest.totalDays);
    } else if (leaveRequest.approvalStatus === 'Approved') {
      leaveBalance.usedDays = Math.max(0, leaveBalance.usedDays - leaveRequest.totalDays);
      leaveBalance.remainingDays = Math.max(0, leaveBalance.entitledDays + (leaveBalance.carryForwardDays || 0) - leaveBalance.usedDays);

      await Attendance.deleteMany({
        leaveRequestId: leaveRequest._id,
      });
    }
    await leaveBalance.save();
  }

  const previousValue = leaveRequest.toObject();
  leaveRequest.approvalStatus = 'Cancelled';
  leaveRequest.cancellationReason = data.cancellationReason;
  leaveRequest.cancelledAt = new Date();
  await leaveRequest.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LEAVE_REQUEST_CANCELLED',
    entityType: 'LeaveRequest',
    entityId: leaveRequest._id,
    previousValue,
    newValue: leaveRequest,
    outcome: 'Success',
  });

  if (isOwnRequest) {
    if (empId) {
      const employee = await Employee.findById(empId);
      if (employee && employee.managerId) {
        await Notification.create({
          recipientId: employee.managerId,
          organizationId: reqUser.organizationId,
          title: 'Leave Request Cancelled',
          message: `${employee.firstName} ${employee.lastName} cancelled their leave request.`,
          notificationType: 'Leave',
          relatedEntityType: 'LeaveRequest',
          relatedEntityId: leaveRequest._id,
          priority: 'Normal',
          status: 'active',
        }).catch(() => {});
      }
    }
  } else {
    await Notification.create({
      recipientId: leaveRequest.employeeId,
      organizationId: reqUser.organizationId,
      title: 'Leave Request Cancelled',
      message: `Your leave request was cancelled by administration. Reason: ${data.cancellationReason}`,
      notificationType: 'Leave',
      relatedEntityType: 'LeaveRequest',
      relatedEntityId: leaveRequest._id,
      priority: 'High',
      status: 'active',
    }).catch(() => {});
  }

  return leaveRequest;
};

module.exports = {
  createLeaveType,
  getLeaveTypes,
  getLeaveTypeById,
  updateLeaveType,
  archiveLeaveType,
  initializeLeaveBalancesForEmployee,
  getLeaveBalances,
  getMyLeaveBalances,
  calculateWorkingDays,
  submitLeaveRequest,
  getLeaveRequests,
  getMyLeaveRequests,
  getLeaveRequestById,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
};
