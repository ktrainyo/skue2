import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

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

export const fetchUserActivities = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/user-activity/${userId}`, { headers });
    const activitiesData = response.data.activities;

    // Insert user activities data into Supabase
    for (const activity of activitiesData) {
      const { data, error } = await supabase
        .from('user_activities')
        .upsert(activity);

      if (error) throw error;
    }

    return activitiesData;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    throw error;
  }
};
