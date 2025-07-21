import axios from 'axios';

// Brevo API configuration
const BREVO_API_URL = 'https://api.brevo.com/v3';
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

// Types for Brevo API
interface BrevoContact {
  email: string;
  attributes?: {
    FIRSTNAME?: string;
    LASTNAME?: string;
    [key: string]: any;
  };
  listIds?: number[];
  updateEnabled?: boolean;
}

interface BrevoResponse {
  id?: number;
  message?: string;
  code?: string;
}

// Create axios instance with default headers
const brevoApi = axios.create({
  baseURL: BREVO_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api-key': BREVO_API_KEY,
  },
});

/**
 * Add a contact to Brevo mailing list
 * @param email - Email address to subscribe
 * @param firstName - Optional first name
 * @param lastName - Optional last name
 * @param listId - Brevo list ID (default: 1)
 * @returns Promise with success/error result
 */
export const subscribeToNewsletter = async (
  email: string,
  firstName?: string,
  lastName?: string,
  listId: number = 1
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    const contactData: BrevoContact = {
      email: email.toLowerCase().trim(),
      updateEnabled: true,
      listIds: [listId],
    };

    // Add name attributes if provided
    if (firstName || lastName) {
      contactData.attributes = {};
      if (firstName) contactData.attributes.FIRSTNAME = firstName.trim();
      if (lastName) contactData.attributes.LASTNAME = lastName.trim();
    }

    const response = await brevoApi.post('/contacts', contactData);

    return {
      success: true,
      message: 'Successfully subscribed to GreyBrain AI Pulse!',
      data: response.data,
    };

  } catch (error: any) {
    console.error('Brevo subscription error:', error);

    // Handle specific Brevo API errors
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Contact already exists
      if (errorData.code === 'duplicate_parameter') {
        return {
          success: true,
          message: 'You are already subscribed to our newsletter!',
        };
      }
      
      // Invalid email
      if (errorData.code === 'invalid_parameter') {
        return {
          success: false,
          message: 'Please enter a valid email address.',
        };
      }
      
      return {
        success: false,
        message: errorData.message || 'Subscription failed. Please try again.',
      };
    }

    // Network or other errors
    if (error.message) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
};

/**
 * Get contact information from Brevo
 * @param email - Email address to look up
 * @returns Promise with contact data or null if not found
 */
export const getContact = async (email: string): Promise<any | null> => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const response = await brevoApi.get(`/contacts/${encodeURIComponent(email)}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // Contact not found
    }
    console.error('Error fetching contact:', error);
    throw error;
  }
};

/**
 * Get all mailing lists from Brevo account
 * @returns Promise with lists data
 */
export const getLists = async (): Promise<any[]> => {
  try {
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key not configured');
    }

    const response = await brevoApi.get('/contacts/lists');
    return response.data.lists || [];
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};

export default {
  subscribeToNewsletter,
  getContact,
  getLists,
};
