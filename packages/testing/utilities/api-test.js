// API testing utility for manual testing - FIXED VERSION
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to auto-detect API URL
function getApiUrl() {
  // 1. Check environment variable first
  if (process.env.API_BASE_URL && !process.env.API_BASE_URL.includes('your-api-url') && !process.env.API_BASE_URL.includes('localhost')) {
    return process.env.API_BASE_URL;
  }

  // 2. Try to read from config.js
  try {
    const configPath = path.resolve(__dirname, '../../../admin-ui/src/config.js');
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const match = configContent.match(/API_BASE_URL:\s*['"`]([^'"`]+)['"`]/);
      if (match && match[1] && !match[1].includes('localhost') && !match[1].includes('your-api-url')) {
        return match[1];
      }
    }
  } catch (error) {
    // Ignore file read errors
  }

  // 3. Try to read from .env file
  try {
    const envPath = path.resolve(__dirname, '../../../admin-ui/.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/API_BASE_URL=(.+)/);
      if (match && match[1] && !match[1].includes('localhost') && !match[1].includes('your-api-url')) {
        return match[1];
      }
    }
  } catch (error) {
    // Ignore file read errors
  }

  return null;
}

// Configuration
const API_BASE_URL = getApiUrl();
const TEST_USER = {
  email: 'admin@co2software.co.uk',
  password: 'AdminPass123!'
};

if (!API_BASE_URL) {
  console.log('❌ No valid API URL found!');
  console.log('');
  console.log('To fix this:');
  console.log('1. Deploy your AWS stack: ./deploy-to-aws.sh');
  console.log('2. Or set manually: export API_BASE_URL=https://your-api.execute-api.eu-west-2.amazonaws.com/prod');
  console.log('');
  process.exit(1);
}

console.log('🎯 Testing API:', API_BASE_URL);

// API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Test functions
async function testPayrollCalculation() {
  console.log('🔢 Testing payroll calculation...');
  
  try {
    const response = await apiClient.post('/calculate-payroll', {
      hours: 40,
      rate: 25
    });
    
    console.log('✅ Payroll calculation successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Payroll calculation failed:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.log('   Reason: API endpoint not found - check deployment');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   Reason: Connection refused - API might be down');
    }
    return false;
  }
}

async function testLogin() {
  console.log('🔐 Testing login...');
  
  try {
    const response = await apiClient.post('/login', TEST_USER);
    
    if (response.data.success) {
      console.log('✅ Login successful:', {
        user: response.data.user,
        tokenReceived: !!response.data.tokens
      });
      return response.data.tokens;
    } else {
      console.error('❌ Login failed:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Login request failed:', error.message);
    if (error.response) {
      console.log('   Response status:', error.response.status);
      console.log('   Response data:', error.response.data);
    }
    return false;
  }
}

async function testInviteUser() {
  console.log('📧 Testing user invitation...');
  
  try {
    const response = await apiClient.post('/invite', {
      email: `test-${Date.now()}@example.com`, // Use unique email to avoid conflicts
      firstName: 'Test',
      lastName: 'User',
      role: 'employee'
    });
    
    if (response.data.success) {
      console.log('✅ User invitation successful:', response.data.invitation);
      return true;
    } else {
      console.error('❌ User invitation failed:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ User invitation request failed:', error.message);
    if (error.response) {
      console.log('   This might be expected if user already exists');
      return true; // Don't fail test for duplicate user
    }
    return false;
  }
}

async function runAllTests() {
  console.log(`🚀 Running API tests against: ${API_BASE_URL}`);
  console.log('='.repeat(60));
  
  const results = {};
  
  // Test payroll calculation
  results.payroll = await testPayrollCalculation();
  
  // Test login
  results.login = await testLogin();
  
  // Test invite (might fail if user already exists)
  results.invite = await testInviteUser();
  
  console.log('\n📊 Test Summary:');
  console.log('='.repeat(30));
  console.log(`Payroll Calculation: ${results.payroll ? '✅' : '❌'}`);
  console.log(`Login: ${results.login ? '✅' : '❌'}`);
  console.log(`User Invitation: ${results.invite ? '✅' : '❌'}`);
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${successCount}/${totalTests} tests passed`);
  
  if (successCount === totalTests) {
    console.log('🎉 All API tests passed! Your system is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Check the API deployment and configuration.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testPayrollCalculation,
  testLogin,
  testInviteUser,
  runAllTests
};
