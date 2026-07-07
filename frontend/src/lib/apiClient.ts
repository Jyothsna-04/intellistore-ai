import axios, { type AxiosInstance } from 'axios';
import { API_URL } from './config';

/**
 * Central Axios instance with:
 * - JWT Authorization header injected on every request from localStorage
 * - 401 interceptor clears token and redirects to /login
 * - Request/response error normalization
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: inject JWT ────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('intellistore_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: handle 401 ──────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('intellistore_token');
      localStorage.removeItem('intellistore_user');
      // Redirect to login without causing infinite loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ─── Helper to extract typed data from standard ApiResponse wrapper ─────────────
export function extractData<T>(response: { data: { data: T; message: string; success: boolean } }): T {
  return response.data.data;
}
