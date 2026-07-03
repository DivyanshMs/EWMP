/**
 * employeeService.js — Phase 4A: Employee Management
 * Implements business logic for Employee CRUD, profile management, status updates, photo upload, and documents.
 *
 * Authority: API_SPECIFICATION.md Section 6.6 & 7.13
 *            ARCHITECTURE_REVISION.md Section 7.3
 *            DEVELOPMENT_ORDER.md Step 21
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Department = require('../models/Department');
const Designation = require('../models/Designation');
const Location = require('../models/Location');
const Shift = require('../models/Shift');
const SalaryStructure = require('../models/SalaryStructure');
const LeaveType = require('../models/LeaveType');
const LeaveBalance = require('../models/LeaveBalance');
const EmployeeDocument = require('../models/EmployeeDocument');
const AuditLog = require('../models/AuditLog');
const generateEmployeeId = require('../utils/generateEmployeeId');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/fileUploadUtil');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const { buildFilterQuery, buildSearchQuery, buildSortQuery } = require('../utils/queryHelper');
const { NotFoundError, ConflictError, BadRequestError, ForbiddenError } = require('../utils/AppError');
const { ROLES } = require('../config/constants');
const sendEmail = require('../utils/sendEmail');
const logger = require('../config/logger');

/**
 * List employees with pagination, filtering, search, and role scoping.
 */
const getEmployees = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);

  const filter = buildFilterQuery(query, [
    'departmentId',
    'designationId',
    'status',
    'employmentType',
    'employmentStatus',
    'locationId',
    'shiftId',
    'managerId',
  ]);
  filter.organizationId = reqUser.organizationId;

  // Scoping for MANAGER role
  if (reqUser.role === ROLES.MANAGER) {
    const mgrEmp = await Employee.findOne({ userId: reqUser.userId, organizationId: reqUser.organizationId });
    if (mgrEmp && mgrEmp.departmentId) {
      filter.departmentId = mgrEmp.departmentId;
    } else {
      filter._id = null; // No department assigned to manager
    }
  }

  const searchQuery = buildSearchQuery(query.search, [
    'firstName',
    'lastName',
    'email',
    'employeeId',
    'mobile',
  ]);

  const combinedQuery = Object.keys(searchQuery).length > 0 ? { $and: [filter, searchQuery] } : filter;

  const total = await Employee.countDocuments(combinedQuery);

  let queryBuilder = Employee.find(combinedQuery)
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit)
    .populate('departmentId', 'name code')
    .populate('designationId', 'title code')
    .populate('locationId', 'name code')
    .populate('shiftId', 'name code')
    .populate('managerId', 'firstName lastName employeeId email');

  // Strip basic salary for MANAGER and AUDITOR roles
  if ([ROLES.MANAGER, ROLES.AUDITOR].includes(reqUser.role)) {
    queryBuilder = queryBuilder.select('-basicSalary');
  }

  const items = await queryBuilder;

  return {
    items,
    ...getPaginationMetadata(total, page, limit),
  };
};

/**
 * Create a new employee and their associated user account atomically.
 */
const createEmployee = async (data, reqUser) => {
  // Check duplicate email
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError('Email address is already in use by another account.');
  }

  const existingEmpEmail = await Employee.findOne({ email: data.email.toLowerCase() });
  if (existingEmpEmail) {
    throw new ConflictError('Email address is already associated with an employee profile.');
  }

  // Check duplicate mobile
  const existingMobile = await Employee.findOne({ mobile: data.mobile });
  if (existingMobile) {
    throw new ConflictError('Mobile number is already associated with an employee profile.');
  }

  // Validate relationships in org
  const department = await Department.findOne({ _id: data.departmentId, organizationId: reqUser.organizationId });
  if (!department) {
    throw new NotFoundError('Department not found in this organization.');
  }

  const designation = await Designation.findOne({ _id: data.designationId, organizationId: reqUser.organizationId });
  if (!designation) {
    throw new NotFoundError('Designation not found in this organization.');
  }

  if (data.locationId) {
    const location = await Location.findOne({ _id: data.locationId, organizationId: reqUser.organizationId });
    if (!location) throw new NotFoundError('Location not found in this organization.');
  }

  if (data.shiftId) {
    const shift = await Shift.findOne({ _id: data.shiftId, organizationId: reqUser.organizationId });
    if (!shift) throw new NotFoundError('Shift not found in this organization.');
  }

  if (data.managerId) {
    const manager = await Employee.findOne({ _id: data.managerId, organizationId: reqUser.organizationId });
    if (!manager) throw new NotFoundError('Manager employee record not found in this organization.');
  }

  if (data.salaryStructureId) {
    const salaryStructure = await SalaryStructure.findOne({ _id: data.salaryStructureId, organizationId: reqUser.organizationId });
    if (!salaryStructure) throw new NotFoundError('Salary structure not found in this organization.');
  }

  const employeeId = await generateEmployeeId(reqUser.organizationId);
  const passwordHash = await bcrypt.hash(data.password, 12);

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

  const sessionOpt = useSession ? { session } : {};
  let createdEmployeeId = null;

  try {
    // 1. Create User account
    const [user] = await User.create([{
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      organizationId: reqUser.organizationId,
      isActive: true,
      status: 'active',
      createdBy: reqUser.userId,
    }], sessionOpt);

    // 2. Create Employee profile
    const [employee] = await Employee.create([{
      ...data,
      email: data.email.toLowerCase(),
      employeeId,
      userId: user._id,
      organizationId: reqUser.organizationId,
      status: 'active',
      createdBy: reqUser.userId,
      updatedBy: reqUser.userId,
    }], sessionOpt);

    createdEmployeeId = employee._id;

    // Link user to employee
    user.employeeId = employee._id;
    await user.save(sessionOpt);

    // 3. Initialize LeaveBalances for active LeaveTypes
    let leaveTypeQuery = LeaveType.find({ organizationId: reqUser.organizationId, status: 'active' });
    if (useSession && session) leaveTypeQuery = leaveTypeQuery.session(session);
    const leaveTypes = await leaveTypeQuery;

    const currentYear = new Date().getFullYear();
    if (leaveTypes && leaveTypes.length > 0) {
      const leaveBalancesToCreate = leaveTypes.map((lt) => ({
        employeeId: employee._id,
        leaveTypeId: lt._id,
        organizationId: reqUser.organizationId,
        year: currentYear,
        entitledDays: lt.defaultDays || 0,
        usedDays: 0,
        pendingDays: 0,
        remainingDays: lt.defaultDays || 0,
        carryForwardDays: 0,
        status: 'active',
      }));
      await LeaveBalance.insertMany(leaveBalancesToCreate, sessionOpt);
    }

    // 4. Audit log
    await AuditLog.create([{
      organizationId: reqUser.organizationId,
      actorUserId: reqUser.userId,
      actorRole: reqUser.role,
      action: 'EMPLOYEE_CREATED',
      entityType: 'Employee',
      entityId: employee._id,
      newValue: { employeeId, email: data.email, role: data.role, departmentId: data.departmentId },
      outcome: 'Success',
    }], sessionOpt);

    if (useSession && session) {
      await session.commitTransaction();
    }
  } catch (error) {
    if (useSession && session) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    if (useSession && session) {
      session.endSession();
    }
  }

  // Send welcome email asynchronously
  sendEmail({
    to: data.email,
    subject: 'Welcome to EWMP — Account Created',
    text: `Hello ${data.firstName},\n\nYour employee profile and account have been set up.\nEmployee ID: ${employeeId}\nEmail: ${data.email}\nRole: ${data.role}\n\nPlease login and update your password.`,
  }).catch((err) => logger.error(`Welcome email send failed for ${data.email}: ${err.message}`));

  return await getEmployeeById(createdEmployeeId, reqUser);
};

/**
 * Get single employee profile with role-scoped PII access.
 */
const getEmployeeById = async (id, reqUser) => {
  let selectString = '';
  const isSelf = reqUser.employeeId && reqUser.employeeId.toString() === id.toString();
  const isAdminOrHr = [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER].includes(reqUser.role);

  if (isAdminOrHr || isSelf) {
    selectString = '+aadharNumber +panNumber +bankAccountNumber +bankIfscCode';
  } else if (reqUser.role === ROLES.FINANCE) {
    selectString = '+bankAccountNumber +bankIfscCode';
  }

  let queryBuilder = Employee.findOne({ _id: id, organizationId: reqUser.organizationId })
    .populate('departmentId', 'name code')
    .populate('designationId', 'title code')
    .populate('locationId', 'name code')
    .populate('shiftId', 'name code')
    .populate('managerId', 'firstName lastName employeeId email');

  if (selectString) {
    queryBuilder = queryBuilder.select(selectString);
  } else if ([ROLES.MANAGER, ROLES.AUDITOR].includes(reqUser.role)) {
    queryBuilder = queryBuilder.select('-basicSalary');
  }

  const employee = await queryBuilder;
  if (!employee) {
    throw new NotFoundError('Employee not found in this organization.');
  }

  // Check scoping for MANAGER role
  if (reqUser.role === ROLES.MANAGER) {
    const mgrEmp = await Employee.findOne({ userId: reqUser.userId, organizationId: reqUser.organizationId });
    if (!mgrEmp || !employee.departmentId || mgrEmp.departmentId.toString() !== employee.departmentId._id.toString()) {
      throw new ForbiddenError('You can only view employees within your own department.');
    }
  } else if (!isAdminOrHr && !isSelf && ![ROLES.FINANCE, ROLES.AUDITOR].includes(reqUser.role)) {
    throw new ForbiddenError('You do not have permission to view this profile.');
  }

  return employee;
};

/**
 * Update an employee profile.
 */
const updateEmployee = async (id, data, reqUser) => {
  const employee = await Employee.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!employee) {
    throw new NotFoundError('Employee not found in this organization.');
  }

  if (data.mobile && data.mobile !== employee.mobile) {
    const existingMobile = await Employee.findOne({ mobile: data.mobile, _id: { $ne: id } });
    if (existingMobile) {
      throw new ConflictError('Mobile number is already in use by another employee.');
    }
  }

  if (data.departmentId) {
    const dept = await Department.findOne({ _id: data.departmentId, organizationId: reqUser.organizationId });
    if (!dept) throw new NotFoundError('Department not found in this organization.');
  }

  if (data.designationId) {
    const desig = await Designation.findOne({ _id: data.designationId, organizationId: reqUser.organizationId });
    if (!desig) throw new NotFoundError('Designation not found in this organization.');
  }

  if (data.locationId) {
    const loc = await Location.findOne({ _id: data.locationId, organizationId: reqUser.organizationId });
    if (!loc) throw new NotFoundError('Location not found in this organization.');
  }

  if (data.shiftId) {
    const shft = await Shift.findOne({ _id: data.shiftId, organizationId: reqUser.organizationId });
    if (!shft) throw new NotFoundError('Shift not found in this organization.');
  }

  if (data.managerId) {
    if (data.managerId.toString() === id.toString()) {
      throw new BadRequestError('An employee cannot be their own manager.');
    }
    const mgr = await Employee.findOne({ _id: data.managerId, organizationId: reqUser.organizationId });
    if (!mgr) throw new NotFoundError('Manager employee record not found in this organization.');
  }

  if (data.salaryStructureId) {
    const struct = await SalaryStructure.findOne({ _id: data.salaryStructureId, organizationId: reqUser.organizationId });
    if (!struct) throw new NotFoundError('Salary structure not found in this organization.');
  }

  const previousValue = employee.toObject();

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      employee[key] = data[key];
    }
  });

  employee.updatedBy = reqUser.userId;
  await employee.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'EMPLOYEE_UPDATED',
    entityType: 'Employee',
    entityId: employee._id,
    previousValue,
    newValue: data,
    outcome: 'Success',
  });

  return await getEmployeeById(employee._id, reqUser);
};

/**
 * Update employment status (Probation, Permanent, Notice Period, Resigned, Terminated).
 */
const updateEmploymentStatus = async (id, { employmentStatus, exitDate, exitReason }, reqUser) => {
  const employee = await Employee.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!employee) {
    throw new NotFoundError('Employee not found in this organization.');
  }

  const oldStatus = employee.employmentStatus;
  employee.employmentStatus = employmentStatus;
  if (exitDate !== undefined) employee.exitDate = exitDate;
  if (exitReason !== undefined) employee.exitReason = exitReason;
  employee.updatedBy = reqUser.userId;

  if (['Resigned', 'Terminated'].includes(employmentStatus)) {
    employee.status = 'inactive';
    const user = await User.findById(employee.userId);
    if (user) {
      user.isActive = false;
      user.status = 'inactive';
      await user.save();
    }
  }

  await employee.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'EMPLOYEE_STATUS_CHANGED',
    entityType: 'Employee',
    entityId: employee._id,
    previousValue: { employmentStatus: oldStatus },
    newValue: { employmentStatus, exitDate, exitReason },
    outcome: 'Success',
  });

  return await getEmployeeById(employee._id, reqUser);
};

/**
 * Soft archive an employee and deactivate their user account.
 */
const archiveEmployee = async (id, reqUser) => {
  const employee = await Employee.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!employee) {
    throw new NotFoundError('Employee not found in this organization.');
  }

  employee.status = 'archived';
  employee.updatedBy = reqUser.userId;
  await employee.save();

  const user = await User.findById(employee.userId);
  if (user) {
    user.isActive = false;
    user.status = 'archived';
    await user.save();
  }

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'EMPLOYEE_ARCHIVED',
    entityType: 'Employee',
    entityId: employee._id,
    outcome: 'Success',
  });

  return { message: 'Employee archived successfully.' };
};

/**
 * Get audit log timeline events for an employee.
 */
const getEmployeeTimeline = async (id, reqUser) => {
  const employee = await Employee.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!employee) {
    throw new NotFoundError('Employee not found in this organization.');
  }

  return await AuditLog.find({
    organizationId: reqUser.organizationId,
    entityType: 'Employee',
    entityId: employee._id,
  }).sort({ createdAt: -1 });
};

/**
 * Update profile photo by streaming buffer to Cloudinary.
 */
const updateProfilePhoto = async (id, fileBuffer, reqUser) => {
  const employee = await Employee.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!employee) {
    throw new NotFoundError('Employee not found in this organization.');
  }

  const isSelf = reqUser.employeeId && reqUser.employeeId.toString() === id.toString();
  const isAdminOrHr = [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER].includes(reqUser.role);
  if (!isSelf && !isAdminOrHr) {
    throw new ForbiddenError('You do not have permission to update this profile photo.');
  }

  const folder = `ewmp/organizations/${reqUser.organizationId}/employees/${employee.employeeId}/photos`;
  const publicId = `photo_${Date.now()}`;
  const { url } = await uploadToCloudinary(fileBuffer, folder, publicId);

  employee.profilePhotoUrl = url;
  employee.updatedBy = reqUser.userId;
  await employee.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'EMPLOYEE_PHOTO_UPDATED',
    entityType: 'Employee',
    entityId: employee._id,
    newValue: { profilePhotoUrl: url },
    outcome: 'Success',
  });

  return await getEmployeeById(employee._id, reqUser);
};

/**
 * List documents belonging to an employee.
 */
const listEmployeeDocuments = async (id, query, reqUser) => {
  const employee = await Employee.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!employee) {
    throw new NotFoundError('Employee not found in this organization.');
  }

  const isSelf = reqUser.employeeId && reqUser.employeeId.toString() === id.toString();
  const isAdminOrHr = [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER].includes(reqUser.role);
  if (!isSelf && !isAdminOrHr) {
    throw new ForbiddenError('You can only view your own documents.');
  }

  const filter = {
    employeeId: employee._id,
    organizationId: reqUser.organizationId,
    status: 'active',
  };
  if (query && query.documentType) {
    filter.documentType = query.documentType;
  }

  return await EmployeeDocument.find(filter)
    .sort({ createdAt: -1 })
    .populate('uploadedBy', 'firstName lastName email')
    .populate('verifiedBy', 'firstName lastName email');
};

/**
 * Upload a document for an employee.
 */
const uploadEmployeeDocument = async (id, body, file, reqUser) => {
  const employee = await Employee.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!employee) {
    throw new NotFoundError('Employee not found in this organization.');
  }

  const isSelf = reqUser.employeeId && reqUser.employeeId.toString() === id.toString();
  const isAdminOrHr = [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER].includes(reqUser.role);
  if (!isSelf && !isAdminOrHr) {
    throw new ForbiddenError('You can only upload documents for your own profile.');
  }

  const folder = `ewmp/organizations/${reqUser.organizationId}/employees/${employee.employeeId}/documents`;
  const publicId = `${body.documentType.toLowerCase()}_${Date.now()}`;
  const { url, publicId: cloudPublicId } = await uploadToCloudinary(file.buffer, folder, publicId);

  const doc = await EmployeeDocument.create({
    employeeId: employee._id,
    organizationId: reqUser.organizationId,
    documentType: body.documentType,
    documentName: body.documentName,
    documentUrl: url,
    publicId: cloudPublicId,
    fileSizeBytes: file.size,
    mimeType: file.mimetype,
    uploadedBy: reqUser.userId,
    expiryDate: body.expiryDate || null,
    notes: body.notes || null,
    createdBy: reqUser.userId,
    status: 'active',
  });

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'EMPLOYEE_DOCUMENT_UPLOADED',
    entityType: 'EmployeeDocument',
    entityId: doc._id,
    newValue: { documentType: body.documentType, documentName: body.documentName },
    outcome: 'Success',
  });

  return doc;
};

/**
 * Verify an uploaded employee document.
 */
const verifyEmployeeDocument = async (id, docId, { isVerified, notes }, reqUser) => {
  const doc = await EmployeeDocument.findOne({
    _id: docId,
    employeeId: id,
    organizationId: reqUser.organizationId,
    status: 'active',
  });
  if (!doc) {
    throw new NotFoundError('Document not found.');
  }

  doc.isVerified = isVerified;
  doc.verifiedBy = reqUser.userId;
  doc.verifiedAt = new Date();
  if (notes !== undefined) doc.notes = notes;
  await doc.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'EMPLOYEE_DOCUMENT_VERIFIED',
    entityType: 'EmployeeDocument',
    entityId: doc._id,
    newValue: { isVerified, notes },
    outcome: 'Success',
  });

  return doc;
};

/**
 * Soft delete an employee document and remove from Cloudinary.
 */
const deleteEmployeeDocument = async (id, docId, reqUser) => {
  const doc = await EmployeeDocument.findOne({
    _id: docId,
    employeeId: id,
    organizationId: reqUser.organizationId,
    status: 'active',
  });
  if (!doc) {
    throw new NotFoundError('Document not found.');
  }

  await deleteFromCloudinary(doc.publicId).catch((err) =>
    logger.warn(`Cloudinary deletion failed for publicId ${doc.publicId}: ${err.message}`)
  );

  doc.status = 'archived';
  await doc.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'EMPLOYEE_DOCUMENT_DELETED',
    entityType: 'EmployeeDocument',
    entityId: doc._id,
    outcome: 'Success',
  });

  return { message: 'Document deleted successfully.' };
};

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  updateEmploymentStatus,
  archiveEmployee,
  getEmployeeTimeline,
  updateProfilePhoto,
  listEmployeeDocuments,
  uploadEmployeeDocument,
  verifyEmployeeDocument,
  deleteEmployeeDocument,
};
