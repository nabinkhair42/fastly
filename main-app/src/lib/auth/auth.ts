// Main auth exports - import everything from here for convenience

// Core authentication
export { useSession } from '@/hooks/auth/useSession';
export type { SessionData } from '@/hooks/auth/useSession';
export { useAuth } from '@/providers/AuthProvider';

// Route protection
export { default as ProtectedRoute, withProtectedRoute } from '@/components/auth/protected-route';
export {
  useAuthGuard,
  useRedirectIfAuthenticated,
  useRequireAuth,
} from '@/hooks/auth/useRequireAuth';

// Authentication mutations
export {
  useCreateAccount,
  useForgotPassword,
  useLogin,
  useLogout,
  useResendVerification,
  useResetPassword,
  useVerifyEmail,
} from '@/hooks/auth/useAuthMutations';

// User management
export {
  useChangePassword,
  useChangeUsername,
  useDeleteUser,
  userQueryKeys,
  useUpdateUserDetails,
  useUserDetails,
} from '@/hooks/users/useUserMutations';

// Services (for direct API calls if needed)
export { authService } from '@/services/authService';
export { userService } from '@/services/userService';

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
