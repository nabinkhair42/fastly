import api from '@/lib/axios';
import { SocialAccountUrl } from '@/types/user';

// Types
export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string | null;
  location: string | null;
  socialAccounts: SocialAccountUrl | null;
  bio: string | null;
}

export interface UpdateUserDetailsRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export interface ChangeUsernameRequest {
  username: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteUserRequest {
  password: string;
}

export interface UserDetailsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    user: UserProfile;
  };
}

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
};
