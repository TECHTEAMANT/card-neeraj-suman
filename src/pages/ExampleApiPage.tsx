/**
 * Example Page Component
 * Shows how to integrate the API connection test
 */

import ApiConnectionTest from '@/components/ApiConnectionTest';

export const ExampleApiPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">CA-Connect AI</h1>
          <p className="text-muted-foreground">
            Backend API Integration Example
          </p>
        </div>

        <div className="flex justify-center">
          <ApiConnectionTest />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Quick Start Guide</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">1. Backend Setup</h3>
              <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded">
                cd c:\Users\LENOVO\OneDrive\Desktop\ant\backend\accountntax-api
                <br />
                npm run dev
              </code>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Frontend Setup</h3>
              <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded">
                cd c:\Users\LENOVO\OneDrive\Desktop\ant\backend\ca ai\ca-connect-ai
                <br />
                npm run dev
              </code>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Using the API</h3>
              <p className="text-muted-foreground">
                Check the <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">API_INTEGRATION.md</code> file for detailed usage examples and available endpoints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleApiPage;
