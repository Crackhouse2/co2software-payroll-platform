// Create this file to test without AWS initially
// packages/domains/employees/src/repository/mock-employee-repository.ts

import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeFilter } from '../types/employee';

// Mock data for testing
const mockEmployees: Employee[] = [
  {
    tenantId: 'co2software',
    employeeId: 'emp_001',
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@co2software.co.uk',
      phone: '+44 7123 456789',
      dateOfBirth: '1990-05-15',
      nationalInsuranceNumber: 'AB123456C',
      address: {
        line1: '123 Tech Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'UK'
      }
    },
    employment: {
      startDate: '2024-01-15',
      jobTitle: 'Senior Software Developer',
      department: 'Engineering',
      employmentType: 'PERMANENT',
      status: 'ACTIVE',
      annualSalary: 65000,
      workingHours: {
        monday: 8, tuesday: 8, wednesday: 8, thursday: 8, friday: 8,
        saturday: 0, sunday: 0
      }
    },
    payroll: {
      payrollFrequency: 'MONTHLY',
      taxCode: '1257L'
    },
    metadata: {
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      createdBy: 'admin@co2software.co.uk',
      version: 1
    }
  }
];

export class MockEmployeeRepository {
  private employees: Employee[] = [...mockEmployees];

  constructor(
    private tenantId: string,
    private environment: string,
    private region: string
  ) {}

  async createEmployee(request: CreateEmployeeRequest, createdBy: string): Promise<Employee> {
    const employeeId = `emp_${Date.now()}`;
    const now = new Date().toISOString();

    const employee: Employee = {
      tenantId: this.tenantId,
      employeeId,
      personalInfo: request.personalInfo,
      employment: {
        ...request.employment,
        status: 'ACTIVE'
      },
      payroll: request.payroll,
      metadata: {
        createdAt: now,
        updatedAt: now,
        createdBy,
        version: 1
      }
    };

    this.employees.push(employee);
    console.log('✅ Mock: Created employee', employee.employeeId);
    return employee;
  }

  async getEmployee(employeeId: string): Promise<Employee | null> {
    const employee = this.employees.find(e => e.employeeId === employeeId);
    return employee || null;
  }

  async updateEmployee(request: UpdateEmployeeRequest): Promise<Employee> {
    const index = this.employees.findIndex(e => e.employeeId === request.employeeId);
    if (index === -1) {
      throw new Error('Employee not found');
    }

    const employee = this.employees[index];
    const updated = {
      ...employee,
      ...(request.personalInfo && { personalInfo: { ...employee.personalInfo, ...request.personalInfo } }),
      ...(request.employment && { employment: { ...employee.employment, ...request.employment } }),
      ...(request.payroll && { payroll: { ...employee.payroll, ...request.payroll } }),
      metadata: {
        ...employee.metadata,
        updatedAt: new Date().toISOString(),
        version: employee.metadata.version + 1
      }
    };

    this.employees[index] = updated;
    console.log('✅ Mock: Updated employee', updated.employeeId);
    return updated;
  }

  async listEmployees(filter?: Omit<EmployeeFilter, 'tenantId'>): Promise<Employee[]> {
    let filtered = this.employees;

    if (filter?.status) {
      filtered = filtered.filter(e => e.employment.status === filter.status);
    }
    if (filter?.department) {
      filtered = filtered.filter(e => e.employment.department === filter.department);
    }
    if (filter?.employmentType) {
      filtered = filtered.filter(e => e.employment.employmentType === filter.employmentType);
    }
    if (filter?.searchTerm) {
      const search = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.personalInfo.firstName.toLowerCase().includes(search) ||
        e.personalInfo.lastName.toLowerCase().includes(search) ||
        e.personalInfo.email.toLowerCase().includes(search)
      );
    }

    console.log('✅ Mock: Listed employees', filtered.length);
    return filtered;
  }
}
