import type { LucideIcon } from 'lucide-react';

export type TrendDirection = 'up' | 'down' | 'neutral';
export type MetricColor = 'purple' | 'green' | 'rose' | 'yellow' | 'orange' | 'blue';
export type IconType = 'users' | 'book' | 'file-text' | 'check-circle' | 'award' | 'alert-triangle' | 'activity' | 'clock' | 'star';
export type TimeRange = 'week' | 'month' | 'year';

export interface Metric {
  id: string;
  label: string;
  value: string | number;
  sublabel: string;
  trend?: TrendDirection;
  iconType: IconType;
  color: MetricColor;
  isNote?: boolean; // Flag to distinguish text-based cards
}

export interface ActivityData {
  name: string;
  value: number;
  secondaryValue?: number;
}

export type PulseCategory = 'workload' | 'enrollment' | 'alert' | 'info';

export interface PulseItem {
  id: string;
  title: string;
  description?: string;
  category: PulseCategory;
  color: MetricColor;
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  grades: string[];
  stats: Metric[];
}

export interface RecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
}

export interface TeacherDirectoryItem {
  id: string;
  name: string;
  subject: string;
  class?: string;
  grade: string;
}

export interface DashboardOverview {
  metrics: Metric[];
  weeklyData: ActivityData[];
  pulseData: PulseItem[];
  aiSummary?: string;
}

export interface TeacherOverview {
  teacher: Teacher;
  classData: ActivityData[];
  activities: RecentActivityItem[];
}

export interface FilterOptions {
  classes?: string[];
  grades: string[];
  subjects: string[];
}

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  lastLoginAt?: string | null;
}

export interface LoginPayload {
  token: string;
  user: AuthUser;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  requestId: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  requestId?: string;
  errors?: Array<{
    segment?: string;
    field?: string;
    message: string;
  }>;
}

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}
