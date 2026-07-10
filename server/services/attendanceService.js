const Attendance = require('../models/Attendance');
const AttendanceLogs = require('../models/AttendanceLogs');
const Employee = require('../models/Employee');
const Shift = require('../models/Shift');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const { buildFilterQuery, buildSortQuery } = require('../utils/queryHelper');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/AppError');

// Helper to get today's start of day date object (local time)
const getTodayDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const clockIn = async (data, reqUser) => {
  if (!reqUser.employeeId) throw new BadRequestError('User is not linked to an employee profile.');
  
  const today = getTodayDate();
  
  const existing = await Attendance.findOne({
    employeeId: reqUser.employeeId,
    date: today,
    organizationId: reqUser.organizationId
  });
  
  if (existing && existing.clockInTime) {
    throw new ConflictError('Already clocked in today.');
  }

  const employee = await Employee.findOne({ _id: reqUser.employeeId }).populate('shiftId');
  let isLate = false;
  
  const clockInTime = new Date();
  
  if (employee && employee.shiftId) {
    const shift = employee.shiftId;
    if (shift.startTime) {
      const [sh, sm] = shift.startTime.split(':').map(Number);
      const shiftStartTime = new Date();
      shiftStartTime.setHours(sh, sm, 0, 0);
      
      const graceMs = (shift.gracePeriodMinutes || 0) * 60000;
      if (clockInTime.getTime() > shiftStartTime.getTime() + graceMs) {
        isLate = true;
      }
    }
  }

  let attendance;
  if (existing) {
    existing.clockInTime = clockInTime;
    existing.attendanceStatus = 'Present';
    existing.isLate = isLate;
    existing.locationId = data.locationId || existing.locationId;
    existing.clockInGps = data.gpsCoordinates || null;
    await existing.save();
    attendance = existing;
  } else {
    attendance = await Attendance.create({
      employeeId: reqUser.employeeId,
      organizationId: reqUser.organizationId,
      date: today,
      shiftId: employee ? employee.shiftId?._id : null,
      clockInTime,
      attendanceStatus: 'Present',
      isLate,
      locationId: data.locationId || null,
      clockInGps: data.gpsCoordinates || null,
      createdBy: reqUser.userId,
    });
  }

  await AttendanceLogs.create({
    attendanceId: attendance._id,
    employeeId: reqUser.employeeId,
    organizationId: reqUser.organizationId,
    eventType: 'Clock-In',
    eventTime: clockInTime,
    gpsCoordinates: data.gpsCoordinates || null,
    deviceInfo: data.deviceInfo || null,
    processedBy: reqUser.userId
  });

  return attendance;
};

const clockOut = async (data, reqUser) => {
  if (!reqUser.employeeId) throw new BadRequestError('User is not linked to an employee profile.');
  
  const today = getTodayDate();
  
  const attendance = await Attendance.findOne({
    employeeId: reqUser.employeeId,
    date: today,
    organizationId: reqUser.organizationId
  });
  
  if (!attendance || !attendance.clockInTime) {
    throw new BadRequestError('Cannot clock out without clocking in first.');
  }
  
  if (attendance.clockOutTime) {
    throw new ConflictError('Already clocked out today.');
  }

  const clockOutTime = new Date();
  const workMs = clockOutTime.getTime() - attendance.clockInTime.getTime();
  const workingHours = parseFloat((workMs / (1000 * 60 * 60)).toFixed(2));
  
  let overtimeHours = 0;
  let isEarlyExit = false;

  const employee = await Employee.findOne({ _id: reqUser.employeeId }).populate('shiftId');
  if (employee && employee.shiftId) {
    const shift = employee.shiftId;
    if (shift.workingHours && workingHours > shift.workingHours) {
      const threshold = shift.overtimeThreshold || shift.workingHours;
      if (workingHours > threshold) {
        overtimeHours = parseFloat((workingHours - threshold).toFixed(2));
      }
    }
    
    if (shift.endTime) {
      const [eh, em] = shift.endTime.split(':').map(Number);
      const shiftEndTime = new Date();
      shiftEndTime.setHours(eh, em, 0, 0);
      
      if (clockOutTime.getTime() < shiftEndTime.getTime()) {
        isEarlyExit = true;
      }
    }
  }

  attendance.clockOutTime = clockOutTime;
  attendance.workingHours = workingHours;
  attendance.overtimeHours = overtimeHours;
  attendance.isEarlyExit = isEarlyExit;
  attendance.clockOutGps = data.gpsCoordinates || null;
  await attendance.save();

  await AttendanceLogs.create({
    attendanceId: attendance._id,
    employeeId: reqUser.employeeId,
    organizationId: reqUser.organizationId,
    eventType: 'Clock-Out',
    eventTime: clockOutTime,
    gpsCoordinates: data.gpsCoordinates || null,
    deviceInfo: data.deviceInfo || null,
    processedBy: reqUser.userId
  });

  return attendance;
};

const getAttendance = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = buildFilterQuery(query, ['attendanceStatus', 'employeeId']);
  filter.organizationId = reqUser.organizationId;
  
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  // Scoping for manager
  if (reqUser.role === 'MANAGER') {
    const managerEmp = await Employee.findOne({ _id: reqUser.employeeId });
    if (!managerEmp || !managerEmp.departmentId) {
      filter.employeeId = null; // Forces empty result if manager has no department
    } else {
      const deptEmployees = await Employee.find({ departmentId: managerEmp.departmentId }).select('_id');
      const deptEmpIds = deptEmployees.map(e => e._id);
      
      if (filter.employeeId) {
        if (!deptEmpIds.some(id => id.toString() === filter.employeeId.toString())) {
          filter.employeeId = null; // Unallowed
        }
      } else {
        filter.employeeId = { $in: deptEmpIds };
      }
    }
  }

  // department filter
  if (query.departmentId && reqUser.role !== 'MANAGER') {
    const deptEmployees = await Employee.find({ departmentId: query.departmentId }).select('_id');
    const deptEmpIds = deptEmployees.map(e => e._id);
    if (filter.employeeId) {
      if (!deptEmpIds.some(id => id.toString() === filter.employeeId.toString())) {
        filter.employeeId = null; 
      }
    } else {
      filter.employeeId = { $in: deptEmpIds };
    }
  }

  const total = await Attendance.countDocuments(filter);
  const items = await Attendance.find(filter)
    .populate('employeeId', 'firstName lastName employeeId')
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getMyAttendance = async (query, reqUser) => {
  if (!reqUser.employeeId) throw new BadRequestError('User is not linked to an employee profile.');
  query.employeeId = reqUser.employeeId;
  
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = { employeeId: reqUser.employeeId, organizationId: reqUser.organizationId };
  
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  const total = await Attendance.countDocuments(filter);
  const items = await Attendance.find(filter)
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getAttendanceById = async (id, reqUser) => {
  const attendance = await Attendance.findOne({ _id: id, organizationId: reqUser.organizationId })
    .populate('employeeId', 'firstName lastName employeeId departmentId');
  if (!attendance) throw new NotFoundError('Attendance record not found.');

  if (reqUser.role === 'MANAGER') {
    const managerEmp = await Employee.findOne({ _id: reqUser.employeeId });
    if (!managerEmp || !attendance.employeeId || attendance.employeeId.departmentId?.toString() !== managerEmp.departmentId?.toString()) {
      throw new NotFoundError('Attendance record not found.');
    }
  }

  return attendance;
};

const requestCorrection = async (id, data, reqUser) => {
  const attendance = await Attendance.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!attendance) throw new NotFoundError('Attendance record not found.');

  if (attendance.employeeId.toString() !== reqUser.employeeId?.toString()) {
    if (!['MANAGER', 'TEAM_LEAD'].includes(reqUser.role)) {
       throw new BadRequestError('Unauthorized to request correction for this record.');
    }
  }

  attendance.correctionStatus = 'Pending';
  await attendance.save();

  const log = await AttendanceLogs.create({
    attendanceId: attendance._id,
    employeeId: attendance.employeeId,
    organizationId: reqUser.organizationId,
    eventType: 'Correction-Request',
    eventTime: new Date(),
    correctionNotes: data.correctionNotes,
    processedBy: reqUser.userId
  });

  attendance.correctionRequestId = log._id;
  await attendance.save();

  return attendance;
};

const approveCorrection = async (id, data, reqUser) => {
  const attendance = await Attendance.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!attendance) throw new NotFoundError('Attendance record not found.');
  if (attendance.correctionStatus !== 'Pending') throw new BadRequestError('No pending correction to approve.');

  if (data.approved) {
    attendance.correctionStatus = 'Approved';
    attendance.correctionApprovedBy = reqUser.employeeId || null;
    attendance.correctionApprovedAt = new Date();
    // In a full implementation, this might adjust clockInTime/clockOutTime based on the request's notes/data.
  } else {
    attendance.correctionStatus = 'Rejected';
  }

  await attendance.save();

  await AttendanceLogs.create({
    attendanceId: attendance._id,
    employeeId: attendance.employeeId,
    organizationId: reqUser.organizationId,
    eventType: data.approved ? 'Correction-Approved' : 'Correction-Rejected',
    eventTime: new Date(),
    correctionNotes: data.approverNotes || null,
    processedBy: reqUser.userId
  });

  return attendance;
};

module.exports = {
  clockIn,
  clockOut,
  getAttendance,
  getMyAttendance,
  getAttendanceById,
  requestCorrection,
  approveCorrection
};
