// Add this to your existing dashboard components directory
import React from 'react';
import { EmployeeManagement } from '@co2software/employees';

interface EmployeeDashboardProps {
  // Use your existing user context/auth
  currentUser: {
    email: string;
    name: string;
  };
}

export function EmployeeDashboard({ currentUser }: EmployeeDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeManagement
        tenantId="co2software"
        environment="local" // or "dev", "stage", "prod" based on your env
        region="eu-west-2"
        currentUser={currentUser}
      />
    </div>
  );
}
