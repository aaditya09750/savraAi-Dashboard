import { useMemo } from 'react';
import { getDashboardMetrics, getWeeklyActivityData, getPulseSummary } from '../utils/analytics';

export const useDashboardData = (
  timeRange: 'week' | 'month' | 'year',
  gradeFilter?: string,
  subjectFilter?: string,
  searchQuery?: string
) => {
  const metrics = useMemo(() => 
    getDashboardMetrics(timeRange, gradeFilter, subjectFilter), 
    [timeRange, gradeFilter, subjectFilter]
  );
  
  const weeklyData = useMemo(() => 
    getWeeklyActivityData(timeRange, gradeFilter, subjectFilter), 
    [timeRange, gradeFilter, subjectFilter]
  );
  
  const pulseData = useMemo(() => 
    getPulseSummary(searchQuery), 
    [searchQuery]
  );

  return {
    metrics,
    weeklyData,
    pulseData,
  };
};
