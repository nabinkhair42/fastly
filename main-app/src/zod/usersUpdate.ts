import { z } from "zod";

// Constants
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_MIN = 1;
const USERNAME_MAX = 20;
const ADDRESS_MAX = 120;
const CITY_MAX = 60;
const STATE_MAX = 60;
const COUNTRY_MAX = 60;
const ZIP_MAX = 20;
const BIO_MAX = 200;
const NAME_MAX = 20;

const locationSchema = z.object({
  address: z
    .string()
    .max(ADDRESS_MAX, {
      message: `Address must be less than ${ADDRESS_MAX} characters`,
    })
    .optional(),
  city: z
    .string()
    .max(CITY_MAX, { message: `City must be less than ${CITY_MAX} characters` })
    .optional(),
  state: z
    .string()
    .max(STATE_MAX, {
      message: `State must be less than ${STATE_MAX} characters`,
    })
    .optional(),
  country: z
    .string()
    .max(COUNTRY_MAX, {
      message: `Country must be less than ${COUNTRY_MAX} characters`,
    })
    .optional(),
  zipCode: z
    .string()
    .max(ZIP_MAX, {
      message: `ZIP / Postal code must be less than ${ZIP_MAX} characters`,
    })
    .optional(),
});

// Reusable username schema
const usernameSchema = z
  .string()
  .min(USERNAME_MIN, { message: "Username is required" })
  .max(USERNAME_MAX, {
    message: `Username must be less than ${USERNAME_MAX} characters`,
  })
  .refine((username) => USERNAME_REGEX.test(username), {
    message: "Username must contain only letters, numbers, and underscores",
  });

export const checkUsernameSchema = z.object({ username: usernameSchema });
export const checkUsernameAvailabilitySchema = z.object({
  username: usernameSchema,
});
export const changeUsernameSchema = z.object({ username: usernameSchema });

const nameSchema = z
  .string()
  .min(1, { message: "Name is required" })
  .max(NAME_MAX, { message: `Name must be less than ${NAME_MAX} characters` });

// Schema for updating user details (excluding username)
export const updateUserDetailsSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  bio: z
    .string()
    .max(BIO_MAX, { message: `Bio must be less than ${BIO_MAX} characters` })
    .optional(),
  socialAccounts: z
    .array(
      z.object({
        url: z.string().url({ message: "Please enter a valid URL" }),
        provider: z.string().optional().default("website"),
      }),
    )
    .optional(),
  preferences: z
    .object({
      theme: z.string().optional(),
      font: z.string().optional(),
    })
    .optional(),
  dob: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val): Date | undefined => {
      if (typeof val === "string") {
        return new Date(val);
      }
      return val;
    }),
  location: locationSchema.nullable().optional(),
});

// Schema for profile form with social accounts
export const profileFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  bio: z
    .string()
    .max(BIO_MAX, { message: `Bio must be less than ${BIO_MAX} characters` })
    .optional(),
  socialAccounts: z
    .array(
      z.object({
        provider: z.string().min(1, { message: "Provider is required" }),
        url: z.string().url({ message: "Please enter a valid URL" }),
      }),
    )
    .optional(),
  dob: z.date().optional(),
  location: locationSchema.optional(),
});

// Input schema for the form (before transformation)
export const profileFormInputSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  bio: z
    .string()
    .max(BIO_MAX, { message: `Bio must be less than ${BIO_MAX} characters` })
    .optional(),
  socialAccounts: z
    .array(
      z.object({
        provider: z.string().min(1, { message: "Provider is required" }),
        url: z.string().url({ message: "Please enter a valid URL" }),
      }),
    )
    .optional(),
  dob: z.date().optional(),
  location: locationSchema.optional(),
});

// Schema for user account deletion
export const deleteUserSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(255, { message: "Password must be less than 255 characters" })
    .optional(),
});

const passwordFieldSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(255, { message: "Password must be less than 255 characters" })
  .refine(
    (val) =>
      /[a-z]/.test(val) && // at least one lowercase
      /[A-Z]/.test(val) && // at least one uppercase
      /\d/.test(val) && // at least one number
      /[^A-Za-z0-9]/.test(val), // at least one special character
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  );

// Schema for password change when current password is required
export const changePasswordSchema = z.object({
  currentPassword: passwordFieldSchema,
  newPassword: passwordFieldSchema,
  confirmPassword: passwordFieldSchema,
});

// Schema for setting an initial password when none exists
export const setPasswordSchema = z.object({
  newPassword: passwordFieldSchema,
  confirmPassword: passwordFieldSchema,
});

// Schema for account preferences
export const accountPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  font: z.enum(["sans", "serif", "mono", "system"]),
});
