import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  
  // Mock employee data for now
  return json({
    employees: [
      {
        id: 'emp_001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@co2software.co.uk',
        department: 'Engineering',
        jobTitle: 'Senior Software Developer',
        status: 'active',
        startDate: '2024-01-15',
        salary: 65000
      },
      {
        id: 'emp_002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@co2software.co.uk',
        department: 'Sales',
        jobTitle: 'Product Manager',
        status: 'active',
        startDate: '2023-11-01',
        salary: 58000
      },
      {
        id: 'emp_003',
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike.wilson@co2software.co.uk',
        department: 'Marketing',
        jobTitle: 'Marketing Specialist',
        status: 'inactive',
        startDate: '2024-02-20',
        salary: 42000
      }
    ]
  });
}

export default function AdminEmployees() {
  const { employees } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
            <p className="text-gray-600">Manage your team members and their employment details</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Add New Employee
          </button>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{employee.email}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                employee.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {employee.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div><strong>Role:</strong> {employee.jobTitle}</div>
              <div><strong>Department:</strong> {employee.department}</div>
              <div><strong>Start Date:</strong> {new Date(employee.startDate).toLocaleDateString()}</div>
              <div><strong>Salary:</strong> £{employee.salary.toLocaleString()}</div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded text-sm font-medium">
                Edit
              </button>
              <button className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded text-sm font-medium">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-blue-500 text-lg">🚀</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Ready for Integration</h3>
            <p className="mt-1 text-sm text-blue-700">
              This page is ready to integrate your full employee management system from packages/domains/employees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
