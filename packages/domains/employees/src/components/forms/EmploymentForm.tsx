import { useFormContext } from 'react-hook-form';
import { CreateEmployeeFormData } from '../../validation/employee-schemas';

export function EmploymentForm() {
  const { register, watch, formState: { errors } } = useFormContext<CreateEmployeeFormData>();
  
  const employmentType = watch('employment.employmentType');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="employment.startDate" className="block text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            type="date"
            {...register('employment.startDate')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.employment?.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.employment.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="employment.endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            {...register('employment.endDate')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.employment?.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.employment.endDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="employment.jobTitle" className="block text-sm font-medium text-gray-700">
            Job Title *
          </label>
          <input
            type="text"
            {...register('employment.jobTitle')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.employment?.jobTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.employment.jobTitle.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="employment.department" className="block text-sm font-medium text-gray-700">
            Department *
          </label>
          <select
            {...register('employment.department')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Customer Support">Customer Support</option>
          </select>
          {errors.employment?.department && (
            <p className="mt-1 text-sm text-red-600">{errors.employment.department.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="employment.employmentType" className="block text-sm font-medium text-gray-700">
            Employment Type *
          </label>
          <select
            {...register('employment.employmentType')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Type</option>
            <option value="PERMANENT">Permanent</option>
            <option value="TEMPORARY">Temporary</option>
            <option value="CONTRACTOR">Contractor</option>
          </select>
          {errors.employment?.employmentType && (
            <p className="mt-1 text-sm text-red-600">{errors.employment.employmentType.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="employment.hourlyRate" className="block text-sm font-medium text-gray-700">
            Hourly Rate (£) {employmentType === 'CONTRACTOR' ? '*' : ''}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('employment.hourlyRate', { valueAsNumber: true })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.employment?.hourlyRate && (
            <p className="mt-1 text-sm text-red-600">{errors.employment.hourlyRate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="employment.annualSalary" className="block text-sm font-medium text-gray-700">
            Annual Salary (£) {employmentType === 'PERMANENT' ? '*' : ''}
          </label>
          <input
            type="number"
            step="1000"
            min="0"
            {...register('employment.annualSalary', { valueAsNumber: true })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.employment?.annualSalary && (
            <p className="mt-1 text-sm text-red-600">{errors.employment.annualSalary.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Working Hours (per day)</h4>
        <div className="grid grid-cols-7 gap-2">
          {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
            <div key={day}>
              <label className="block text-xs font-medium text-gray-700 capitalize">
                {day.slice(0, 3)}
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                {...register(`employment.workingHours.${day}`, { valueAsNumber: true })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
