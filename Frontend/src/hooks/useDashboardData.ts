import { useEffect, useState } from 'react';
import type { ActivityData, Metric, PulseItem, TimeRange } from '../types';
import { dashboardApi } from '../services/dashboardApi';
import { extractErrorMessage } from '../services/apiClient';

export const useDashboardData = (
  timeRange: TimeRange,
  gradeFilter?: string,
  subjectFilter?: string,
  searchQuery?: string
) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [weeklyData, setWeeklyData] = useState<ActivityData[]>([]);
  const [pulseData, setPulseData] = useState<PulseItem[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const overview = await dashboardApi.getOverview({
          timeRange,
          class: gradeFilter ?? 'All',
          subject: subjectFilter ?? 'All',
          search: searchQuery ?? '',
        });

        if (!mounted) {
          return;
        }

        setMetrics(overview.metrics);
        setWeeklyData(overview.weeklyData);
        setPulseData(overview.pulseData);
        setAiSummary(overview.aiSummary ?? '');
      } catch (fetchError) {
        if (!mounted) {
          return;
        }
        setError(extractErrorMessage(fetchError));
        setMetrics([]);
        setWeeklyData([]);
        setPulseData([]);
        setAiSummary('');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, [timeRange, gradeFilter, subjectFilter, searchQuery]);

  return {
    metrics,
    weeklyData,
    pulseData,
    aiSummary,
    isLoading,
    error,
  };
};
