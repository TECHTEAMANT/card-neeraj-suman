/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

// Environment variables with type safety
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  env: import.meta.env.VITE_ENV || 'development',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  health: '/health',
  
  // WhatsApp
  whatsapp: {
    webhook: '/api/v1/webhook',
    verify: '/api/v1/webhook/verify',
    sendMessage: '/api/v1/whatsapp/send-message',
  },
  
  // Clients
  clients: {
    list: '/api/v1/clients',
    create: '/api/v1/clients',
    update: (id: string) => `/api/v1/clients/${id}`,
    delete: (id: string) => `/api/v1/clients/${id}`,
    get: (id: string) => `/api/v1/clients/${id}`,
  },
  
  // Media
  media: {
    upload: '/api/v1/upload',
    proxy: (filename: string) => `/api/v1/media/${encodeURIComponent(filename)}`,
  },
} as const;

// Request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

// Check if we're in development mode
export const isDevelopment = API_CONFIG.env === 'development';

// Log configuration in development
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    env: API_CONFIG.env,
  });
}
