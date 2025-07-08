import { z } from 'zod';

// Schema for changing username (separate endpoint)
export const changeUsernameSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .max(20, { message: 'Username must be less than 20 characters' })
    .refine(
      username => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        return usernameRegex.test(username);
      },
      {
        message: 'Username must contain only letters, numbers, and underscores',
      }
    ),
});

// Schema for updating user details (excluding username)
export const updateUserDetailsSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(20, { message: 'First name must be less than 20 characters' })
    .optional(),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .max(20, { message: 'Last name must be less than 20 characters' })
    .optional(),
  bio: z
    .string()
    .max(200, { message: 'Bio must be less than 200 characters' })
    .optional(),
});

// Schema for user account deletion
export const deleteUserSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(255, { message: 'Password must be less than 255 characters' }),
});

// Schema for password change
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: 'Current password must be at least 8 characters long' })
    .max(255, { message: 'Current password must be less than 255 characters' }),
  newPassword: z
    .string()
    .min(8, { message: 'New password must be at least 8 characters long' })
    .max(255, { message: 'New password must be less than 255 characters' })
    .refine(
      password => {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
      },
      {
        message:
          'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }
    ),
  confirmPassword: z
    .string()
    .min(8, { message: 'Confirm password must be at least 8 characters long' })
    .max(255, { message: 'Confirm password must be less than 255 characters' }),
});
