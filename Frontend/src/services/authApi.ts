import type { ApiSuccessResponse, AuthUser, LoginPayload } from '../types';
import { apiClient, unwrapResponse } from './apiClient';

interface LoginRequest {
  username: string;
  password: string;
}

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginPayload> {
    const { data } = await apiClient.post<ApiSuccessResponse<LoginPayload>>('/auth/login', payload);
    return unwrapResponse(data);
  },

  async me(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiSuccessResponse<AuthUser>>('/auth/me');
    return unwrapResponse(data);
  },
};

