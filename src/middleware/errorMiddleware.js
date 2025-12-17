import { Prisma } from '../generated/client/index.js';
import logger from '../utils/logger.js';
import parsePrismaError from '../utils/prismaErrors.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * Global error handling middleware
 * Handles different types of errors and sends appropriate responses
 */
export const errorHandler = (err, req, res, next) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });

    // Default error
    let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Internal server error';
    let errors = null;

    // Handle Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError ||
        err instanceof Prisma.PrismaClientValidationError ||
        err instanceof Prisma.PrismaClientInitializationError) {
        const prismaError = parsePrismaError(err);
        statusCode = prismaError.statusCode;
        message = prismaError.message;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = 'Token has expired';
    }

    // Handle Zod validation errors
    if (err.name === 'ZodError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Validation failed';
        errors = err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
        }));
    }

    // Build response
    const response = {
        status: 'error',
        message
    };

    if (errors) {
        response.errors = errors;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 * Must be placed after all routes
 */
export const notFoundHandler = (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.path}`
    });
};
