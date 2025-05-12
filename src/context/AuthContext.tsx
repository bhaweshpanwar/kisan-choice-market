// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback, // Added
} from 'react';
import {
  loginUser as apiLogin,
  signupUser as apiSignup,
  logoutUser as apiLogout, // Added
  becomeFarmer as apiBecomeFarmer,
  getMe as apiGetMe, // Added
  LoginPayload,
  SignupPayload,
  BecomeFarmerPayload,
  AuthResponse,
  BackendUser,
  ApiErrorResponse,
} from '@/services/authService';
import { toast } from 'sonner';

export interface User extends BackendUser {
  farmerDetails?: {
    experience: number;
    farm_location: string;
    certifications: string[];
    location: string;
    specialization: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User | void>;
  signup: (payload: SignupPayload) => Promise<User | void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  commonAuthSuccessHandlerAfterReset: (responseData: AuthResponse) => User;
  updateUserRoleAndDetails: (
    role: 'consumer' | 'farmer',
    details?: BecomeFarmerPayload
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Key state
  const [isLoading, setIsLoading] = useState(true); // For initial auth check

  const handleLoginOrSignupSuccess = (responseData: AuthResponse): User => {
    const backendUser = responseData.data.user;
    const appUser: User = { ...backendUser };
    localStorage.setItem('user', JSON.stringify(appUser));
    setUser(appUser);
    setIsAuthenticated(true);
    console.log('Auth success (login/signup/getMe). User:', appUser);
    return appUser;
  };

  const commonAuthSuccessHandlerAfterReset = (
    responseData: AuthResponse
  ): User => {
    console.log('Password reset successful, attempting to set auth state.');
    return handleLoginOrSignupSuccess(responseData); // Reuse the main success handler
  };

  // Function to check auth status, typically on app load
  const checkAuthStatus = useCallback(async () => {
    console.log('Attempting to check auth status via /me endpoint...');
    setIsLoading(true);
    try {
      // No need to set user from localStorage here if /me is the source of truth
      // The main goal is to verify the cookie with the backend.
      const responseData = await apiGetMe(); // Hit /me endpoint
      handleLoginOrSignupSuccess(responseData);

      console.log(
        'Auth status check SUCCESS: User is authenticated via /me.',
        responseData.data.user
      );
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      // This is expected if no valid cookie/session exists
      console.log(
        'Auth status check FAILED (or no active session):',
        apiError.message
      );
      localStorage.removeItem('user'); // Clear any stale user data
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []); // commonAuthSuccessHandler is not a dependency if defined outside or memoized

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (payload: LoginPayload): Promise<User | void> => {
    setIsLoading(true);
    try {
      const responseData = await apiLogin(payload);
      // Backend sets the cookie. If successful, responseData contains user.
      const loggedInUser = handleLoginOrSignupSuccess(responseData);
      toast.success('Logged in successfully!');
      return loggedInUser;
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || 'Login failed. Please try again.');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      console.error('Login failed in context:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: SignupPayload): Promise<User | void> => {
    setIsLoading(true);
    try {
      const responseData = await apiSignup(payload);
      // Backend sets the cookie.
      const signedUpUser = handleLoginOrSignupSuccess(responseData);
      toast.success('Account created successfully!');
      return signedUpUser;
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || 'Signup failed. Please try again.');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      console.error('Signup failed in context:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout(); // Call backend to clear the HTTP-Only cookie
      toast.info('Logged out successfully.');
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || 'Logout failed. Please try again.');
      // Even if backend call fails, clear frontend state
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user'); // Clear local user cache
      setIsLoading(false);
      // Navigation will be handled by components (e.g., redirect to /login)
    }
  };

  const updateUserRoleAndDetails = async (
    newRole: 'consumer' | 'farmer',
    details?: BecomeFarmerPayload
  ) => {
    if (!user) {
      toast.error('User not found. Please log in.');
      throw new Error('User not authenticated');
    }
    setIsLoading(true);
    try {
      let updatedUserData: BackendUser;

      if (newRole === 'farmer' && details) {
        const response = await apiBecomeFarmer(details);
        updatedUserData = response.data.user;
        toast.success('Profile updated to Farmer!');
      } else if (newRole === 'consumer' && user.role !== 'consumer') {
        // You might need a specific API endpoint to change role back to consumer
        // For now, assume it's just a local change or part of a general profile update
        // updatedUserData = await apiUpdateProfile({ role: 'consumer' });
        updatedUserData = { ...user, role: newRole }; // Placeholder
        toast.info('Role set to Consumer.');
      } else {
        updatedUserData = { ...user, role: newRole };
      }

      const appUser: User = { ...updatedUserData };
      setUser(appUser);
      localStorage.setItem('user', JSON.stringify(appUser));
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.message || 'Failed to update role.');
      console.error('Failed to update role/details:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        checkAuthStatus,
        updateUserRoleAndDetails,
        commonAuthSuccessHandlerAfterReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
