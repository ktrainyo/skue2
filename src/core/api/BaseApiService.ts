import axios from 'axios';

export class BaseApiService {
  // ...existing code...

  async get(url: string, config?: any) {
    // ...handle retries, error handling...
    return axios.get(url, config);
  }

  async post(url: string, data: any, config?: any) {
    // ...handle retries, error handling...
    return axios.post(url, data, config);
  }

  async put(url: string, data: any, config?: any) {
    // ...handle retries, error handling...
    return axios.put(url, data, config);
  }
}
