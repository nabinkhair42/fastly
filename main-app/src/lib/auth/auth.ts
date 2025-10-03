// Main auth exports - import everything from here for convenience

// Core authentication
export { useSession } from '@/hooks/auth/use-session';
export type { SessionData } from '@/hooks/auth/use-session';
export { useAuth } from '@/providers/auth-provider';

// Route protection
export { default as ProtectedRoute, withProtectedRoute } from '@/components/auth/protected-route';
export {
  useAuthGuard,
  useRedirectIfAuthenticated,
  useRequireAuth,
} from '@/hooks/auth/use-require-auth';

// Authentication mutations
export {
  useCreateAccount,
  useForgotPassword,
  useLogin,
  useLogout,
  useResendVerification,
  useResetPassword,
  useVerifyEmail,
} from '@/hooks/auth/use-auth-mutations';

// User management
export {
  useChangePassword,
  useChangeUsername,
  useDeleteUser,
  userQueryKeys,
  useUpdateUserDetails,
  useUserDetails,
} from '@/hooks/users/use-user-mutations';

// Services (for direct API calls if needed)
export { authService } from '@/services/auth-service';
export { userService } from '@/services/user-service';

// Types
export type {
  ChangePasswordRequest,
  ChangeUsernameRequest,
  CreateAccountRequest,
  DeleteUserRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
  UpdateUserDetailsRequest,
  UserDetailsResponse,
} from '@/types/api';

export type { UserProfile } from '@/types/user';

// Utilities
export { default as api, tokenManager } from '@/lib/config/axios';
