import { createApiService } from './apiService';

export const fetchUsersAndSave = createApiService('/users', 'users');
