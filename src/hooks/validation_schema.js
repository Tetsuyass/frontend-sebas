import {z} from "zod";

const userInputSchemas = {
    email: z.string().email('Invalid email format').max(255),

    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

};

export function useValidation(schema) {
    return (value) => {
        const result = schema.safeParse(value);
        return {
            success: result.success,
            data: result.success ? result.data : null,
            error: result.success ? null : result.error.errors[0].message,
        };
    };
}