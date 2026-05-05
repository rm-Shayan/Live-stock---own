import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use localhost for web browser testing, your machine IP for physical device/emulator
// Use the machine IP for physical device testing
const API_BASE_URL = 'https://live-stock-own.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000, // 15 second timeout
});

// ── Request Interceptor: attach token ──────────────────────────────────────
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor: log errors ──────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API] ✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      const status = error.response?.status;
      const url = error.config?.url;
      const msg = error.response?.data?.message || error.message;
      console.error(`[API] ❌ ${status || 'NETWORK'} ${url} — ${msg}`);
    }
    return Promise.reject(error);
  }
);

export default api;
