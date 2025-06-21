export interface Employee {
  tenantId: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationalInsuranceNumber?: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      postcode: string;
      country: string;
    };
  };
  employment: {
    startDate: string;
    endDate?: string;
    jobTitle: string;
    department: string;
    employmentType: 'PERMANENT' | 'TEMPORARY' | 'CONTRACTOR';
    status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
    hourlyRate?: number;
    annualSalary?: number;
    workingHours: {
      monday: number;
      tuesday: number;
      wednesday: number;
      thursday: number;
      friday: number;
      saturday: number;
      sunday: number;
    };
  };
  payroll: {
    payrollFrequency: 'WEEKLY' | 'MONTHLY';
    taxCode?: string;
    pensionScheme?: string;
    bankDetails?: {
      accountNumber: string;
      sortCode: string;
      accountName: string;
    };
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    version: number;
  };
}

export interface CreateEmployeeRequest {
  personalInfo: Employee['personalInfo'];
  employment: Omit<Employee['employment'], 'status'>;
  payroll: Employee['payroll'];
}

export interface UpdateEmployeeRequest {
  employeeId: string;
  personalInfo?: Partial<Employee['personalInfo']>;
  employment?: Partial<Employee['employment']>;
  payroll?: Partial<Employee['payroll']>;
}

export interface EmployeeFilter {
  status?: Employee['employment']['status'];
  department?: string;
  employmentType?: Employee['employment']['employmentType'];
  searchTerm?: string;
}
