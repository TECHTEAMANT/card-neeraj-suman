/**
 * Google Sheets Service
 * Service for saving form data to Google Sheets via Apps Script
 */

export interface GoogleSheetsContactData {
  name: string;
  phone: string;
  timestamp?: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
}

// This will be the Google Apps Script deployment URL
// User needs to deploy the script and update this URL
const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || '';

export const googleSheetsService = {
  /**
   * Save contact data to Google Sheets
   */
  async saveContact(data: GoogleSheetsContactData): Promise<GoogleSheetsResponse> {
    try {
      if (!GOOGLE_APPS_SCRIPT_URL) {
        throw new Error('Google Sheets URL not configured. Please set VITE_GOOGLE_SHEETS_URL in environment variables.');
      }

      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script requires no-cors
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          timestamp: data.timestamp || new Date().toISOString(),
        }),
      });

      // Note: With no-cors mode, we can't read the response
      // We assume success if no error is thrown
      return {
        success: true,
        message: 'Contact saved successfully',
      };
    } catch (error: any) {
      console.error('Error saving to Google Sheets:', error);
      return {
        success: false,
        message: error.message || 'Failed to save contact to Google Sheets',
      };
    }
  },
};

export default googleSheetsService;
