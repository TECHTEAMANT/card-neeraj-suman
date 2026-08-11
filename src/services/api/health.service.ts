/**
 * Health Check Service
 * Service for checking backend API health and connectivity
 */

import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import { HealthCheckResponse } from '@/lib/api/types';

export const healthService = {
  /**
   * Check if the backend API is healthy and accessible
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    const response = await apiClient.get<HealthCheckResponse>(API_ENDPOINTS.health);
    return response.data;
  },
};

export default healthService;
