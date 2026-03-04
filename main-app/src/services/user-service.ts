import api from "@/lib/config/axios";
import { API_ENDPOINTS } from "@/lib/config/endpoints";
import type {
  ApiResponse,
  AvatarUploadResponse,
  ChangePasswordRequest,
  ChangeUsernameRequest,
  DeleteUserRequest,
  RevokeSessionRequest,
  SessionsResponse,
  UpdateUserDetailsRequest,
  UserDetailsResponse,
} from "@/types/api";

// User Service Functions
export const userService = {
  // Get user profile
  getUserDetails: async (): Promise<UserDetailsResponse> => {
    const response = await api.get(API_ENDPOINTS.USER.DETAILS);
    return response.data;
  },

  // Update user profile (firstName, lastName, bio)
  updateUserDetails: async (data: UpdateUserDetailsRequest): Promise<ApiResponse> => {
    const response = await api.post(API_ENDPOINTS.USER.DETAILS, data);
    return response.data;
  },

  // Change username (one-time only)
  changeUsername: async (data: ChangeUsernameRequest): Promise<ApiResponse> => {
    const response = await api.post(API_ENDPOINTS.USER.CHANGE_USERNAME, data);
    return response.data;
  },

  // Check if username is available
  checkUsernameAvailability: async (username: string): Promise<ApiResponse<{ available: boolean }>> => {
    const response = await api.get(
      API_ENDPOINTS.USER.CHANGE_USERNAME,
      { params: { username } },
    );
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse> => {
    const response = await api.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
    return response.data;
  },

  // Delete user account
  deleteUser: async (data: DeleteUserRequest): Promise<ApiResponse> => {
    const response = await api.delete(API_ENDPOINTS.USER.DELETE_ACCOUNT, {
      data,
    });
    return response.data;
  },

  // Get active login sessions
  getSessions: async (): Promise<SessionsResponse> => {
    const response = await api.get(API_ENDPOINTS.SESSIONS.GET_ALL);
    return response.data;
  },

  // Revoke a specific session
  revokeSession: async (data: RevokeSessionRequest): Promise<ApiResponse> => {
    const response = await api.delete(API_ENDPOINTS.SESSIONS.REVOKE, { data });
    return response.data;
  },

  // Update user avatar in database
  updateAvatar: async (avatarUrl: string): Promise<AvatarUploadResponse> => {
    const response = await api.post(API_ENDPOINTS.USER.UPLOAD_AVATAR, {
      avatar: avatarUrl,
    });
    return response.data;
  },

  // Delete user avatar from database
  deleteAvatar: async (): Promise<AvatarUploadResponse> => {
    const response = await api.delete(API_ENDPOINTS.USER.UPLOAD_AVATAR);
    return response.data;
  },
};
