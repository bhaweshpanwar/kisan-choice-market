// src/services/api.ts
import axios, {
  AxiosError,
  AxiosInstance,
  // InternalAxiosRequestConfig, // No longer need to intercept request to add token
} from 'axios';

export interface ApiErrorResponse {
  status: string;
  message: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  status: string;
  data: T;
  // No token field here if it's not in the JSON response
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kisan-choice.onrender.com';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <--- CRUCIAL FOR COOKIE-BASED AUTH
});

// Request interceptor is NO LONGER NEEDED to add Authorization header
// apiClient.interceptors.request.use( ... );

apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return the JSON data part of the response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      console.error('API Error Data:', error.response.data);
      console.error('API Error Status:', error.response.status);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Network Error - No response received.');
      console.error('Request Details:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      });
      return Promise.reject({
        status: 'error',
        message: 'Network error, please check your connection.',
      } as ApiErrorResponse);
    } else {
      console.error('Error:', error.message);
      return Promise.reject({
        status: 'error',
        message: error.message || 'An unexpected error occurred.',
      } as ApiErrorResponse);
    }
  }
);

export default apiClient;
