// Test setup file
// This file runs before each test suite

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_DIALECT = 'postgres';
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_NAME = 'sakila_express_test';
process.env.DATABASE_USERNAME = 'postgres';
process.env.DATABASE_PASSWORD = '123456';

// Increase test timeout for database operations
jest.setTimeout(10000);

// Global test utilities
global.testHelpers = {
  // Helper to create a mock request
  mockRequest: (options = {}) => {
    return {
      body: options.body || {},
      params: options.params || {},
      query: options.query || {},
      headers: options.headers || {},
      ...options,
    };
  },

  // Helper to create a mock response
  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },

  // Helper to create a mock next function
  mockNext: () => jest.fn(),
};

// Console error/warn suppression for cleaner test output
// Uncomment if you want to suppress console output in tests
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };
