// Jest configuration for unit and integration tests
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/playwright.config.js',
    '!**/jest.config.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '**/unit/**/*.test.js',
    '**/integration/**/*.test.js'
  ],
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/utilities/test-setup.js']
};
