import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({ message: "User management coming soon!" });
}

export default function AdminUsers() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage admin users and permissions</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-500 text-xl">🚧</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Coming Soon</h3>
            <p className="mt-1 text-sm text-yellow-700">
              User management functionality will be available in the next update. 
              This will include user invitations, role management, and permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
