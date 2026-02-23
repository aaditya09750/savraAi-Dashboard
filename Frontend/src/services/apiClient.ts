import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // Crucial for BetterAuth session cookies
});

// Request interceptor removed: BetterAuth handles sessions via cookies automatically

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      // BetterAuth handles cookie cleanup; we just notify the UI
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? error.message ?? 'Request failed.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error occurred.';
};

export const unwrapResponse = <T>(response: ApiSuccessResponse<T>): T => response.data;
