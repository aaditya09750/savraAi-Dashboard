import type { ApiSuccessResponse, DashboardOverview, TimeRange } from '../types';
import { apiClient, unwrapResponse } from './apiClient';

interface DashboardQuery {
  timeRange: TimeRange;
  class: string;
  subject: string;
  search: string;
}

export const dashboardApi = {
  async getOverview(query: DashboardQuery): Promise<DashboardOverview> {
    const { data } = await apiClient.get<ApiSuccessResponse<DashboardOverview>>('/dashboard', {
      params: query,
    });
    return unwrapResponse(data);
  },
};
