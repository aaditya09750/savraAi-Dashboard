import { useMemo } from 'react';
import { getTeacherProfile, getClassBreakdown, getTeacherRecentActivity } from '../utils/analytics';

export const useTeacherData = (
  teacherId: string, 
  timeRange: 'week' | 'month' | 'year' = 'week',
  gradeFilter?: string,
  subjectFilter?: string
) => {
  const teacher = useMemo(() => 
    getTeacherProfile(teacherId, timeRange, gradeFilter, subjectFilter), 
    [teacherId, timeRange, gradeFilter, subjectFilter]
  );
  
  const classData = useMemo(() => 
    getClassBreakdown(teacherId, timeRange, gradeFilter, subjectFilter), 
    [teacherId, timeRange, gradeFilter, subjectFilter]
  );
  
  const activities = useMemo(() => 
    getTeacherRecentActivity(teacherId, timeRange, gradeFilter, subjectFilter), 
    [teacherId, timeRange, gradeFilter, subjectFilter]
  );

  return {
    teacher,
    classData,
    activities,
    isLoading: !teacher,
  };
};
