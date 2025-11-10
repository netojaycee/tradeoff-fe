import { z } from "zod";

// TradeOff Authentication Schemas matching backend API

export const registerSchema = z.object({
    firstName: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
    lastName: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+=\-\[\]{}|\\:";'<>,.\/~`])[A-Za-z\d@$!%*?&.#^()_+=\-\[\]{}|\\:";'<>,.\/~`]/,
            'Password must contain uppercase, lowercase, number, and special character'
        ),
    phoneNumber: z.string()
        .regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in international format (e.g., +234...)')
});

// Frontend form schema with confirmPassword validation
export const registerFormSchema = z.object({
    firstName: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
    lastName: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+=\-\[\]{}|\\:";'<>,.\/~`])[A-Za-z\d@$!%*?&.#^()_+=\-\[\]{}|\\:";'<>,.\/~`]/,
            'Password must contain uppercase, lowercase, number, and special character'
        ),
    confirmPassword: z.string(),
    phoneNumber: z.string()
        .regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in international format (e.g., +234...)')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Email verification using 6-digit code
export const verifyEmailSchema = z.object({
    email: z.string().email('Invalid email address'),
    code: z.string()
        .length(6, 'Verification code must be exactly 6 characters')
        .regex(/^[A-Z0-9]{6}$/, 'Code must contain only uppercase letters and numbers')
});

// Resend verification code
export const resendVerificationSchema = z.object({
    email: z.string().email('Invalid email address')
});

// Forgot password request
export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address')
});

// Reset password with 6-digit code
export const resetPasswordSchema = z.object({
    code: z.string()
        .length(6, 'Reset code must be exactly 6 characters')
        .regex(/^[A-Z0-9]{6}$/, 'Code must contain only uppercase letters and numbers'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+=\-\[\]{}|\\:";'<>,.\/~`])[A-Za-z\d@$!%*?&.#^()_+=\-\[\]{}|\\:";'<>,.\/~`]/,
            'Password must contain uppercase, lowercase, number, and special character'
        ),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Refresh token schema
export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
});

// Checkout schema (keeping existing)
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

// Export types
export type RegisterCredentials = z.infer<typeof registerSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type VerifyEmailCredentials = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationCredentials = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordCredentials = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordCredentials = z.infer<typeof resetPasswordSchema>;
export type RefreshTokenCredentials = z.infer<typeof refreshTokenSchema>;
export type CheckoutCredentials = z.infer<typeof checkoutSchema>;

// Legacy type exports for compatibility (deprecated)
export type VerifyCredentials = VerifyEmailCredentials;
export type SendOtpCredentials = ResendVerificationCredentials;
export type ChangePasswordCredentials = ResetPasswordCredentials;