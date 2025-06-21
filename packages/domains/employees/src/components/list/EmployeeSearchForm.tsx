import React, { useState } from 'react';
import { EmployeeFilter } from '../../types/employee';

interface EmployeeSearchFormProps {
  onSearch: (filter: Omit<EmployeeFilter, 'tenantId'>) => void;
  initialFilter?: Omit<EmployeeFilter, 'tenantId'>;
}

export function EmployeeSearchForm({ onSearch, initialFilter = {} }: EmployeeSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilter.searchTerm || '');
  const [status, setStatus] = useState(initialFilter.status || '');
  const [department, setDepartment] = useState(initialFilter.department || '');
  const [employmentType, setEmploymentType] = useState(initialFilter.employmentType || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filter: Omit<EmployeeFilter, 'tenantId'> = {};
    
    if (searchTerm.trim()) filter.searchTerm = searchTerm.trim();
    if (status) filter.status = status as EmployeeFilter['status'];
    if (department) filter.department = department;
    if (employmentType) filter.employmentType = employmentType as EmployeeFilter['employmentType'];
    
    onSearch(filter);
  };

  const handleClear = () => {
    setSearchTerm('');
    setStatus('');
    setDepartment('');
    setEmploymentType('');
    onSearch({});
  };

  const hasActiveFilters = searchTerm || status || department || employmentType;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Search & Filter Employees
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Term */}
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Name or email..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartment(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>

            {/* Employment Type Filter */}
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="employmentType"
                value={employmentType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEmploymentType(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Types</option>
                <option value="PERMANENT">Permanent</option>
                <option value="TEMPORARY">Temporary</option>
                <option value="CONTRACTOR">Contractor</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
