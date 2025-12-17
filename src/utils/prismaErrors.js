import { Prisma } from '../generated/client/index.js';
import logger from './logger.js';

/**
 * Parse and format Prisma errors into user-friendly messages
 * @param {Error} error - Prisma error object
 * @returns {Object} Formatted error with message and statusCode
 */
const parsePrismaError = (error) => {
    logger.error('Prisma Error:', error);

    // Prisma Client errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                // Unique constraint violation
                const field = error.meta?.target?.[0] || 'field';
                return {
                    message: `A record with this ${field} already exists`,
                    statusCode: 409
                };

            case 'P2025':
                // Record not found
                return {
                    message: 'Record not found',
                    statusCode: 404
                };

            case 'P2003':
                // Foreign key constraint failed
                return {
                    message: 'Invalid reference to related record',
                    statusCode: 400
                };

            case 'P2014':
                // Required relation violation
                return {
                    message: 'The change violates a required relation',
                    statusCode: 400
                };

            default:
                return {
                    message: 'Database operation failed',
                    statusCode: 500
                };
        }
    }

    // Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
        return {
            message: 'Invalid data provided',
            statusCode: 400
        };
    }

    // Prisma initialization errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return {
            message: 'Database connection failed',
            statusCode: 503
        };
    }

    // Unknown Prisma error
    return {
        message: 'An unexpected database error occurred',
        statusCode: 500
    };
};

export default parsePrismaError;
