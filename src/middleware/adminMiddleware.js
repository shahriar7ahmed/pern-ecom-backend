import { USER_ROLES } from '../constants/roles.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * Admin authorization middleware
 * Ensures the authenticated user has admin role
 * Must be used after authMiddleware
 */
export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            status: 'error',
            message: 'Unauthorized - Authentication required'
        });
    }

    if (req.user.role !== USER_ROLES.ADMIN) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            status: 'error',
            message: 'Forbidden - Admin access required'
        });
    }

    next();
};