// Global test setup and utilities

// Global test timeout
jest.setTimeout(30000);

// Console override for cleaner test output
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(), // Suppress console.log in tests
  info: jest.fn(),
  warn: jest.fn(),
  error: originalConsole.error, // Keep errors visible
};

// Global test utilities
global.testData = {
  validUser: {
    email: 'admin@co2software.co.uk',
    password: 'AdminPass123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  
  payrollTestCases: [
    { hours: 40, rate: 25, expectedGross: 1000, expectedTax: 200, expectedNet: 800 },
    { hours: 37.5, rate: 24, expectedGross: 900, expectedTax: 180, expectedNet: 720 },
    { hours: 20, rate: 15, expectedGross: 300, expectedTax: 60, expectedNet: 240 },
    { hours: 0, rate: 25, expectedGross: 0, expectedTax: 0, expectedNet: 0 },
  ]
};

// Mock API responses for offline testing
global.mockApiResponses = {
  payrollCalculation: (hours, rate) => ({
    hours,
    rate,
    grossPay: hours * rate,
    tax: hours * rate * 0.2,
    netPay: hours * rate * 0.8,
    calculation: `${hours} hours × $${rate}/hour = $${hours * rate} gross, $${hours * rate * 0.2} tax (20%), $${hours * rate * 0.8} net`
  }),
  
  loginSuccess: {
    success: true,
    user: {
      id: 'test-user-id',
      email: 'admin@co2software.co.uk',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    },
    tokens: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      idToken: 'mock-id-token',
      expiresIn: 3600
    }
  },
  
  loginFailure: {
    success: false,
    error: 'Invalid credentials'
  }
};

// Test helper functions
global.testHelpers = {
  /**
   * Generate random test data
   */
  generateTestUser: () => ({
    email: `test${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    role: 'employee'
  }),
  
  /**
   * Wait for async operations
   */
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  /**
   * Validate payroll calculation
   */
  validatePayrollCalculation: (result, hours, rate) => {
    expect(result).toMatchObject({
      hours: expect.any(Number),
      rate: expect.any(Number),
      grossPay: expect.any(Number),
      tax: expect.any(Number),
      netPay: expect.any(Number)
    });
    
    expect(result.grossPay).toBeCloseTo(hours * rate, 2);
    expect(result.tax).toBeCloseTo(result.grossPay * 0.2, 2);
    expect(result.netPay).toBeCloseTo(result.grossPay * 0.8, 2);
  }
};
