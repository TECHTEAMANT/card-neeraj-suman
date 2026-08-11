/**
 * API Client
 * Configured Axios instance with interceptors for request/response handling
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, DEFAULT_HEADERS, isDevelopment } from './config';
import { ApiError, ApiResponse } from './types';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: DEFAULT_HEADERS,
  withCredentials: true, // Enable cookies for session management
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (isDevelopment) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    // Add authentication token if available
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (isDevelopment) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Log errors in development
    if (isDevelopment) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        success: false,
        error: error.response.data?.error || error.message,
        message: error.response.data?.message,
        statusCode: error.response.status,
        path: error.config?.url,
      };

      // Handle authentication errors
      if (error.response.status === 401) {
        // Clear auth token and redirect to login
        localStorage.removeItem('auth_token');
        // You can add navigation logic here if needed
        console.warn('🔒 Authentication required');
      }

      // Handle server errors
      if (error.response.status >= 500) {
        console.error('🔥 Server Error:', apiError);
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response received
      const networkError: ApiError = {
        success: false,
        error: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
      };
      return Promise.reject(networkError);
    } else {
      // Something else happened
      const unknownError: ApiError = {
        success: false,
        error: 'Unknown Error',
        message: error.message,
      };
      return Promise.reject(unknownError);
    }
  }
);

// Helper function to handle API calls with proper typing
export async function apiCall<T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<T>(config);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.error,
      message: apiError.message,
    };
  }
}

export default apiClient;
