import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BASE_API_URL = 'https://data.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

const headers = {
  'x-api-key': API_KEY,
  'Accept': 'application/json'
};

export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/notifications`, { headers });
    const notificationsData = response.data.notifications;

    // Insert notifications data into Supabase
    for (const notification of notificationsData) {
      const { data, error } = await supabase
        .from('notifications')
        .upsert(notification);

      if (error) throw error;
    }

    return notificationsData;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/notifications/read`, { notificationId }, { headers });
    if (response.data.status !== 'success') {
      throw new Error('Failed to mark notification as read');
    }

    // Update notification as read in Supabase
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
