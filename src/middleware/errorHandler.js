const { AppError } = require('../utils/errors');

/**
 * Handle Sequelize Validation Errors
 */
const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return {
    statusCode: 422,
    message: 'Validation failed',
    errors,
  };
};

/**
 * Handle Sequelize Unique Constraint Errors
 */
const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0]?.path || 'field';
  return {
    statusCode: 409,
    message: `${field} already exists`,
  };
};

/**
 * Handle Sequelize Foreign Key Constraint Errors
 */
const handleSequelizeForeignKeyConstraintError = (err) => {
  return {
    statusCode: 400,
    message: 'Invalid reference to related resource',
  };
};

/**
 * Handle Sequelize Database Errors
 */
const handleSequelizeDatabaseError = (err) => {
  if (err.name === 'SequelizeValidationError') {
    return handleSequelizeValidationError(err);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return handleSequelizeUniqueConstraintError(err);
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return handleSequelizeForeignKeyConstraintError(err);
  }
  return {
    statusCode: 500,
    message: 'Database error occurred',
  };
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    ...(err.errors && { errors: err.errors }),
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  } else {
    // Programming or unknown error: don't leak error details
    console.error('ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // Handle Sequelize errors
  if (err.name && err.name.startsWith('Sequelize')) {
    const sequelizeError = handleSequelizeDatabaseError(err);
    error = new AppError(sequelizeError.message, sequelizeError.statusCode);
    if (sequelizeError.errors) {
      error.errors = sequelizeError.errors;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  // Handle Cast errors (invalid ID format, etc.)
  if (err.name === 'CastError') {
    error = new AppError('Invalid data format', 400);
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 - Route not found
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl}`,
    404
  );
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
