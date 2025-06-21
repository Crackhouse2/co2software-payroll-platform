// Shared types for co2software payroll platform

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export type UserRole = 'admin' | 'payroll_operator' | 'manager' | 'employee';
export type UserStatus = 'active' | 'inactive' | 'pending_invitation';

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
  invitedBy: string;
  invitationToken: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  tokens?: AuthTokens;
  error?: string;
}

export interface InviteUserRequest {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface AcceptInvitationRequest {
  invitationToken: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Simple payroll calculation types for later fragments
export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  hourlyRate: number;
  tenantId: string;
}

export interface TimesheetEntry {
  date: string;
  hours: number;
  employeeId: string;
}

export interface PayrollCalculation {
  employeeId: string;
  grossPay: number;
  tax: number;
  netPay: number;
}

// Calculate simple payroll (100 * 0.2 = 20% tax)
export function calculatePayroll(hours: number, rate: number): PayrollCalculation {
  const grossPay = hours * rate;
  const tax = grossPay * 0.2; // 20% tax
  const netPay = grossPay - tax;
  
  return {
    employeeId: '', // Will be filled by caller
    grossPay,
    tax,
    netPay
  };
}
