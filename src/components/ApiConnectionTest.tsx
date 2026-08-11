/**
 * API Connection Test Component
 * Demonstrates how to use the API integration
 */

import { useHealthCheck } from '@/hooks/api/useHealthCheck';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const ApiConnectionTest = () => {
  const { data, isLoading, error, refetch } = useHealthCheck({
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Backend Connection Status
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {!isLoading && data?.status === 'ok' && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
          {!isLoading && error && <XCircle className="h-5 w-5 text-red-500" />}
        </CardTitle>
        <CardDescription>
          Testing connection to accountntax-api backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking connection...</span>
          </div>
        )}

        {!isLoading && data && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="default" className="bg-green-500">
                {data.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Backend URL:</span>
              <span className="text-sm text-muted-foreground">
                http://localhost:5001
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Check:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(data.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="destructive">OFFLINE</Badge>
            </div>
            <div className="text-sm text-red-500">
              {error.message || 'Unable to connect to backend'}
            </div>
            <div className="text-xs text-muted-foreground">
              Make sure the backend is running on port 5001
            </div>
          </div>
        )}

        <Button
          onClick={() => refetch()}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Recheck Connection'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiConnectionTest;
