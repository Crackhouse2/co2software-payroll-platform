import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";

import { requireUserId } from "~/utils/session.server";
import { getUserById } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ user });
}

export default function AdminLayout() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">co2software</h1>
              <span className="ml-3 text-gray-500">Payroll Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span className="text-sm text-gray-700">{user.firstName} {user.lastName}</span>
              </div>
              
              <Form action="/logout" method="post">
                <button 
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md"
                >
                  Sign Out
                </button>
              </Form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4">
            <div className="flex space-x-8">
              <Link 
                to="/admin" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin') && location.pathname === '/admin'
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/admin/employees" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/employees')
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                👥 Employees
              </Link>
              <Link 
                to="/admin/payroll" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/payroll')
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                💰 Payroll
              </Link>
              <Link 
                to="/admin/users" 
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/admin/users')
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                👤 Users
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <Outlet />
      </div>
    </div>
  );
}
