// Main auth exports - import everything from here for convenience

// Core authentication
export { useSession } from '@/hooks/useSession';
export type { SessionData } from '@/hooks/useSession';
export { useAuth } from '@/providers/AuthProvider';

// Route protection
export {
  default as ProtectedRoute,
  withProtectedRoute,
} from '@/components/ProtectedRoute';
export {
  useAuthGuard,
  useRedirectIfAuthenticated,
  useRequireAuth,
} from '@/hooks/useRequireAuth';

// Authentication mutations
export {
  useCreateAccount,
  useForgotPassword,
  useLogin,
  useLogout,
  useResendVerification,
  useResetPassword,
  useVerifyEmail,
} from '@/hooks/useAuthMutations';

// User management
export {
  useChangePassword,
  useChangeUsername,
  useDeleteUser,
  userQueryKeys,
  useUpdateUserDetails,
  useUserDetails,
} from '@/hooks/useUserMutations';

// Services (for direct API calls if needed)
export { authService } from '@/services/authService';
export { userService } from '@/services/userService';

// Types
export type {
  CreateAccountRequest,
  EmailVerificationRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '@/types/user';

export type {
  ChangePasswordRequest,
  ChangeUsernameRequest,
  DeleteUserRequest,
  UpdateUserDetailsRequest,
  UserDetailsResponse,
  UserProfile,
} from '@/types/user';

// Utilities
export { default as api, tokenManager } from '@/lib/axios';
