import { useState } from 'react';
import { Employee } from '../types/employee';
import { CreateEmployeeFormData } from '../validation/employee-schemas';
import { EmployeeList } from './list/EmployeeList';
import { EmployeeForm } from './EmployeeForm';
import { EmployeeRepository } from '../repository/employee-repository';

interface EmployeeManagementProps {
  tenantId: string;
  environment: string;
  region: string;
  currentUser: {
    email: string;
    name: string;
  };
}

export function EmployeeManagement({ tenantId, environment, region, currentUser }: EmployeeManagementProps) {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const repository = new EmployeeRepository(tenantId, environment, region);

  const handleCreateEmployee = async (data: CreateEmployeeFormData) => {
    try {
      setIsSubmitting(true);
      await repository.createEmployee(data, currentUser.email);
      setCurrentView('list');
      // Could add toast notification here
    } catch (error) {
      console.error('Error creating employee:', error);
      // Could add error notification here
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
        <EmployeeForm 
          onSubmit={handleCreateEmployee} 
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  if (currentView === 'edit' && selectedEmployee) {
    // For now, redirect to edit form - could extend EmployeeForm for editing
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
          <h3 className="text-sm font-medium text-yellow-800">Edit Mode</h3>
          <p className="mt-1 text-sm text-yellow-700">
            Edit functionality for {selectedEmployee.personalInfo.firstName} {selectedEmployee.personalInfo.lastName} will be implemented in the next phase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
