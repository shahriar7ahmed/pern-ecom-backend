/**
 * Standardized API response helper
 * Provides consistent response structure across all endpoints
 */

class ApiResponse {
    /**
     * Send success response
     * @param {Object} res - Express response object
     * @param {Object} data - Response data
     * @param {String} message - Success message
     * @param {Number} statusCode - HTTP status code (default: 200)
     */
    static success(res, data = {}, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data
        });
    }

    /**
     * Send error response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     * @param {Number} statusCode - HTTP status code (default: 500)
     * @param {Array} errors - Validation errors (optional)
     */
    static error(res, message = 'Internal server error', statusCode = 500, errors = null) {
        const response = {
            status: 'error',
            message
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Send validation error response
     * @param {Object} res - Express response object
     * @param {Array} errors - Validation errors
     * @param {String} message - Error message
     */
    static validationError(res, errors, message = 'Validation failed') {
        return res.status(400).json({
            status: 'error',
            message,
            errors
        });
    }

    /**
     * Send not found response
     * @param {Object} res - Express response object
     * @param {String} message - Not found message
     */
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            status: 'error',
            message
        });
    }

    /**
     * Send unauthorized response
     * @param {Object} res - Express response object
     * @param {String} message - Unauthorized message
     */
    static unauthorized(res, message = 'Unauthorized') {
        return res.status(401).json({
            status: 'error',
            message
        });
    }

    /**
     * Send forbidden response
     * @param {Object} res - Express response object
     * @param {String} message - Forbidden message
     */
    static forbidden(res, message = 'Forbidden') {
        return res.status(403).json({
            status: 'error',
            message
        });
    }
}

export default ApiResponse;
