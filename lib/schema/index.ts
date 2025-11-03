import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const verifySchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
    type: z.enum(["register", "forgot-password"]),
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    confirm_password: z.string().min(6),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});


export const sendOtpSchema = z.object({
    email: z.string().email(),
    type: z.enum(["register", "forgot-password"]), // Differentiate between flows
});

export const changePasswordSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    resetToken: z.string(),
    confirm_password: z.string().min(6),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    temporary_password: z.string().min(6),
    new_password: z.string().min(6),
    confirm_password: z.string().min(6),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const checkoutSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    email: z.string().email('Invalid email address'),
    state: z.string().min(1, 'State is required'),
    lga: z.string().min(1, 'Local Government Area is required'),
    streetAddress: z.string().min(5, 'Street address is required'),
    useSavedInfo: z.boolean().optional(),
    paymentMethod: z.enum(['card', 'transfer']),
});


export type CheckoutCredentials = z.infer<typeof checkoutSchema>;
export type ResetPasswordCredentials = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordCredentials = z.infer<typeof forgotPasswordSchema>;


export type ChangePasswordCredentials = z.infer<typeof changePasswordSchema>;
export type SendOtpCredentials = z.infer<typeof sendOtpSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
export type VerifyCredentials = z.infer<typeof verifySchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;