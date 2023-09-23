import { z } from "zod";

const errorMessages = {
    username: {
        minLength: "Username must be at least 4 characters long",
        maxLength: "Username cannot exceed 50 characters",
        required: "Username is required",
    },
    email: {
        format: "Please enter a valid email address",
        required: "Email is required",
    },
    password: {
        minLength: "Password must be at least 8 characters long",
        required: "Password is required",
    },
};

const createUserValidation = z.object({
    body: z.object({
        username: z
            .string()
            .min(4, { message: errorMessages.username.minLength })
            .max(50, { message: errorMessages.username.maxLength })
            .refine(value => !!value.trim(), {
                message: errorMessages.username.required,
            }),
        email: z
            .string()
            .email({ message: errorMessages.email.format })
            .refine(value => !!value.trim(), {
                message: errorMessages.email.required,
            }),
        password: z
            .string()
            .min(8, { message: errorMessages.password.minLength })
            .refine(value => !!value.trim(), {
                message: errorMessages.password.required,
            }),
        // Add more fields as needed
    }),
});

const loginUserValidation = z.object({
    body: z.object({
        email: z
            .string()
            .email({ message: errorMessages.email.format })
            .refine(value => !!value.trim(), {
                message: errorMessages.username.required,
            }),
        password: z
            .string()
            .min(8, { message: errorMessages.password.minLength })
            .refine(value => !!value.trim(), {
                message: errorMessages.password.required,
            }),
        // Add more fields as needed
    }),
});

export const UserValidation = {
    createUserValidation,
    loginUserValidation,
};
