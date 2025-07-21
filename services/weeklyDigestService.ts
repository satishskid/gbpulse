import axios from 'axios';
import type { NewsletterData } from '../types';
import { generateWeeklyDigest } from './rssService';

// Brevo API configuration for sending emails
const BREVO_API_URL = 'https://api.brevo.com/v3';
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

// Create axios instance
const brevoApi = axios.create({
  baseURL: BREVO_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api-key': BREVO_API_KEY,
  },
});

interface EmailCampaign {
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  sender: {
    name: string;
    email: string;
  };
  recipients: {
    listIds: number[];
  };
  scheduledAt?: string;
}

/**
 * Send weekly digest email to all subscribers
 */
export const sendWeeklyDigest = async (
  newsletterData: NewsletterData,
  listId: number = 1,
  senderEmail: string = 'noreply@greybrain.ai',
  senderName: string = 'GreyBrain AI Pulse'
): Promise<{ success: boolean; message: string; campaignId?: number }> => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    // Generate the weekly digest content
    const { subject, htmlContent, textContent } = generateWeeklyDigest(newsletterData);

    // Create email campaign
    const campaignData: EmailCampaign = {
      name: `Weekly Digest - ${new Date().toLocaleDateString()}`,
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent,
      sender: {
        name: senderName,
        email: senderEmail,
      },
      recipients: {
        listIds: [listId],
      },
    };

    const response = await brevoApi.post('/emailCampaigns', campaignData);

    if (response.data && response.data.id) {
      // Send the campaign immediately
      await brevoApi.post(`/emailCampaigns/${response.data.id}/sendNow`);

      return {
        success: true,
        message: 'Weekly digest sent successfully!',
        campaignId: response.data.id,
      };
    } else {
      throw new Error('Failed to create email campaign');
    }

  } catch (error: any) {
    console.error('Error sending weekly digest:', error);

    if (error.response?.data) {
      const errorData = error.response.data;
      return {
        success: false,
        message: errorData.message || 'Failed to send weekly digest',
      };
    }

    return {
      success: false,
      message: error.message || 'Unknown error occurred',
    };
  }
};

/**
 * Schedule weekly digest for future sending
 */
export const scheduleWeeklyDigest = async (
  newsletterData: NewsletterData,
  scheduledDate: Date,
  listId: number = 1,
  senderEmail: string = 'noreply@greybrain.ai',
  senderName: string = 'GreyBrain AI Pulse'
): Promise<{ success: boolean; message: string; campaignId?: number }> => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const { subject, htmlContent, textContent } = generateWeeklyDigest(newsletterData);

    const campaignData: EmailCampaign = {
      name: `Weekly Digest - ${scheduledDate.toLocaleDateString()}`,
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent,
      sender: {
        name: senderName,
        email: senderEmail,
      },
      recipients: {
        listIds: [listId],
      },
      scheduledAt: scheduledDate.toISOString(),
    };

    const response = await brevoApi.post('/emailCampaigns', campaignData);

    return {
      success: true,
      message: `Weekly digest scheduled for ${scheduledDate.toLocaleDateString()}`,
      campaignId: response.data.id,
    };

  } catch (error: any) {
    console.error('Error scheduling weekly digest:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to schedule digest',
    };
  }
};

/**
 * Get all email lists from Brevo
 */
export const getEmailLists = async (): Promise<any[]> => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const response = await brevoApi.get('/contacts/lists');
    return response.data.lists || [];
  } catch (error) {
    console.error('Error fetching email lists:', error);
    throw error;
  }
};

/**
 * Get campaign statistics
 */
export const getCampaignStats = async (campaignId: number): Promise<any> => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const response = await brevoApi.get(`/emailCampaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    throw error;
  }
};

/**
 * Test email sending (send to specific email)
 */
export const sendTestDigest = async (
  newsletterData: NewsletterData,
  testEmail: string,
  senderEmail: string = 'noreply@greybrain.ai',
  senderName: string = 'GreyBrain AI Pulse'
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const { subject, htmlContent, textContent } = generateWeeklyDigest(newsletterData);

    const emailData = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: testEmail,
          name: 'Test Subscriber',
        },
      ],
      subject: `[TEST] ${subject}`,
      htmlContent: htmlContent,
      textContent: textContent,
    };

    await brevoApi.post('/smtp/email', emailData);

    return {
      success: true,
      message: `Test digest sent to ${testEmail}`,
    };

  } catch (error: any) {
    console.error('Error sending test digest:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to send test email',
    };
  }
};

/**
 * Auto-schedule weekly digests (call this function weekly)
 */
export const autoScheduleWeeklyDigest = (newsletterData: NewsletterData): void => {
  // Schedule for every Friday at 9 AM
  const now = new Date();
  const nextFriday = new Date();
  
  // Find next Friday
  const daysUntilFriday = (5 - now.getDay() + 7) % 7;
  nextFriday.setDate(now.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday));
  nextFriday.setHours(9, 0, 0, 0);

  // If it's already past 9 AM on Friday, schedule for next Friday
  if (now.getDay() === 5 && now.getHours() >= 9) {
    nextFriday.setDate(nextFriday.getDate() + 7);
  }

  scheduleWeeklyDigest(newsletterData, nextFriday)
    .then(result => {
      if (result.success) {
        console.log('Weekly digest auto-scheduled:', result.message);
      } else {
        console.error('Failed to auto-schedule weekly digest:', result.message);
      }
    })
    .catch(error => {
      console.error('Error auto-scheduling weekly digest:', error);
    });
};

export default {
  sendWeeklyDigest,
  scheduleWeeklyDigest,
  getEmailLists,
  getCampaignStats,
  sendTestDigest,
  autoScheduleWeeklyDigest,
};
