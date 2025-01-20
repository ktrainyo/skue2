import { supabase } from '@/composables/useSupabase';
import { ofetch } from 'ofetch';

// Create different API instances for different services
export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value;
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  },
});

// Solana Tracker API instance
export const $solanaTrackerApi = ofetch.create({
  baseURL: 'https://data.solanatracker.io',
  headers: {
    'x-api-key': import.meta.env.VITE_SOLANA_TRACKER_API_KEY,
    'Accept': 'application/json'
  }
});

// Generic API handler with Supabase integration
export const createApiHandler = (api: typeof ofetch) => {
  return {
    async get<T>(url: string, options?: any): Promise<T> {
      try {
        return await api(url, {
          method: 'GET',
          ...options
        });
      } catch (error) {
        console.error(`API GET Error (${url}):`, error);
        throw error;
      }
    },

    async post<T>(url: string, data: any, options?: any): Promise<T> {
      try {
        return await api(url, {
          method: 'POST',
          body: data,
          ...options
        });
      } catch (error) {
        console.error(`API POST Error (${url}):`, error);
        throw error;
      }
    },

    // Add Supabase integration
    async getAndStore<T>(
      url: string, 
      table: string, 
      transform?: (data: any) => any,
      options?: any
    ): Promise<T> {
      try {
        const response = await api(url, {
          method: 'GET',
          ...options
        });

        const dataToStore = transform ? transform(response) : response;

        const { error: supabaseError } = await supabase
          .from(table)
          .upsert(dataToStore);

        if (supabaseError) {
          throw new Error(`Supabase Error: ${supabaseError.message}`);
        }

        return response;
      } catch (error) {
        console.error(`API GetAndStore Error (${url}):`, error);
        throw error;
      }
    },

    // Batch processing with Supabase
    async batchProcess<T>(
      items: any[],
      table: string,
      processItem: (item: any) => Promise<any>,
      options?: {
        batchSize?: number;
        retryCount?: number;
        delayBetweenBatches?: number;
      }
    ): Promise<T[]> {
      const {
        batchSize = 50,
        retryCount = 3,
        delayBetweenBatches = 1000
      } = options || {};

      const results: T[] = [];
      const batches = [];

      // Split items into batches
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
      }

      // Process each batch
      for (const batch of batches) {
        try {
          const batchResults = await Promise.all(
            batch.map(item => processItem(item))
          );

          // Store results in Supabase
          const { error: supabaseError } = await supabase
            .from(table)
            .upsert(batchResults);

          if (supabaseError) {
            throw new Error(`Supabase Error: ${supabaseError.message}`);
          }

          results.push(...batchResults);

          // Delay between batches
          if (delayBetweenBatches > 0) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
          }
        } catch (error) {
          console.error('Batch processing error:', error);
          if (retryCount > 0) {
            console.log(`Retrying batch with ${retryCount - 1} attempts remaining`);
            return this.batchProcess(
              batch,
              table,
              processItem,
              { ...options, retryCount: retryCount - 1 }
            );
          }
          throw error;
        }
      }

      return results;
    }
  };
};

// Create API handlers
export const apiHandler = createApiHandler($api);
export const solanaTrackerHandler = createApiHandler($solanaTrackerApi);

// Export type-safe versions of the handlers
export type ApiHandler = ReturnType<typeof createApiHandler>;
