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
    onSuccess: async () => {
      // Wait for refetch to complete so cache is fresh
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.userDetails });

      // Now read the fresh cache
      const cachedUserDetails = queryClient.getQueryData(
        userQueryKeys.userDetails,
      ) as UserDetailsResponse;
      if (cachedUserDetails?.data?.user) {
        const user = cachedUserDetails.data.user;
        updateUser({
          userId: user._id || "",
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          preferences: user.preferences,
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
    onSuccess: async (_response, variables) => {
      // Wait for refetch to complete so cache is fresh
      await queryClient.invalidateQueries({
        queryKey: userQueryKeys.userDetails,
      });

      // Now read the fresh cache
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
      queryClient.clear();
      router.push("/");
    },
    // Don't logout on error - the account still exists if delete failed
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
