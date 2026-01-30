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

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(255),

    role: z
        .nativeEnum(UserRole)
        .default(UserRole.USER),
});

// Type inference
export type CreateUserInput = z.input<typeof createUserSchema>;
export type CreateUserOutput = z.output<typeof createUserSchema>;

export const signUserSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(255),
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name is too long"),

});
export type SigSignup = z.input<typeof signUserSchema>

export const signinUserSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(255),

});
export type SigninUser = z.input<typeof signinUserSchema>



export const getUserByIdSchema = z.object({
    id: z.string().uuid(),
});

export type GetUserById = z.input<typeof getUserByIdSchema>;