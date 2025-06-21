import { z } from 'zod';

// UK postcode validation regex
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

// UK National Insurance Number validation
const UK_NI_REGEX = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i;

// UK phone number validation
const UK_PHONE_REGEX = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;

// UK sort code validation (XX-XX-XX format)
const UK_SORT_CODE_REGEX = /^\d{2}-\d{2}-\d{2}$/;

// Address schema
const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required').max(100),
  line2: z.string().max(100).optional(),
  city: z.string().min(1, 'City is required').max(50),
  postcode: z.string().regex(UK_POSTCODE_REGEX, 'Invalid UK postcode'),
  country: z.string().min(1, 'Country is required').default('UK')
});

// Working hours schema
const workingHoursSchema = z.object({
  monday: z.number().min(0).max(24).default(0),
  tuesday: z.number().min(0).max(24).default(0),
  wednesday: z.number().min(0).max(24).default(0),
  thursday: z.number().min(0).max(24).default(0),
  friday: z.number().min(0).max(24).default(0),
  saturday: z.number().min(0).max(24).default(0),
  sunday: z.number().min(0).max(24).default(0)
});

// Bank details schema
const bankDetailsSchema = z.object({
  accountNumber: z.string().regex(/^\d{8}$/, 'Account number must be 8 digits'),
  sortCode: z.string().regex(UK_SORT_CODE_REGEX, 'Sort code must be in format XX-XX-XX'),
  accountName: z.string().min(1, 'Account name is required').max(100)
});

// Personal information schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(UK_PHONE_REGEX, 'Invalid UK phone number'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  nationalInsuranceNumber: z.string().regex(UK_NI_REGEX, 'Invalid National Insurance number').optional(),
  address: addressSchema
});

// Base employment schema without refinement
const baseEmploymentSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  department: z.string().min(1, 'Department is required').max(50),
  employmentType: z.enum(['PERMANENT', 'TEMPORARY', 'CONTRACTOR']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'TERMINATED']).default('ACTIVE'),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  annualSalary: z.number().min(0, 'Annual salary must be positive').optional(),
  workingHours: workingHoursSchema
});

// Employment schema with refinement
export const employmentSchema = baseEmploymentSchema.refine(
  (data) => data.hourlyRate !== undefined || data.annualSalary !== undefined,
  {
    message: 'Either hourly rate or annual salary must be provided',
    path: ['hourlyRate']
  }
);

// Payroll information schema
export const payrollSchema = z.object({
  payrollFrequency: z.enum(['WEEKLY', 'MONTHLY']),
  taxCode: z.string().max(10).optional(),
  pensionScheme: z.string().max(50).optional(),
  bankDetails: bankDetailsSchema.optional()
});

// Complete employee creation schema - use base schema to avoid ZodEffects issues
export const createEmployeeSchema = z.object({
  personalInfo: personalInfoSchema,
  employment: baseEmploymentSchema.omit({ status: true }), // Status is set automatically
  payroll: payrollSchema
}).refine(
  (data) => data.employment.hourlyRate !== undefined || data.employment.annualSalary !== undefined,
  {
    message: 'Either hourly rate or annual salary must be provided',
    path: ['employment', 'hourlyRate']
  }
);

// Employee update schema (all fields optional except employeeId)
export const updateEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  personalInfo: personalInfoSchema.partial().optional(),
  employment: baseEmploymentSchema.partial().optional(),
  payroll: payrollSchema.partial().optional()
});

// Employee filter schema
export const employeeFilterSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'TERMINATED']).optional(),
  department: z.string().optional(),
  employmentType: z.enum(['PERMANENT', 'TEMPORARY', 'CONTRACTOR']).optional(),
  searchTerm: z.string().optional()
});

// Export types derived from schemas
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type EmploymentFormData = z.infer<typeof baseEmploymentSchema>;
export type PayrollFormData = z.infer<typeof payrollSchema>;
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;
export type EmployeeFilterFormData = z.infer<typeof employeeFilterSchema>;
