import { prisma } from "../database/prisma.js";
import { z } from "zod";

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({ 
            status: 'success', 
            message: 'Users fetched successfully', 
            data: { users } 
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const userGetSchema = z.object({
            id: z.string().uuid(),
        });

        const result = userGetSchema.safeParse({
            id: userId,
        });

        if (!result.success) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Validation failed', 
                errors: result.error.errors 
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'User not found' 
            });
        }

        res.json({ 
            status: 'success', 
            message: 'User fetched successfully', 
            data: { user } 
        });
    } catch (error) {
        console.error('Get user by id error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const userUpdateSchema = z.object({
            id: z.string().uuid(),
            firstName: z.string().min(3).optional(),
            lastName: z.string().min(3).optional(),
        });

        const result = userUpdateSchema.safeParse({
            id: userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });

        if (!result.success) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Validation failed', 
                errors: result.error.errors 
            });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).json({ 
                status: 'error',
                message: 'User not found' 
            });
        }

        const updateData = {};
        if (result.data.firstName) updateData.firstName = result.data.firstName;
        if (result.data.lastName) updateData.lastName = result.data.lastName;

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        res.json({ 
            status: 'success', 
            message: 'User updated successfully', 
            data: { user: updatedUser } 
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const userDeleteSchema = z.object({
            id: z.string().uuid(),
        });

        const result = userDeleteSchema.safeParse({
            id: userId,
        });

        if (!result.success) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Validation failed', 
                errors: result.error.errors 
            });
        }
        
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'User not found' 
            });
        }

        const deletedUser = await prisma.user.delete({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        
        res.json({ 
            status: 'success', 
            message: 'User deleted successfully', 
            data: { user: deletedUser } 
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
}
