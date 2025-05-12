// src/services/authService.ts
import apiClient, { ApiErrorResponse, ApiResponse } from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: 'consumer' | 'farmer' | 'admin';
  mobile?: string;
}

// AuthResponse no longer needs 'token' if it's only in cookie
export interface AuthResponse {
  status: string;
  data: {
    user: BackendUser;
  };
}

export interface BecomeFarmerPayload {
  experience: number;
  farm_location: string;
  certifications: string[];
  location: string;
  specialization: string;
}

// Function to fetch current user details (relies on cookie being sent)
// This is useful for checking if a session is active on app load.
export const getMe = async (): Promise<AuthResponse> => {
  try {
    // This endpoint should return the current user if the cookie is valid
    const response = await apiClient.get<AuthResponse>('/api/v1/users/me'); // Or your equivalent /profile endpoint
    return response;
  } catch (error) {
    console.error('GetMe service error:', error);
    throw error as ApiErrorResponse;
  }
};

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/api/v1/users/login',
      payload
    );
    // Backend sets the HTTP-Only cookie upon successful login
    return response;
  } catch (error) {
    console.error('Login service error:', error);
    throw error as ApiErrorResponse;
  }
};

export const signupUser = async (
  payload: SignupPayload
): Promise<AuthResponse> => {
  try {
    const { ...backendPayload } = payload;
    const response = await apiClient.post<AuthResponse>(
      '/api/v1/users/signup',
      backendPayload
    );
    // Backend sets the HTTP-Only cookie upon successful signup
    return response;
  } catch (error) {
    console.error('Signup service error:', error);
    throw error as ApiErrorResponse;
  }
};

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  // Assuming logout clears cookie and returns simple success
  try {
    const response = await apiClient.get<ApiResponse<null>>(
      '/api/v1/users/logout'
    ); // Endpoint to clear cookie
    return response;
  } catch (error) {
    console.error('Logout service error:', error);
    throw error as ApiErrorResponse;
  }
};

export const becomeFarmer = async (
  payload: BecomeFarmerPayload
): Promise<ApiResponse<{ user: BackendUser }>> => {
  try {
    const response = await apiClient.post<ApiResponse<{ user: BackendUser }>>(
      '/api/v1/users/become-farmer',
      payload
    );
    return response;
  } catch (error) {
    console.error('Become farmer service error:', error);
    throw error as ApiErrorResponse;
  }
};

export interface UpdateMePayload {
  name?: string;
  email?: string;
  // Add other updatable profile fields here, but not password
  // photo?: string; // If sending photo URL or for multer handling
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export const updateMe = async (
  payload: UpdateMePayload
): Promise<ApiResponse<{ user: BackendUser }>> => {
  try {
    // Assuming your backend route is PATCH /api/v1/users/updateMe
    // If using FormData for photo, headers will change, and apiClient might need adjustment for that specific call.
    // For now, assuming JSON payload.
    const response = await apiClient.patch<ApiResponse<{ user: BackendUser }>>(
      '/api/v1/users/updateMe',
      payload
    );
    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error as ApiErrorResponse;
  }
};

export const updateMyPassword = async (
  payload: UpdatePasswordPayload
): Promise<ApiResponse<any>> => {
  // Response might include new token or just success
  try {
    const response = await apiClient.patch<ApiResponse<any>>(
      '/api/v1/users/updatePassword',
      payload
    );
    // Backend might issue a new cookie/token if password change invalidates old ones
    return response;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error as ApiErrorResponse;
  }
};

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string; // Or passwordConfirm to match backend if it uses that
}

// Response from forgotPassword might just be a success message
export interface ForgotPasswordResponse {
  status: string;
  message: string;
  reset_url?: string; // Backend sends this for easier local testing, not for production emails
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await apiClient.post<ForgotPasswordResponse>(
      '/api/v1/users/forgotpassword', // Matches your backend route
      payload
    );
    return response; // Interceptor returns response.data
  } catch (error) {
    console.error('Forgot password service error:', error);
    throw error as ApiErrorResponse;
  }
};

export const resetPassword = async (
  token: string,
  payload: ResetPasswordPayload
): Promise<AuthResponse> => {
  // Assuming it logs the user in or returns user data + sets cookie
  try {
    const response = await apiClient.patch<AuthResponse>(
      `/api/v1/users/resetPassword/${token}`, // Matches your backend route
      payload
    );
    return response;
  } catch (error) {
    console.error('Reset password service error:', error);
    throw error as ApiErrorResponse;
  }
};
