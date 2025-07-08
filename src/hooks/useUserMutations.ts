'use client';

import { useAuth } from '@/providers/AuthProvider';
import {
  ChangePasswordRequest,
  ChangeUsernameRequest,
  DeleteUserRequest,
  UpdateUserDetailsRequest,
  UserDetailsResponse,
  userService,
} from '@/services/userService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Query keys
export const userQueryKeys = {
  userDetails: ['user', 'details'] as const,
};

// Get user details query
export const useUserDetails = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: userQueryKeys.userDetails,
    queryFn: () => userService.getUserDetails(),
    enabled: isAuthenticated, // Only run when authenticated
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Update user details mutation
export const useUpdateUserDetails = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateUserDetailsRequest) =>
      userService.updateUserDetails(data),
    onSuccess: response => {
      // Invalidate and refetch user details
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userDetails });

      // Update auth context if user data changed
      const cachedUserDetails = queryClient.getQueryData(
        userQueryKeys.userDetails
      ) as UserDetailsResponse;
      if (cachedUserDetails?.data?.user) {
        updateUser({
          userId: cachedUserDetails.data.user._id || '',
          firstName: cachedUserDetails.data.user.firstName,
          lastName: cachedUserDetails.data.user.lastName,
          email: cachedUserDetails.data.user.email,
          username: cachedUserDetails.data.user.username,
        });
      }

      toast.success(response.message || 'Profile updated successfully!');
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Failed to update profile. Please try again.';
      toast.error(message);
    },
  });
};

// Change username mutation
export const useChangeUsername = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: ChangeUsernameRequest) =>
      userService.changeUsername(data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch user details
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userDetails });

      // Update auth context with new username
      const cachedUserDetails = queryClient.getQueryData(
        userQueryKeys.userDetails
      ) as UserDetailsResponse;
      if (cachedUserDetails?.data?.user) {
        updateUser({
          userId: cachedUserDetails.data.user._id || '',
          firstName: cachedUserDetails.data.user.firstName,
          lastName: cachedUserDetails.data.user.lastName,
          email: cachedUserDetails.data.user.email,
          username: variables.username, // Use the new username
        });
      }

      toast.success(response.message || 'Username updated successfully!');
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Failed to update username. Please try again.';
      toast.error(message);
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      userService.changePassword(data),
    onSuccess: response => {
      toast.success(response.message || 'Password changed successfully!');
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Failed to change password. Please try again.';
      toast.error(message);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteUserRequest) => userService.deleteUser(data),
    onSuccess: response => {
      // Log out user and clear all cached data
      logout();
      queryClient.clear();
      toast.success(response.message || 'Account deleted successfully!');
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      const message =
        error.response?.data?.message ||
        'Failed to delete account. Please try again.';
      toast.error(message);
    },
  });
};
