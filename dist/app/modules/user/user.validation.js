"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
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
const createUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z
            .string()
            .min(4, { message: errorMessages.username.minLength })
            .max(50, { message: errorMessages.username.maxLength })
            .refine(value => !!value.trim(), {
            message: errorMessages.username.required,
        }),
        email: zod_1.z
            .string()
            .email({ message: errorMessages.email.format })
            .refine(value => !!value.trim(), {
            message: errorMessages.email.required,
        }),
        password: zod_1.z
            .string()
            .min(8, { message: errorMessages.password.minLength })
            .refine(value => !!value.trim(), {
            message: errorMessages.password.required,
        }),
        // Add more fields as needed
    }),
});
const loginUserValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .email({ message: errorMessages.email.format })
            .refine(value => !!value.trim(), {
            message: errorMessages.username.required,
        }),
        password: zod_1.z
            .string()
            .min(8, { message: errorMessages.password.minLength })
            .refine(value => !!value.trim(), {
            message: errorMessages.password.required,
        }),
        // Add more fields as needed
    }),
});
exports.UserValidation = {
    createUserValidation,
    loginUserValidation,
};
