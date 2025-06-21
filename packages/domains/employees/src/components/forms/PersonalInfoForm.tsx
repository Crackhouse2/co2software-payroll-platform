import { useFormContext } from 'react-hook-form';
import { CreateEmployeeFormData } from '../../validation/employee-schemas';

export function PersonalInfoForm() {
  const { register, formState: { errors } } = useFormContext<CreateEmployeeFormData>();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="personalInfo.firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            {...register('personalInfo.firstName')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personalInfo?.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="personalInfo.lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            {...register('personalInfo.lastName')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personalInfo?.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.lastName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="personalInfo.email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            {...register('personalInfo.email')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personalInfo?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="personalInfo.phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            placeholder="+44 7123 456789"
            {...register('personalInfo.phone')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personalInfo?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="personalInfo.dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth *
          </label>
          <input
            type="date"
            {...register('personalInfo.dateOfBirth')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personalInfo?.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="personalInfo.nationalInsuranceNumber" className="block text-sm font-medium text-gray-700">
            National Insurance Number
          </label>
          <input
            type="text"
            placeholder="AB123456C"
            {...register('personalInfo.nationalInsuranceNumber')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personalInfo?.nationalInsuranceNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.nationalInsuranceNumber.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Address</h4>
        
        <div>
          <label htmlFor="personalInfo.address.line1" className="block text-sm font-medium text-gray-700">
            Address Line 1 *
          </label>
          <input
            type="text"
            {...register('personalInfo.address.line1')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personalInfo?.address?.line1 && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.address.line1.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="personalInfo.address.line2" className="block text-sm font-medium text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            {...register('personalInfo.address.line2')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="personalInfo.address.city" className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              {...register('personalInfo.address.city')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.personalInfo?.address?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.address.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="personalInfo.address.postcode" className="block text-sm font-medium text-gray-700">
              Postcode *
            </label>
            <input
              type="text"
              placeholder="SW1A 1AA"
              {...register('personalInfo.address.postcode')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.personalInfo?.address?.postcode && (
              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.address.postcode.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="personalInfo.address.country" className="block text-sm font-medium text-gray-700">
              Country *
            </label>
            <select
              {...register('personalInfo.address.country')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="UK">United Kingdom</option>
              <option value="US">United States</option>
              <option value="IE">Ireland</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
