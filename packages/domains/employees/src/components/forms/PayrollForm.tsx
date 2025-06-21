import { useFormContext } from 'react-hook-form';
import { CreateEmployeeFormData } from '../../validation/employee-schemas';

export function PayrollForm() {
  const { register, formState: { errors } } = useFormContext<CreateEmployeeFormData>();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payroll Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="payroll.payrollFrequency" className="block text-sm font-medium text-gray-700">
            Payroll Frequency *
          </label>
          <select
            {...register('payroll.payrollFrequency')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Frequency</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
          {errors.payroll?.payrollFrequency && (
            <p className="mt-1 text-sm text-red-600">{errors.payroll.payrollFrequency.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="payroll.taxCode" className="block text-sm font-medium text-gray-700">
            Tax Code
          </label>
          <input
            type="text"
            placeholder="1257L"
            {...register('payroll.taxCode')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.payroll?.taxCode && (
            <p className="mt-1 text-sm text-red-600">{errors.payroll.taxCode.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="payroll.pensionScheme" className="block text-sm font-medium text-gray-700">
            Pension Scheme
          </label>
          <input
            type="text"
            placeholder="e.g., Company Pension, NEST, Personal Pension"
            {...register('payroll.pensionScheme')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.payroll?.pensionScheme && (
            <p className="mt-1 text-sm text-red-600">{errors.payroll.pensionScheme.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Bank Details (Optional)</h4>
        <p className="text-sm text-gray-600">Bank details can be added later if not available now.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="payroll.bankDetails.accountName" className="block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <input
              type="text"
              {...register('payroll.bankDetails.accountName')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.payroll?.bankDetails?.accountName && (
              <p className="mt-1 text-sm text-red-600">{errors.payroll.bankDetails.accountName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="payroll.bankDetails.accountNumber" className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              placeholder="12345678"
              maxLength={8}
              {...register('payroll.bankDetails.accountNumber')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.payroll?.bankDetails?.accountNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.payroll.bankDetails.accountNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="payroll.bankDetails.sortCode" className="block text-sm font-medium text-gray-700">
              Sort Code
            </label>
            <input
              type="text"
              placeholder="12-34-56"
              {...register('payroll.bankDetails.sortCode')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.payroll?.bankDetails?.sortCode && (
              <p className="mt-1 text-sm text-red-600">{errors.payroll.bankDetails.sortCode.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
