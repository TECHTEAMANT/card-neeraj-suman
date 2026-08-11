/**
 * WhatsApp Service
 * Service for WhatsApp-related API calls
 */

import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';
import { ApiResponse } from '@/lib/api/types';

// WhatsApp Message Types
export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'image' | 'document' | 'video' | 'audio';
  text?: {
    body: string;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    filename?: string;
    caption?: string;
  };
}

export interface SendMessageRequest {
  phoneNumber: string;
  message: string;
  messageType?: 'text';
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const whatsappService = {
  /**
   * Send a text message via WhatsApp
   */
  async sendMessage(data: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>> {
    try {
      const response = await apiClient.post<SendMessageResponse>(
        API_ENDPOINTS.whatsapp.sendMessage,
        data
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.error || 'Failed to send message',
        message: error.message,
      };
    }
  },

  /**
   * Get WhatsApp webhook verification token
   */
  async verifyWebhook(params: {
    'hub.mode': string;
    'hub.verify_token': string;
    'hub.challenge': string;
  }): Promise<string> {
    const response = await apiClient.get<string>(API_ENDPOINTS.whatsapp.verify, {
      params,
    });
    return response.data;
  },
};

export default whatsappService;
