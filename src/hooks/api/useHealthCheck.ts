/**
 * useHealthCheck Hook
 * React Query hook for checking backend API health
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { healthService } from '@/services/api';
import { HealthCheckResponse } from '@/lib/api/types';

export const useHealthCheck = (
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
): UseQueryResult<HealthCheckResponse, Error> => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => healthService.checkHealth(),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useHealthCheck;
