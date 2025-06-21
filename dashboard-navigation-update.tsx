// Update your existing dashboard navigation to include employees
// Add this to your sidebar/navigation component

const navigationItems = [
  // Your existing nav items...
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: 'HomeIcon' 
  },
  { 
    name: 'Payroll', 
    href: '/payroll', 
    icon: 'CurrencyPoundIcon' 
  },
  // NEW: Add employee management
  { 
    name: 'Employees', 
    href: '/employees', 
    icon: 'UsersIcon',
    description: 'Manage team members and employment details'
  },
  // Rest of your nav items...
];
