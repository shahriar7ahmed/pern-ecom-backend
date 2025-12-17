import { prisma } from '../database/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import config from '../config/index.js';
import { signupSchema, signinSchema } from '../validators/authValidator.js';

/**
 * User signup
 * @route POST /api/auth/sign-up
 */
export const userSignUp = asyncHandler(async (req, res) => {
    const { success, data, error } = signupSchema.safeParse(req.body);

    if (!success) {
        return ApiResponse.validationError(res, error.errors);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (existingUser) {
        return ApiResponse.error(res, 'This email is already registered', HTTP_STATUS.CONFLICT);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            passwordHash
        },
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

    ApiResponse.success(res, { user }, MESSAGES.SIGNUP_SUCCESS, HTTP_STATUS.CREATED);
});

/**
 * User signin
 * @route POST /api/auth/sign-in
 */
export const userSignIn = asyncHandler(async (req, res) => {
    const { success, data, error } = signinSchema.safeParse(req.body);

    if (!success) {
        return ApiResponse.validationError(res, error.errors);
    }

    // Find user
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (!user) {
        return ApiResponse.error(res, MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
        return ApiResponse.error(res, MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Generate token
    const accessToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );

    ApiResponse.success(res, {
        accessToken,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    }, MESSAGES.SIGNIN_SUCCESS);
});

/**
 * Get current user
 * @route GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
    // User is already attached by authMiddleware
    ApiResponse.success(res, { user: req.user }, 'User fetched successfully');
});
