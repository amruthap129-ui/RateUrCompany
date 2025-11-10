import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const apiClient = {
  // GET method
  async get(path: string) {
    const url = `${BASE_URL}${path}`;
    console.log('➡️ GET:', url);
    const response = await axios.get(url);
    return response;
  },

  // POST method
  async post(path: string, body: any) {
    const url = `${BASE_URL}${path}`;
    console.log('➡️ POST:', url, body);
    const response = await axios.post(url, body);
    return response;
  },
};
