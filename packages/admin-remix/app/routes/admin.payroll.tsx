import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({ message: "Payroll Calculator" });
}

export async function action({ request }: { request: Request }) {
  await requireUserId(request);
  
  const formData = await request.formData();
  const hours = Number(formData.get("hours"));
  const rate = Number(formData.get("rate"));
  
  if (!hours || !rate) {
    return json({ error: "Please provide both hours and rate" }, { status: 400 });
  }
  
  const grossPay = hours * rate;
  const taxRate = 0.2; // 20% tax for demo
  const taxDeduction = grossPay * taxRate;
  const netPay = grossPay - taxDeduction;
  
  return json({
    grossPay: grossPay.toFixed(2),
    taxDeduction: taxDeduction.toFixed(2),
    netPay: netPay.toFixed(2),
    hours,
    rate
  });
}

export default function AdminPayroll() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Payroll Calculator</h2>
        <p className="text-gray-600">Calculate employee pay with automatic tax deductions</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <Form method="post" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                Hours Worked
              </label>
              <input
                type="number"
                name="hours"
                id="hours"
                step="0.1"
                defaultValue="40"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                Hourly Rate (£)
              </label>
              <input
                type="number"
                name="rate"
                id="rate"
                step="0.01"
                defaultValue="25"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Calculate Payroll
          </button>
        </Form>

        {actionData?.error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{actionData.error}</p>
          </div>
        )}

        {actionData?.grossPay && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-green-800 mb-3">Payroll Results</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Hours Worked:</span>
                <span className="font-medium">{actionData.hours}</span>
              </div>
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span className="font-medium">£{actionData.rate}</span>
              </div>
              <div className="flex justify-between">
                <span>Gross Pay:</span>
                <span className="font-medium">£{actionData.grossPay}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Deduction (20%):</span>
                <span className="font-medium">£{actionData.taxDeduction}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Net Pay:</span>
                <span className="font-bold text-green-700">£{actionData.netPay}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
