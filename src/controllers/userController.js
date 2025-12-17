import { prisma } from '../database/prisma.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import { updateUserSchema, userIdSchema } from '../validators/userValidator.js';

/**
 * Get all users with pagination
 * @route GET /api/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, role } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (role) where.role = role;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            skip,
            take,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
    ]);

    ApiResponse.success(res, {
        users,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / take)
        }
    }, 'Users fetched successfully');
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
    const { success, data } = userIdSchema.safeParse({ id: req.params.id });

    if (!success) {
        return ApiResponse.error(res, 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await prisma.user.findUnique({
        where: { id: data.id },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        return ApiResponse.notFound(res, MESSAGES.USER_NOT_FOUND);
    }

    ApiResponse.success(res, { user }, 'User fetched successfully');
});

/**
 * Update user
 * @route PATCH /api/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
    const { success: idSuccess, data: idData } = userIdSchema.safeParse({ id: req.params.id });

    if (!idSuccess) {
        return ApiResponse.error(res, 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST);
    }

    const { success: bodySuccess, data: bodyData, error } = updateUserSchema.safeParse(req.body);

    if (!bodySuccess) {
        return ApiResponse.validationError(res, error.errors);
    }

    const user = await prisma.user.update({
        where: { id: idData.id },
        data: bodyData,
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    ApiResponse.success(res, { user }, MESSAGES.USER_UPDATED);
});

/**
 * Delete user
 * @route DELETE /api/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
    const { success, data } = userIdSchema.safeParse({ id: req.params.id });

    if (!success) {
        return ApiResponse.error(res, 'Invalid user ID format', HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.user.delete({
        where: { id: data.id }
    });

    ApiResponse.success(res, {}, MESSAGES.USER_DELETED);
});
