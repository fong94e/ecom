import z, { includes } from "zod";

export interface CustomJwtSessionClaims {
    metadata?: {
        role?: "admin" | "user";
    };
}

export const UserFormSchema = z.object({
    firstName: z
        .string({ message: "First name is required!" })
        .min(2, {
            message: "First name must be at least 2 characters",
        })
        .max(50),
    lastName: z
        .string({ message: "Last name is required!" })
        .min(2, {
            message: "Last name must be at least 2 characters",
        })
        .max(50),
    username: z
        .string({ message: "User name is required!" })
        .min(2, {
            message: "User name must be at least 2 characters",
        })
        .max(50)
        .refine((val) => !val.includes(" "), {
            message: "username must not contain spaces",
        }),
    emailAddress: z.array(
        z.string().email({ message: "Invalid email address" }),
    ),
    password: z
        .string({ message: "password is required!" })
        .min(8, {
            message: "password must be at least 8 characters",
        })
        .max(50)
        .regex(/[A-Z]/, { message: "must include uppercase letter" })
        .regex(/[0-9]/, { message: "must include a number" })
        .regex(/[^A-Za-z0-9]/, {
            message: "must include special character",
        }),
});
