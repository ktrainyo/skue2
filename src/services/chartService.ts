
import { supabase } from '@/composables/useSupabase';

export async function fetchChartData(tokenAddress: string) {
  try {
    const response = await axios.get(`${BASE_API_URL}/tokens/${tokenAddress}/chart`, { headers });
    const chartData = response.data;

    // Insert chart data into Supabase
    for (const dataPoint of chartData) {
      const { data, error } = await supabase
        .from('token_chart_data')
        .upsert({ ...dataPoint, token: tokenAddress });

      if (error) throw error;
    }

    return chartData;
  } catch (error) {
    console.error('Error fetching token chart data:', error);
    throw error;
  }
}
