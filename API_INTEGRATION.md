# API Integration Guide

## Overview

This document explains how to connect the CA-Connect AI frontend to the accountntax-api backend.

## Setup

### 1. Environment Configuration

Create a `.env` file in the project root (already created):

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_API_TIMEOUT=30000
VITE_ENV=development
```

### 2. Backend Server

Ensure your backend is running on port 5001:

```bash
cd c:\Users\LENOVO\OneDrive\Desktop\ant\backend\accountntax-api
npm run dev
```

### 3. Frontend Server

Start the frontend development server:

```bash
cd c:\Users\LENOVO\OneDrive\Desktop\ant\backend\ca ai\ca-connect-ai
npm run dev
```

The frontend will run on `http://localhost:8080`

## Architecture

### API Client (`src/lib/api/client.ts`)

The API client is built with Axios and includes:
- **Request Interceptors**: Automatically adds authentication tokens
- **Response Interceptors**: Handles errors and logging
- **Error Handling**: Converts errors to consistent format
- **Development Logging**: Logs all requests/responses in dev mode

### Configuration (`src/lib/api/config.ts`)

Central configuration for:
- API base URL from environment variables
- API endpoints structure
- Default headers
- Timeout settings

### Services (`src/services/api/`)

Service modules for different API domains:
- `health.service.ts` - Health check endpoint
- `whatsapp.service.ts` - WhatsApp messaging
- More services can be added as needed

### React Query Hooks (`src/hooks/api/`)

React Query hooks for data fetching:
- `useHealthCheck.ts` - Health check with auto-retry

## Usage Examples

### 1. Health Check

```typescript
import { useHealthCheck } from '@/hooks/api/useHealthCheck';

function MyComponent() {
  const { data, isLoading, error } = useHealthCheck();

  if (isLoading) return <div>Checking connection...</div>;
  if (error) return <div>Backend is offline</div>;
  
  return <div>Backend Status: {data?.status}</div>;
}
```

### 2. Send WhatsApp Message

```typescript
import { whatsappService } from '@/services/api';

async function sendMessage() {
  const result = await whatsappService.sendMessage({
    phoneNumber: '+1234567890',
    message: 'Hello from CA-Connect AI!',
  });

  if (result.success) {
    console.log('Message sent:', result.data?.messageId);
  } else {
    console.error('Failed:', result.error);
  }
}
```

### 3. Direct API Call

```typescript
import apiClient from '@/lib/api/client';

async function fetchData() {
  try {
    const response = await apiClient.get('/api/v1/clients');
    console.log('Clients:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Available Endpoints

### Health
- `GET /health` - Check backend health

### WhatsApp
- `POST /api/v1/whatsapp/send` - Send WhatsApp message
- `GET /api/v1/webhook/verify` - Verify webhook

### Clients
- `GET /api/v1/clients` - List all clients
- `POST /api/v1/clients` - Create new client
- `GET /api/v1/clients/:id` - Get client by ID
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client

### Media
- `POST /api/v1/upload` - Upload file
- `GET /api/v1/media/:filename` - Get media file

## Proxy Configuration

The Vite dev server is configured to proxy API requests:
- `/api/*` → `http://localhost:5001/api/*`
- `/health` → `http://localhost:5001/health`

This eliminates CORS issues during development.

## Error Handling

All API errors are normalized to this format:

```typescript
interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
  path?: string;
}
```

### Common Error Scenarios

1. **Network Error**: Backend is offline
2. **401 Unauthorized**: Authentication required
3. **403 Forbidden**: Insufficient permissions
4. **404 Not Found**: Endpoint doesn't exist
5. **500 Server Error**: Backend error

## Authentication

The API client automatically:
1. Reads `auth_token` from localStorage
2. Adds it to request headers as `Authorization: Bearer <token>`
3. Clears token on 401 errors

To set authentication:

```typescript
localStorage.setItem('auth_token', 'your-token-here');
```

## Adding New Services

1. Create service file in `src/services/api/`:

```typescript
// src/services/api/clients.service.ts
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';

export const clientsService = {
  async getAll() {
    const response = await apiClient.get(API_ENDPOINTS.clients.list);
    return response.data;
  },
};
```

2. Export from `src/services/api/index.ts`:

```typescript
export { default as clientsService } from './clients.service';
```

3. Create React Query hook in `src/hooks/api/`:

```typescript
// src/hooks/api/useClients.ts
import { useQuery } from '@tanstack/react-query';
import { clientsService } from '@/services/api';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.getAll(),
  });
};
```

## Troubleshooting

### Backend Connection Failed

1. Check if backend is running: `http://localhost:5001/health`
2. Verify `.env` has correct `VITE_API_BASE_URL`
3. Check browser console for CORS errors
4. Ensure both servers are running

### CORS Errors

The backend already has CORS enabled. If you see CORS errors:
1. Restart both frontend and backend servers
2. Clear browser cache
3. Check backend CORS configuration in `app.ts`

### 401 Errors

1. Check if `auth_token` is set in localStorage
2. Verify token is valid
3. Check backend authentication middleware

### Type Errors

1. Ensure all TypeScript types are imported correctly
2. Run `npm run build` to check for type errors
3. Update types in `src/lib/api/types.ts` as needed

## Next Steps

1. Add more service modules for other backend endpoints
2. Create React Query hooks for common operations
3. Implement authentication flow
4. Add request caching strategies
5. Set up error boundary components
