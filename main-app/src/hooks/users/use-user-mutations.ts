"use client";

import { useAuth } from "@/providers/auth-provider";
import { userService } from "@/services/user-service";
import type {
  ChangePasswordRequest,
  ChangeUsernameRequest,
  DeleteUserRequest,
  UpdateUserDetailsRequest,
  UserDetailsResponse,
} from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// Query keys
export const userQueryKeys = {
  userDetails: ["user", "details"] as const,
  sessions: ["user", "sessions"] as const,
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
    mutationFn: async (data: UpdateUserDetailsRequest) => {
      return toast.promise(userService.updateUserDetails(data), {
        loading: "Updating profile",
        success: (response) => response.message,
        error: (response) => response.message,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch user details
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userDetails });

      // Update auth context if user data changed
      const cachedUserDetails = queryClient.getQueryData(
        userQueryKeys.userDetails,
      ) as UserDetailsResponse;
      if (cachedUserDetails?.data?.user) {
        updateUser({
          userId: cachedUserDetails.data.user._id || "",
          firstName: cachedUserDetails.data.user.firstName,
          lastName: cachedUserDetails.data.user.lastName,
          email: cachedUserDetails.data.user.email,
          username: cachedUserDetails.data.user.username,
          preferences: cachedUserDetails.data.user.preferences,
        });
      }
    },
  });
};

// Change username mutation
export const useChangeUsername = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (data: ChangeUsernameRequest) => {
      return toast.promise(userService.changeUsername(data), {
        loading: "Updating username",
        success: (response) => response.message,
        error: (response) => response.message,
      });
    },
    onSuccess: async (response, variables) => {
      // Invalidate and refetch user details
      await queryClient.invalidateQueries({
        queryKey: userQueryKeys.userDetails,
      });

      // Update auth context with new username and hasChangedUsername flag
      const cachedUserDetails = queryClient.getQueryData(
        userQueryKeys.userDetails,
      ) as UserDetailsResponse;
      if (cachedUserDetails?.data?.user) {
        updateUser({
          userId: cachedUserDetails.data.user._id || "",
          firstName: cachedUserDetails.data.user.firstName,
          lastName: cachedUserDetails.data.user.lastName,
          email: cachedUserDetails.data.user.email,
          username: variables.username, // Use the new username
          preferences: cachedUserDetails.data.user.preferences,
        });
      }

      // Call the success callback after everything is updated
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};

// Check if username is available
export const useCheckUsernameAvailability = () => {
  return useMutation({
    mutationFn: (username: string) =>
      userService.checkUsernameAvailability(username),
  });
};

// Change password mutation
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      return toast.promise(userService.changePassword(data), {
        loading: "Changing password",
        success: (response) => response.message,
        error: (response) => response.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userDetails });
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: DeleteUserRequest) => {
      return toast.promise(userService.deleteUser(data), {
        loading: "Deleting account",
        success: (response) => response.message,
        error: (response) => response.message,
      });
    },
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userDetails });
      router.push("/");
    },
    onError: () => {
      // Even if delete API fails, we should still clear local state
      logout();
      queryClient.clear();
    },
  });
};

export const useUserSessions = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: userQueryKeys.sessions,
    queryFn: () => userService.getSessions(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      toast.promise(userService.revokeSession({ sessionId }), {
        loading: "Revoking session",
        success: (response) => response.message,
        error: (response) => response.message,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.sessions });
    },
  });
};

export const useAuthMethod = () => {
  const { data: userDetails } = useUserDetails();

  // Try to get auth method from user details first
  if (userDetails?.data?.user?.authMethod) {
    return userDetails.data.user.authMethod;
  }

  return "EMAIL"; // Default to EMAIL
};
