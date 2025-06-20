// Configuration for co2software Payroll Admin UI
window.AppConfig = {
  // API Configuration - Updated by deployment
  API_BASE_URL: 'https://1kpszc7ohk.execute-api.eu-west-2.amazonaws.com/prod/',
  
  // App Configuration
  APP_NAME: 'co2software Payroll',
  VERSION: '1.0.0',
  
  // Default Admin Credentials (for demo)
  DEFAULT_ADMIN_EMAIL: 'admin@co2software.co.uk',
  
  // AWS Configuration
  USER_POOL_ID: 'eu-west-2_fIYX1VxbP',
  CLIENT_ID: '3ln01ije3h2hlgk3ul2tcgrq0d',
  AWS_REGION: 'eu-west-2',
  
  // Feature Flags
  FEATURES: {
    SHOW_API_TEST_TAB: true,
    SHOW_DEPLOYMENT_INSTRUCTIONS: false,
    AUTO_DETECT_API: false
  }
};

// Set deployed API URL globally
window.DEPLOYED_API_URL = 'https://1kpszc7ohk.execute-api.eu-west-2.amazonaws.com/prod/';

console.log('🚀 Admin UI configured for deployment:', window.AppConfig);
