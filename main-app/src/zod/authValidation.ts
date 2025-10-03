import { z } from 'zod';

export const createAccountSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'First Name is required' })
      .max(20, { message: 'First Name must be less than 20 characters' }),

    lastName: z
      .string()
      .min(1, { message: 'Last Name is required' })
      .max(20, { message: 'Last Name must be less than 20 characters' }),

    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .min(1, { message: 'Email is required' })
      .max(255, { message: 'Email must be less than 255 characters' })
      .refine(
        email => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        { message: 'Invalid email address' }
      ),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(255, { message: 'Password must be less than 255 characters' })
      .refine(
        val =>
          /[a-z]/.test(val) && // at least one lowercase
          /[A-Z]/.test(val) && // at least one uppercase
          /\d/.test(val) && // at least one number
          /[^A-Za-z0-9]/.test(val), // at least one special character
        {
          message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        }
      ),

    confirmPassword: z
      .string()
      .min(8, {
        message: 'Confirm Password must be at least 8 characters long',
      })
      .max(255, {
        message: 'Confirm Password must be less than 255 characters',
      }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const verifyEmailSchema = z.object({
  verificationCode: z.string().min(6, { message: 'Verification code must be 6 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export const resendVerificationEmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const resetPasswordRequestSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    resetToken: z.string().min(1, { message: 'Reset token is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(255, { message: 'Password must be less than 255 characters' })
      .refine(
        val =>
          /[a-z]/.test(val) && // at least one lowercase
          /[A-Z]/.test(val) && // at least one uppercase
          /\d/.test(val) && // at least one number
          /[^A-Za-z0-9]/.test(val), // at least one special character
        {
          message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        }
      ),
    confirmPassword: z.string().min(8, {
      message: 'Confirm Password must be at least 8 characters long',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
});
