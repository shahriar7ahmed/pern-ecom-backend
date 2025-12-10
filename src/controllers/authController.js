import { prisma } from "../database/prisma.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userSignUp = async (req, res) => {
    try {
        const userCreateSchema = z.object({
            firstName: z.string().min(3),
            lastName: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(8),
        });
        
        const result = userCreateSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Validation failed', 
                errors: result.error.errors 
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: result.data.email }
        });

        if (existingUser) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Email already exists' 
            });
        }

        const passwordHash = await bcrypt.hash(result.data.password, 10);

        const user = {
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
            passwordHash: passwordHash,
        }

        const createdUser = await prisma.user.create({
            data: user,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'User created successfully', 
            data: { user: createdUser } 
        });
    } catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
}

export const userSignIn = async (req, res) => {
    try {
        const userSignInSchema = z.object({
            email: z.string().email(),
            password: z.string().min(8),
        });

        const result = userSignInSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Validation failed', 
                errors: result.error.errors 
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: result.data.email
            }
        });

        if (!user) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Invalid email or password' 
            });
        }

        const isPasswordValid = await bcrypt.compare(result.data.password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Invalid email or password' 
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ 
                status: 'error',
                message: 'JWT_SECRET is not configured' 
            });
        }

        const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { 
            expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
        });

        res.json({
            status: 'success',
            message: 'User signed in successfully',
            data: { accessToken }
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;

        res.json({
            status: 'success',
            message: 'User fetched successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
}
