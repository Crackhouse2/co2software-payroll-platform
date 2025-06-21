import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  
  return json({
    stats: {
      totalEmployees: 12,
      activePayrolls: 8,
      pendingApprovals: 3,
      monthlyTotal: 85420.50
    }
  });
}

export default function AdminDashboard() {
  const { stats } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your secure payroll administration panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">👥</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalEmployees}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">💰</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Payrolls</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.activePayrolls}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">⏳</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.pendingApprovals}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">£</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Monthly Total</dt>
                <dd className="text-lg font-medium text-gray-900">£{stats.monthlyTotal.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flow-root">
            <ul className="-mb-8">
              <li className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-white">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Payroll processed for <span className="font-medium text-gray-900">Engineering Department</span>
                        <span className="whitespace-nowrap"> 2 hours ago</span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 ring-8 ring-white">
                    <span className="text-white text-sm">👤</span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        New employee <span className="font-medium text-gray-900">Sarah Johnson</span> added
                        <span className="whitespace-nowrap"> 5 hours ago</span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative">
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 ring-8 ring-white">
                    <span className="text-white text-sm">⚠</span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Timesheet approval pending for <span className="font-medium text-gray-900">Marketing Team</span>
                        <span className="whitespace-nowrap"> 1 day ago</span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
