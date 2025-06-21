// For testing without AWS - use this instead of the real EmployeeManagement
// Copy your existing EmployeeManagement component and modify the repository import

import { useState } from 'react';
import { Employee } from '@co2software/employees';
import { CreateEmployeeFormData } from '@co2software/employees';
import { EmployeeList } from '@co2software/employees';
import { EmployeeForm } from '@co2software/employees';
import { MockEmployeeRepository } from './mock-employee-repository';

interface MockEmployeeManagementProps {
  tenantId: string;
  environment: string;
  region: string;
  currentUser: {
    email: string;
    name: string;
  };
}

export function MockEmployeeManagement({ tenantId, environment, region, currentUser }: MockEmployeeManagementProps) {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use mock repository instead of real one
  const repository = new MockEmployeeRepository(tenantId, environment, region);

  const handleCreateEmployee = async (data: CreateEmployeeFormData) => {
    try {
      setIsSubmitting(true);
      await repository.createEmployee(data, currentUser.email);
      setCurrentView('list');
      alert('✅ Employee created successfully! (Mock data)');
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('❌ Error creating employee: ' + (error as Error).message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEmployee(null);
  };

  if (currentView === 'create') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Employee List
          </button>
        </div>
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-700">
            🔧 <strong>Mock Mode:</strong> This is using mock data for testing. Real AWS integration coming next!
          </p>
        </div>
        <EmployeeForm 
          onSubmit={handleCreateEmployee} 
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  if (currentView === 'edit' && selectedEmployee) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Employee List
          </button>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800">Edit Mode (Mock)</h3>
          <p className="mt-1 text-sm text-yellow-700">
            Edit functionality for {selectedEmployee.personalInfo.firstName} {selectedEmployee.personalInfo.lastName} - using mock data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-700">
          🔧 <strong>Mock Mode:</strong> Testing employee management with sample data. Switch to real AWS when ready!
        </p>
      </div>
      <EmployeeList
        tenantId={tenantId}
        environment={environment}
        region={region}
        onEditEmployee={handleEditEmployee}
        onCreateEmployee={() => setCurrentView('create')}
      />
    </div>
  );
}
