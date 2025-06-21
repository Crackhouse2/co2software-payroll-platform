import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEmployeeSchema, CreateEmployeeFormData } from '../validation/employee-schemas';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { EmploymentForm } from './forms/EmploymentForm';
import { PayrollForm } from './forms/PayrollForm';

interface EmployeeFormProps {
  onSubmit: (data: CreateEmployeeFormData) => Promise<void>;
  initialData?: Partial<CreateEmployeeFormData>;
  isLoading?: boolean;
}

export function EmployeeForm({ onSubmit, initialData, isLoading = false }: EmployeeFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const methods = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: {
          line1: '',
          city: '',
          postcode: '',
          country: 'UK'
        }
      },
      employment: {
        startDate: '',
        jobTitle: '',
        department: '',
        employmentType: 'PERMANENT',
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
        payrollFrequency: 'MONTHLY'
      },
      ...initialData
    }
  });

  const steps = [
    { title: 'Personal Information', component: PersonalInfoForm },
    { title: 'Employment Details', component: EmploymentForm },
    { title: 'Payroll Setup', component: PayrollForm }
  ];

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: CreateEmployeeFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Add bounds checking
  const currentStepData = steps[currentStep];
  if (!currentStepData) {
    console.error('Invalid step index:', currentStep);
    return <div>Error: Invalid form step</div>;
  }

  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-gray-200">
        <nav className="flex space-x-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex items-center space-x-2 ${
                index === currentStep
                  ? 'text-blue-600'
                  : index < currentStep
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === currentStep
                    ? 'bg-blue-100 text-blue-600'
                    : index < currentStep
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Form Content */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="p-6">
          <CurrentStepComponent />

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Employee...' : 'Create Employee'}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
