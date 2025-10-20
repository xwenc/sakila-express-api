const { errorHandler, notFoundHandler } = require('../../../src/middleware/errorHandler');
const {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ValidationError,
  InternalServerError,
} = require('../../../src/utils/errors');

describe('Error Handler Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { method: 'GET', originalUrl: '/api/test' };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    // Store original NODE_ENV
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    describe('Operational Errors', () => {
      it('should handle BadRequestError correctly', () => {
        const error = new BadRequestError('Invalid input');
        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          message: 'Invalid input',
        });
      });

      it('should handle NotFoundError correctly', () => {
        const error = new NotFoundError('Resource not found');
        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          message: 'Resource not found',
        });
      });

      it('should handle UnauthorizedError correctly', () => {
        const error = new UnauthorizedError('Please login');
        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          message: 'Please login',
        });
      });

      it('should handle ForbiddenError correctly', () => {
        const error = new ForbiddenError('Access denied');
        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          message: 'Access denied',
        });
      });

      it('should handle ConflictError correctly', () => {
        const error = new ConflictError('Resource already exists');
        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          message: 'Resource already exists',
        });
      });

      it('should handle ValidationError correctly', () => {
        const error = new ValidationError('Validation failed');
        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'fail',
            message: 'Validation failed',
          })
        );
      });

      it('should handle InternalServerError correctly', () => {
        const error = new InternalServerError('Server error');
        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'error',
          message: 'Server error',
        });
      });
    });

    describe('Sequelize Errors', () => {
      it('should handle SequelizeValidationError', () => {
        const error = {
          name: 'SequelizeValidationError',
          errors: [
            { path: 'email', message: 'email must be unique' },
            { path: 'name', message: 'name is required' },
          ],
        };

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'fail',
            message: 'Validation failed',
          })
        );
      });

      it('should handle SequelizeUniqueConstraintError', () => {
        const error = {
          name: 'SequelizeUniqueConstraintError',
          errors: [{ path: 'email', message: 'email must be unique' }],
        };

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'fail',
            message: expect.stringContaining('already exists'),
          })
        );
      });

      it('should handle SequelizeForeignKeyConstraintError', () => {
        const error = {
          name: 'SequelizeForeignKeyConstraintError',
          message: 'Foreign key constraint failed',
        };

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'fail',
            message: expect.stringContaining('Invalid reference'),
          })
        );
      });
    });

    describe('Development vs Production Mode', () => {
      it('should send detailed error in development mode', () => {
        process.env.NODE_ENV = 'development';
        const error = new BadRequestError('Test error');

        errorHandler(error, mockReq, mockRes, mockNext);

        const response = mockRes.json.mock.calls[0][0];
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(response).toHaveProperty('status', 'fail');
        expect(response).toHaveProperty('message', 'Test error');
        expect(response).toHaveProperty('error');
        expect(response).toHaveProperty('stack');
      });

      it('should send minimal error in production mode', () => {
        process.env.NODE_ENV = 'production';
        const error = new BadRequestError('Test error');

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          message: 'Test error',
        });
        expect(mockRes.json).not.toHaveBeenCalledWith(
          expect.objectContaining({
            stack: expect.any(String),
          })
        );
      });

      it('should hide non-operational errors in production', () => {
        process.env.NODE_ENV = 'production';
        const error = new Error('Database connection failed');
        error.isOperational = false;

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'error',
          message: 'Something went wrong',
        });
      });
    });

    describe('Non-operational Errors', () => {
      it('should log and handle programming errors', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const error = new Error('Unexpected error');

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(consoleSpy).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        consoleSpy.mockRestore();
      });

      it('should handle errors without statusCode', () => {
        const error = new Error('Generic error');

        errorHandler(error, mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'error',
          })
        );
      });
    });
  });

  describe('notFoundHandler', () => {
    it('should create NotFoundError for GET request', () => {
      mockReq = { method: 'GET', originalUrl: '/api/unknown' };

      notFoundHandler(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: 'Cannot GET /api/unknown',
        })
      );
    });

    it('should create NotFoundError for POST request', () => {
      mockReq = { method: 'POST', originalUrl: '/api/unknown' };

      notFoundHandler(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: 'Cannot POST /api/unknown',
        })
      );
    });

    it('should create AppError with correct error type', () => {
      mockReq = { method: 'GET', originalUrl: '/api/test' };

      notFoundHandler(mockReq, mockRes, mockNext);

      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
      expect(error.message).toBe('Cannot GET /api/test');
    });
  });
});
