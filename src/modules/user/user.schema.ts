import { z } from 'zod';
import { UserRole } from './user.entity';

export const createUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name is too long"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255),

    role: z
        .nativeEnum(UserRole)
        .default(UserRole.USER),
});

// Type inference
export type CreateUserInput = z.input<typeof createUserSchema>;
export type CreateUserOutput = z.output<typeof createUserSchema>;