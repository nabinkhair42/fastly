import api from '@/lib/config/axios';
import {
  AvatarUploadResponse,
  ChangePasswordRequest,
  ChangeUsernameRequest,
  DeleteUserRequest,
  UpdateUserDetailsRequest,
  UserDetailsResponse,
} from '@/types/api';

// User Service Functions
export const userService = {
  // Get user profile
  getUserDetails: async (): Promise<UserDetailsResponse> => {
    const response = await api.get('/user-details');
    return response.data;
  },

  // Update user profile (firstName, lastName, bio)
  updateUserDetails: async (data: UpdateUserDetailsRequest) => {
    const response = await api.post('/user-details', data);
    return response.data;
  },

  // Change username (one-time only)
  changeUsername: async (data: ChangeUsernameRequest) => {
    const response = await api.post('/change-username', data);
    return response.data;
  },

  // Check if username is available
  checkUsernameAvailability: async (username: string) => {
    const response = await api.get(`/change-username?username=${username}`);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest) => {
    const response = await api.post('/change-password', data);
    return response.data;
  },

  // Delete user account
  deleteUser: async (data: DeleteUserRequest) => {
    const response = await api.delete('/delete-user', { data });
    return response.data;
  },

  // Update user avatar in database
  updateAvatar: async (avatarUrl: string): Promise<AvatarUploadResponse> => {
    const response = await api.post('/upload-avatar', { avatar: avatarUrl });
    return response.data;
  },

  // Delete user avatar from database
  deleteAvatar: async (): Promise<AvatarUploadResponse> => {
    const response = await api.delete('/upload-avatar');
    return response.data;
  },
};
