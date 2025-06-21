import { useState, useEffect } from 'react';
import { Employee, EmployeeFilter } from '../../types/employee';
import { EmployeeRepository } from '../../repository/employee-repository';
import { EmployeeSearchForm } from './EmployeeSearchForm';
import { EmployeeTable } from './EmployeeTable';

interface EmployeeListProps {
  tenantId: string;
  environment: string;
  region: string;
  onEditEmployee?: (employee: Employee) => void;
  onCreateEmployee?: () => void;
}

export function EmployeeList({ 
  tenantId, 
  environment, 
  region, 
  onEditEmployee, 
  onCreateEmployee 
}: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Omit<EmployeeFilter, 'tenantId'>>({});

  const repository = new EmployeeRepository(tenantId, environment, region);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await repository.listEmployees(filter);
      setEmployees(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [filter]);

  const handleSearch = (newFilter: Omit<EmployeeFilter, 'tenantId'>) => {
    setFilter(newFilter);
  };

  const handleRefresh = () => {
    loadEmployees();
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Employees</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={handleRefresh}
                className="bg-red-100 px-2 py-1 text-sm font-medium text-red-800 rounded-md hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your team members and their employment details
          </p>
        </div>
        {onCreateEmployee && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={onCreateEmployee}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Employee
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <EmployeeSearchForm onSearch={handleSearch} initialFilter={filter} />

      {/* Employee Table */}
      <EmployeeTable 
        employees={employees} 
        loading={loading}
        onEditEmployee={onEditEmployee}
        onRefresh={handleRefresh}
      />

      {/* Summary */}
      {!loading && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <span className="text-sm text-gray-700">
              {employees.length} employee{employees.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{employees.length}</span> employee{employees.length !== 1 ? 's' : ''}
                {filter.status && (
                  <span> with status <span className="font-medium">{filter.status.toLowerCase()}</span></span>
                )}
                {filter.department && (
                  <span> in <span className="font-medium">{filter.department}</span></span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
