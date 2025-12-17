import { z } from 'zod';

// User signup schema
export const signupSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(100, 'First name cannot exceed 100 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(100, 'Last name cannot exceed 100 characters'),
    email: z.string().email('Invalid email address').max(255, 'Email cannot exceed 255 characters'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

// User signin schema
export const signinSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});
