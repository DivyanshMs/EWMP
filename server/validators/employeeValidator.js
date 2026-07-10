/**
 * employeeValidator.js — Phase 4A
 * Zod schemas for Employee Management endpoints.
 *
 * Authority: API_SPECIFICATION.md Section 6.6
 *            DEVELOPMENT_ORDER.md Step 20
 */

const {
  z,
  objectIdSchema,
  emailSchema,
  passwordSchema,
  dateStringSchema,
} = require('./validationFramework');
const { ROLES } = require('../config/constants');

const roleValues = Object.values(ROLES);

const addressSchema = z.object({
  street: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  pincode: z.string().trim().max(10).optional(),
}).optional();

const emergencyContactSchema = z.object({
  name: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(15).optional(),
  relation: z.string().trim().max(50).optional(),
}).optional();

const createEmployeeSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  email: emailSchema,
  mobile: z.string().trim().regex(/^\d{10}$/, 'Mobile number must be a valid 10-digit number'),
  password: passwordSchema,
  role: z.enum(roleValues, {
    errorMap: () => ({ message: `Role must be one of: ${roleValues.join(', ')}` }),
  }),
  departmentId: objectIdSchema,
  designationId: objectIdSchema,
  locationId: objectIdSchema.optional().nullable(),
  shiftId: objectIdSchema.optional().nullable(),
  managerId: objectIdSchema.optional().nullable(),
  joiningDate: dateStringSchema,
  employmentType: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Intern']),
  salaryStructureId: objectIdSchema.optional().nullable(),
  basicSalary: z.number().min(0).optional().default(0),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer Not to Say']).optional(),
  dateOfBirth: dateStringSchema.optional().nullable(),
  address: addressSchema,
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
  emergencyContact: emergencyContactSchema,
  aadharNumber: z.string().trim().regex(/^\d{12}$/, 'Aadhar number must be 12 digits').optional().nullable(),
  panNumber: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format').optional().nullable(),
  bankAccountNumber: z.string().trim().max(20).optional().nullable(),
  bankIfscCode: z.string().trim().toUpperCase().max(15).optional().nullable(),
});

const updateEmployeeSchema = z.object({
  firstName: z.string().trim().min(1).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional(),
  mobile: z.string().trim().regex(/^\d{10}$/, 'Mobile number must be a valid 10-digit number').optional(),
  departmentId: objectIdSchema.optional(),
  designationId: objectIdSchema.optional(),
  locationId: objectIdSchema.optional().nullable(),
  shiftId: objectIdSchema.optional().nullable(),
  managerId: objectIdSchema.optional().nullable(),
  joiningDate: dateStringSchema.optional(),
  employmentType: z.enum(['Full-Time', 'Part-Time', 'Contract', 'Intern']).optional(),
  salaryStructureId: objectIdSchema.optional().nullable(),
  basicSalary: z.number().min(0).optional(),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer Not to Say']).optional(),
  dateOfBirth: dateStringSchema.optional().nullable(),
  address: addressSchema,
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
  emergencyContact: emergencyContactSchema,
  aadharNumber: z.string().trim().regex(/^\d{12}$/, 'Aadhar number must be 12 digits').optional().nullable(),
  panNumber: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format').optional().nullable(),
  bankAccountNumber: z.string().trim().max(20).optional().nullable(),
  bankIfscCode: z.string().trim().toUpperCase().max(15).optional().nullable(),
});

const updateStatusSchema = z.object({
  employmentStatus: z.enum(['Probation', 'Permanent', 'Notice Period', 'Resigned', 'Terminated']),
  exitDate: dateStringSchema.optional().nullable(),
  exitReason: z.string().trim().max(500).optional().nullable(),
}).refine((data) => {
  if (['Resigned', 'Terminated'].includes(data.employmentStatus)) {
    return !!data.exitDate;
  }
  return true;
}, {
  message: 'Exit date is required when status is Resigned or Terminated',
  path: ['exitDate'],
});

const uploadDocumentSchema = z.object({
  documentType: z.enum([
    'Aadhaar',
    'PAN',
    'Resume',
    'Offer Letter',
    'Experience Letter',
    'Educational Certificate',
    'Photograph',
    'Other',
  ]),
  documentName: z.string().trim().min(1, 'Document name is required').max(200),
  expiryDate: dateStringSchema.optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});

const verifyDocumentSchema = z.object({
  isVerified: z.preprocess((val) => {
    if (typeof val === 'string') return val === 'true';
    return val;
  }, z.boolean()),
  notes: z.string().trim().max(500).optional().nullable(),
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateStatusSchema,
  uploadDocumentSchema,
  verifyDocumentSchema,
};
