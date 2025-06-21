import { EmployeeRepository } from '../repository/employee-repository';
import { createCo2SoftwareConfig } from '../config/tenant-config';

// Example: Initialize repository for co2software in production
const config = createCo2SoftwareConfig('prod');
const employeeRepo = new EmployeeRepository(
  config.tenantId,
  config.environment, 
  config.region
);

// Repository will use table: co2software-employees-prod-eu-west-2
// Complete isolation from other tenants

// Example: Create employee for co2software
export async function createExampleEmployee(): Promise<void> {
  const newEmployee = await employeeRepo.createEmployee({
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+44 7123 456789',
      dateOfBirth: '1990-05-15',
      nationalInsuranceNumber: 'AB123456C',
      address: {
        line1: '123 Main Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'UK'
      }
    },
    employment: {
      startDate: '2024-01-01',
      jobTitle: 'Software Developer',
      department: 'Engineering',
      employmentType: 'PERMANENT',
      hourlyRate: 35.00,
      workingHours: {
        monday: 8,
        tuesday: 8, 
        wednesday: 8,
        thursday: 8,
        friday: 8,
        saturday: 0,
        sunday: 0
      }
    },
    payroll: {
      payrollFrequency: 'MONTHLY',
      taxCode: '1257L',
      bankDetails: {
        accountNumber: '12345678',
        sortCode: '12-34-56',
        accountName: 'John Smith'
      }
    }
  }, 'admin@co2software.co.uk');

  console.log('Created employee:', newEmployee.employeeId);
}

// Get all active employees for co2software
export async function listActiveEmployees(): Promise<void> {
  const activeEmployees = await employeeRepo.listEmployees({
    status: 'ACTIVE'
  });
  
  console.log(`Found ${activeEmployees.length} active employees`);
}
