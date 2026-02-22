import type {
  ApiSuccessResponse,
  TeacherDirectoryItem,
  TeacherOverview,
  TimeRange,
} from '../types';
import { apiClient, unwrapResponse } from './apiClient';

interface TeacherListQuery {
  search: string;
  class?: string;
  subject?: string;
  page?: number;
  limit?: number;
}

interface TeacherOverviewQuery {
  timeRange: TimeRange;
  class: string;
  subject: string;
}

export const teacherApi = {
  async list(query: TeacherListQuery): Promise<TeacherDirectoryItem[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<TeacherDirectoryItem[]>>('/teachers', {
      params: query,
    });
    return unwrapResponse(data);
  },

  async getOverview(teacherId: string, query: TeacherOverviewQuery): Promise<TeacherOverview> {
    const { data } = await apiClient.get<ApiSuccessResponse<TeacherOverview>>(`/teachers/${teacherId}`, {
      params: query,
    });
    return unwrapResponse(data);
  },

  async downloadReport(teacherId: string): Promise<Blob> {
    const { data } = await apiClient.get<Blob>(`/teachers/${teacherId}/report.csv`, {
      responseType: 'blob',
    });
    return data;
  },
};
