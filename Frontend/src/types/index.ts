export type TrendDirection = 'up' | 'down' | 'neutral';
export type MetricColor = 'purple' | 'green' | 'rose' | 'yellow' | 'orange' | 'blue';
export type IconType = 'users' | 'book' | 'file-text' | 'check-circle' | 'award' | 'alert-triangle' | 'activity' | 'clock' | 'star';

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

export interface NavItem {
  label: string;
  path: string;
  icon: any; // Lucide icon component type
}
