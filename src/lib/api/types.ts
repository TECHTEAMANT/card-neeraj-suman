/**
 * API Types
 * Common TypeScript interfaces for API requests and responses
 */

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error Response
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
  path?: string;
}

// Health Check Response
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request Config
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}
