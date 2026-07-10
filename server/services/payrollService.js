const mongoose = require('mongoose');
const Payroll = require('../models/Payroll');
const Payslip = require('../models/Payslip');
const Employee = require('../models/Employee');
const SalaryStructure = require('../models/SalaryStructure');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { calculateSalary } = require('../utils/calculateSalary');
const { buildPaginationAndSort } = require('../utils/paginationHelper');
const { buildSearchQuery } = require('../utils/queryHelper');
const logger = require('../config/logger');

/**
 * Helper to start a MongoDB session and transaction if running on a Replica Set or Sharded cluster.
 * Standalone MongoDB instances (common in test/dev environments) do not support multi-document transactions.
 */
const startTransactionIfPossible = async () => {
  let session = null;
  let useSession = false;
  try {
    const topologyType = mongoose.connection.client?.topology?.description?.type;
    if (topologyType && topologyType !== 'Single') {
      session = await mongoose.startSession();
      session.startTransaction();
      useSession = true;
    }
  } catch (err) {
    useSession = false;
  }
  return { session, useSession, sessionOpt: useSession ? { session } : {} };
};

/**
 * Helper to commit or abort a transaction safely.
 */
const commitOrAbort = async (session, useSession, isError = false) => {
  try {
    if (useSession && session) {
      if (isError) {
        await session.abortTransaction();
      } else {
        await session.commitTransaction();
      }
    }
  } finally {
    if (useSession && session) {
      session.endSession();
    }
  }
};

/**
 * Helper to resolve actor user ID and role from various caller input formats.
 */
const resolveActor = (userOrId, defaultRole = 'HR_MANAGER') => {
  if (!userOrId) return { actorId: null, actorRole: defaultRole };
  if (typeof userOrId === 'object' && !mongoose.Types.ObjectId.isValid(userOrId)) {
    return {
      actorId: userOrId._id || userOrId.userId || null,
      actorRole: userOrId.role || defaultRole,
    };
  }
  return { actorId: userOrId, actorRole: defaultRole };
};

/**
 * Process payroll run for a specific period
 * Scopes database writes in an atomic MongoDB transaction after synchronous calculations complete.
 */
const processPayrollRun = async (params, organizationId, processedByUserId) => {
  const { payPeriodMonth, payPeriodYear, employeeIds } = params;
  const { actorId, actorRole } = resolveActor(processedByUserId, 'HR_MANAGER');

  // Find employees to process
  let empQuery = { organizationId, status: 'active' };
  if (employeeIds && employeeIds.length > 0) {
    empQuery._id = { $in: employeeIds };
  }

  const employees = await Employee.find(empQuery).populate('salaryStructureId');
  if (employees.length === 0) {
    throw new AppError(404, 'No active employees found to process payroll');
  }

  let errorCount = 0;
  let errors = [];
  const payrollOperations = [];

  // Phase 1: Read operations and synchronous salary calculations (OUTSIDE transaction scope)
  for (const emp of employees) {
    try {
      const existingPayroll = await Payroll.findOne({
        employeeId: emp._id,
        payPeriodMonth,
        payPeriodYear,
        organizationId,
      });

      if (existingPayroll && existingPayroll.payrollStatus !== 'Draft') {
        throw new AppError(400, `Payroll already processed and not in Draft status for employee ${emp._id}`);
      }

      const startOfMonth = new Date(payPeriodYear, payPeriodMonth - 1, 1);
      const endOfMonth = new Date(payPeriodYear, payPeriodMonth, 0, 23, 59, 59);

      const attendanceRecords = await Attendance.find({
        employeeId: emp._id,
        date: { $gte: startOfMonth, $lte: endOfMonth },
        status: { $in: ['Present', 'Half Day', 'Late'] },
      });

      const presentDays = attendanceRecords.length;
      let overtimeHours = 0;
      attendanceRecords.forEach((record) => {
        if (record.overtimeHours) overtimeHours += record.overtimeHours;
      });

      const leaves = await LeaveRequest.find({
        employeeId: emp._id,
        status: 'Approved',
        startDate: { $lte: endOfMonth },
        endDate: { $gte: startOfMonth },
      });

      let leaveDays = 0;
      leaves.forEach((leave) => {
        leaveDays += leave.totalDays;
      });

      const totalWorkingDays = new Date(payPeriodYear, payPeriodMonth, 0).getDate();

      const salaryDetails = calculateSalary({
        basicSalary: emp.basicSalary,
        salaryStructure: emp.salaryStructureId || {},
        totalWorkingDays,
        presentDays,
        leaveDays,
        overtimeHours,
      });

      const payrollData = {
        employeeId: emp._id,
        organizationId,
        salaryStructureId: emp.salaryStructureId ? emp.salaryStructureId._id : null,
        payPeriodMonth,
        payPeriodYear,
        ...salaryDetails,
        payrollStatus: 'Draft',
        processedBy: actorId || organizationId,
        processedAt: new Date(),
        createdBy: actorId || organizationId,
      };

      if (existingPayroll) {
        payrollOperations.push({ type: 'update', existingPayroll, payrollData });
      } else {
        payrollOperations.push({ type: 'create', payrollData });
      }
    } catch (error) {
      errorCount++;
      errors.push({ employeeId: emp._id, error: error.message });
    }
  }

  if (payrollOperations.length === 0) {
    return { processedCount: 0, errorCount, errors };
  }

  // Phase 2: Atomic database writes (INSIDE transaction scope)
  const { session, useSession, sessionOpt } = await startTransactionIfPossible();
  let processedCount = 0;
  const auditEntries = [];

  try {
    for (const op of payrollOperations) {
      if (op.type === 'update') {
        await Object.assign(op.existingPayroll, op.payrollData).save(sessionOpt);
      } else {
        const [created] = await Payroll.create([op.payrollData], sessionOpt);
        op.createdId = created._id;
      }
      processedCount++;

      auditEntries.push({
        organizationId,
        actorUserId: actorId || organizationId,
        actorRole,
        action: op.type === 'update' ? 'PAYROLL_UPDATED' : 'PAYROLL_GENERATED',
        entityType: 'Payroll',
        entityId: op.type === 'update' ? op.existingPayroll._id : op.createdId,
        newValue: { payPeriodMonth, payPeriodYear, netSalary: op.payrollData.netSalary },
        outcome: 'Success',
      });
    }

    if (auditEntries.length > 0) {
      await AuditLog.insertMany(auditEntries, sessionOpt);
    }

    await commitOrAbort(session, useSession, false);
    return { processedCount, errorCount, errors };
  } catch (error) {
    await commitOrAbort(session, useSession, true);
    logger.error(`Payroll run transaction aborted: ${error.message}`);
    throw error;
  }
};

/**
 * Get paginated list of payroll records
 */
const getPayrolls = async (queryParams, organizationId) => {
  const { page = 1, limit = 10, employeeId, payPeriodMonth, payPeriodYear, payrollStatus, sort = '-createdAt' } = queryParams;

  const query = { organizationId };
  if (employeeId) query.employeeId = employeeId;
  if (payPeriodMonth) query.payPeriodMonth = parseInt(payPeriodMonth);
  if (payPeriodYear) query.payPeriodYear = parseInt(payPeriodYear);
  if (payrollStatus) query.payrollStatus = payrollStatus;

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Payroll.find(query)
      .populate('employeeId', 'firstName lastName employeeCode')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Payroll.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Get payroll by ID
 */
const getPayrollById = async (id, organizationId, employeeId = null) => {
  const query = { _id: id, organizationId };
  if (employeeId) query.employeeId = employeeId;

  const payroll = await Payroll.findOne(query)
    .populate('employeeId', 'firstName lastName employeeCode basicSalary')
    .populate('salaryStructureId', 'name code');

  if (!payroll) {
    throw new AppError(404, 'Payroll record not found');
  }

  return payroll;
};

/**
 * Approve Payroll
 * Scopes Payslip generation, Payroll update, and AuditLog recording in an atomic transaction.
 */
const approvePayroll = async (id, organizationId, approvedByUserId) => {
  const payroll = await Payroll.findOne({ _id: id, organizationId });
  if (!payroll) {
    throw new AppError(404, 'Payroll record not found');
  }

  if (payroll.payrollStatus === 'Approved' || payroll.payrollStatus === 'Paid') {
    throw new AppError(400, `Cannot approve payroll in ${payroll.payrollStatus} status`);
  }

  const { actorId, actorRole } = resolveActor(approvedByUserId, 'HR_MANAGER');
  const { session, useSession, sessionOpt } = await startTransactionIfPossible();

  try {
    payroll.payrollStatus = 'Approved';
    payroll.approvedBy = actorId || payroll.processedBy || organizationId;
    payroll.approvedAt = new Date();

    let existingPayslip = await Payslip.findOne({ payrollId: payroll._id }).session(session || null);
    if (!existingPayslip) {
      const [payslip] = await Payslip.create([{
        payrollId: payroll._id,
        employeeId: payroll.employeeId,
        organizationId: payroll.organizationId,
        payPeriodMonth: payroll.payPeriodMonth,
        payPeriodYear: payroll.payPeriodYear,
        generatedAt: new Date(),
        generatedBy: actorId || payroll.processedBy || organizationId,
        isEmailSent: false,
      }], sessionOpt);
      payroll.payslipId = payslip._id;
    } else {
      payroll.payslipId = existingPayslip._id;
    }

    await payroll.save(sessionOpt);

    await AuditLog.create([{
      organizationId: payroll.organizationId,
      actorUserId: actorId || payroll.processedBy || organizationId,
      actorRole,
      action: 'PAYROLL_APPROVED',
      entityType: 'Payroll',
      entityId: payroll._id,
      newValue: { status: 'Approved', payslipId: payroll.payslipId },
      outcome: 'Success',
    }], sessionOpt);

    await commitOrAbort(session, useSession, false);
    return payroll;
  } catch (error) {
    await commitOrAbort(session, useSession, true);
    logger.error(`Approve payroll transaction aborted: ${error.message}`);
    throw error;
  }
};

/**
 * Mark Payroll as Paid
 * Scopes status transition and compliance audit logging in an atomic transaction.
 */
const markPaid = async (id, organizationId, actorUserId = null) => {
  const payroll = await Payroll.findOne({ _id: id, organizationId });
  if (!payroll) {
    throw new AppError(404, 'Payroll record not found');
  }

  if (payroll.payrollStatus !== 'Approved') {
    throw new AppError(400, `Cannot mark as Paid. Payroll status is ${payroll.payrollStatus}`);
  }

  const { actorId, actorRole } = resolveActor(actorUserId, 'FINANCE');
  const { session, useSession, sessionOpt } = await startTransactionIfPossible();

  try {
    payroll.payrollStatus = 'Paid';
    await payroll.save(sessionOpt);

    await AuditLog.create([{
      organizationId: payroll.organizationId,
      actorUserId: actorId || payroll.approvedBy || payroll.processedBy || organizationId,
      actorRole,
      action: 'PAYROLL_PAID',
      entityType: 'Payroll',
      entityId: payroll._id,
      newValue: { status: 'Paid' },
      outcome: 'Success',
    }], sessionOpt);

    await commitOrAbort(session, useSession, false);
    return payroll;
  } catch (error) {
    await commitOrAbort(session, useSession, true);
    logger.error(`Mark paid transaction aborted: ${error.message}`);
    throw error;
  }
};

/**
 * Get paginated list of payslips
 */
const getPayslips = async (queryParams, organizationId) => {
  const { page = 1, limit = 10, employeeId, payPeriodYear, sort = '-createdAt' } = queryParams;

  const query = { organizationId };
  if (employeeId) query.employeeId = employeeId;
  if (payPeriodYear) query.payPeriodYear = parseInt(payPeriodYear);

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Payslip.find(query)
      .populate('employeeId', 'firstName lastName employeeCode')
      .populate('payrollId')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Payslip.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Get payslip by ID
 */
const getPayslipById = async (id, organizationId, employeeId = null) => {
  const query = { _id: id, organizationId };
  if (employeeId) query.employeeId = employeeId;

  const payslip = await Payslip.findOne(query)
    .populate('employeeId', 'firstName lastName employeeCode departmentId designationId')
    .populate('payrollId');

  if (!payslip) {
    throw new AppError(404, 'Payslip not found');
  }

  return payslip;
};

module.exports = {
  processPayrollRun,
  getPayrolls,
  getPayrollById,
  approvePayroll,
  markPaid,
  getPayslips,
  getPayslipById,
};
