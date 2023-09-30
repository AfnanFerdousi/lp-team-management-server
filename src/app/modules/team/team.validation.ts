import { z } from "zod";

// Define a Zod schema for team validation
const errorMessages = {
    teamName: {
        minLength: "Team name must be at least 2 characters long",
        maxLength: "Team name cannot exceed 50 characters",
        required: "Team name is required",
    },
    teamCategory: {
        maxLength: "Team category cannot exceed 100 characters",
        required: "Team category is required",
    },
    description: "Description is required",
    // teamLogo: "Logo is required",
};

// Define a Zod schema for team validation with custom error messages
const createTeamValidation = z.object({
    body: z.object({
        teamName: z
            .string()
            .min(2, { message: errorMessages.teamName.minLength })
            .max(50, { message: errorMessages.teamName.maxLength })
            .refine(value => !!value.trim(), {
                message: errorMessages.teamName.required,
            }),
        teamCategory: z
            .string()
            .max(100, { message: errorMessages.teamCategory.maxLength })
            .refine(value => !!value.trim(), {
                message: errorMessages.teamCategory.required,
            }),
        description: z.string().refine(value => !!value.trim(), {
            message: errorMessages.description,
        }),
        // teamLogo: z.string().refine(value => !!value.trim(), {
        //     message: errorMessages.teamLogo,
        // }),
    }),
});

const updateTeamValidation = z.object({
    body: z.object({
        teamName: z
            .string()
            .min(2, { message: errorMessages.teamName.minLength })
            .max(50, { message: errorMessages.teamName.maxLength })
            .optional(),
        teamCategory: z
            .string()
            .max(100, { message: errorMessages.teamCategory.maxLength })
            .optional(),
        description: z.string().optional(),
        // teamLogo: z.string().optional(),
    }),
});

export const TeamValidation = {
    createTeamValidation,
    updateTeamValidation,
};
