import { createApiService } from './apiService';

/**
 * Service for fetching order data and saving it to the "orders" Supabase table.
 */
export const fetchOrdersAndSave = createApiService('/orders', 'orders');
