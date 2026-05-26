import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: false,
  timeout: 15000,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const sessionId = localStorage.getItem('sm_session_id');
    if (sessionId) {
      config.headers['x-session-id'] = sessionId;
    }
  }
  return config;
});

// Normalize error responses
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: unknown[] }>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('sm_token');
      if (!window.location.pathname.startsWith('/account/login')) {
        window.location.href = `/account/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper to extract error message from axios error
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'Something went wrong.';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}
