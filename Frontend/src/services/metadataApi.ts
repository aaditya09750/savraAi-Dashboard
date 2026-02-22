import type { ApiSuccessResponse, FilterOptions } from '../types';
import { apiClient, unwrapResponse } from './apiClient';

export const metadataApi = {
  async getFilters(): Promise<FilterOptions> {
    const { data } = await apiClient.get<ApiSuccessResponse<FilterOptions>>('/meta/filters');
    return unwrapResponse(data);
  },
};

