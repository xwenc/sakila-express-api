const asyncHandler = require('../../../src/utils/asyncHandler');

describe('asyncHandler', () => {
  it('should handle successful async function', async () => {
    const mockFn = jest.fn(async (req, res) => {
      res.json({ success: true });
    });

    const req = global.testHelpers.mockRequest();
    const res = global.testHelpers.mockResponse();
    const next = global.testHelpers.mockNext();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(next).not.toHaveBeenCalled();
  });

  it('should catch and pass errors to next', async () => {
    const error = new Error('Test error');
    const mockFn = jest.fn(async () => {
      throw error;
    });

    const req = global.testHelpers.mockRequest();
    const res = global.testHelpers.mockResponse();
    const next = global.testHelpers.mockNext();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should handle promises that resolve', async () => {
    const mockFn = jest.fn(() => Promise.resolve());

    const req = global.testHelpers.mockRequest();
    const res = global.testHelpers.mockResponse();
    const next = global.testHelpers.mockNext();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle promises that reject', async () => {
    const error = new Error('Promise rejected');
    const mockFn = jest.fn(() => Promise.reject(error));

    const req = global.testHelpers.mockRequest();
    const res = global.testHelpers.mockResponse();
    const next = global.testHelpers.mockNext();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should pass through request, response, and next parameters', async () => {
    const mockFn = jest.fn(async (req, res, next) => {
      expect(req.body).toEqual({ test: 'data' });
      expect(res.status).toBeDefined();
      expect(next).toBeDefined();
    });

    const req = global.testHelpers.mockRequest({ body: { test: 'data' } });
    const res = global.testHelpers.mockResponse();
    const next = global.testHelpers.mockNext();

    const handler = asyncHandler(mockFn);
    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
  });
});
