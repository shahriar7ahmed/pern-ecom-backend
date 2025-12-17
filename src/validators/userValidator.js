import { z } from 'zod';

// User update schema
export const updateUserSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(100, 'First name cannot exceed 100 characters').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(100, 'Last name cannot exceed 100 characters').optional()
});

// User ID validation
export const userIdSchema = z.object({
    id: z.string().uuid('Invalid user ID format')
});
