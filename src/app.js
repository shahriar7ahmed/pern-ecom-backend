import express from 'express';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { prisma } from './prisma.js';

const app = express();

app.use(express.json());

app.post('/auth/sign-up', async (req, res) => {
    const userCreateSchema = z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
    });
    
    const result = userCreateSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: result.error.errors 
        });
    }

    const passwordHash = await bcryptjs.hash(result.data.password, 10);

    const user = {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        passwordHash: passwordHash,
    }

    try {
        const createdUser = await prisma.user.create({
            data: user
        });

        res.json({ user: createdUser });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default app;
