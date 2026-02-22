import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types';
import { authStorage } from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      authStorage.clearToken();
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
