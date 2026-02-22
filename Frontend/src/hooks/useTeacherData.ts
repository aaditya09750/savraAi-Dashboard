import { useEffect, useState } from 'react';
import type { ActivityData, RecentActivityItem, Teacher, TimeRange } from '../types';
import { teacherApi } from '../services/teacherApi';
import { extractErrorMessage } from '../services/apiClient';

export const useTeacherData = (
  teacherId: string, 
  timeRange: TimeRange = 'week',
  gradeFilter?: string,
  subjectFilter?: string
) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classData, setClassData] = useState<ActivityData[]>([]);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const fetchTeacherData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const overview = await teacherApi.getOverview(teacherId, {
          timeRange,
          class: gradeFilter ?? 'All',
          subject: subjectFilter ?? 'All',
        });

        if (!mounted) {
          return;
        }

        setTeacher(overview.teacher);
        setClassData(overview.classData);
        setActivities(overview.activities);
      } catch (fetchError) {
        if (!mounted) {
          return;
        }

        setError(extractErrorMessage(fetchError));
        setTeacher(null);
        setClassData([]);
        setActivities([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchTeacherData();

    return () => {
      mounted = false;
    };
  }, [teacherId, timeRange, gradeFilter, subjectFilter]);

  return {
    teacher,
    classData,
    activities,
    isLoading,
    error,
  };
};
