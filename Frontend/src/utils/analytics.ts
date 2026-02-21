import { rawActivityLog as originalLogs, RawActivity } from '../data/dataset';
import { ActivityData, PulseItem, Teacher, Metric, RecentActivityItem } from '../types';

// --- Data Pre-processing ---

// 1. Deduplicate Logs: Handle duplicate entries gracefully by creating a unique signature for each log
const deduplicateLogs = (logs: RawActivity[]): RawActivity[] => {
  const seen = new Set();
  return logs.filter(log => {
    const signature = `${log.teacherId}-${log.createdAt}-${log.activityType}-${log.subject}-${log.grade}`;
    if (seen.has(signature)) {
      return false;
    }
    seen.add(signature);
    return true;
  });
};

const rawActivityLog = deduplicateLogs(originalLogs);

// 2. Determine Timeframe: Find the latest date to simulate "Current Date" relative to the dataset
const LATEST_DATE = new Date(Math.max(...rawActivityLog.map(l => new Date(l.createdAt).getTime())));

const filterByTimeRange = (dateStr: string, range: 'week' | 'month' | 'year') => {
  const date = new Date(dateStr);
  const diffTime = Math.abs(LATEST_DATE.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (range === 'week') return diffDays <= 7;
  if (range === 'month') return date.getMonth() === LATEST_DATE.getMonth() && date.getFullYear() === LATEST_DATE.getFullYear();
  if (range === 'year') return date.getFullYear() === LATEST_DATE.getFullYear();
  return true;
};

// --- Global Data Helpers ---

export const getAllTeachers = () => {
  const teacherMap = new Map<string, { id: string; name: string; subject: string; grade: string }>();
  
  rawActivityLog.forEach(log => {
    if (!teacherMap.has(log.teacherId)) {
      teacherMap.set(log.teacherId, {
        id: log.teacherId,
        name: log.teacherName,
        subject: log.subject,
        grade: log.grade
      });
    }
  });

  return Array.from(teacherMap.values());
};

export const getAvailableGrades = () => Array.from(new Set(rawActivityLog.map(l => l.grade))).sort();
export const getAvailableSubjects = () => Array.from(new Set(rawActivityLog.map(l => l.subject))).sort();

// --- Dashboard Analytics ---

export const getDashboardMetrics = (
  timeRange: 'week' | 'month' | 'year' = 'week',
  gradeFilter?: string,
  subjectFilter?: string
): Metric[] => {
  let filteredLogs = rawActivityLog.filter(log => filterByTimeRange(log.createdAt, timeRange));

  if (gradeFilter && gradeFilter !== 'All') {
    filteredLogs = filteredLogs.filter(log => log.grade === gradeFilter);
  }
  if (subjectFilter && subjectFilter !== 'All') {
    filteredLogs = filteredLogs.filter(log => log.subject === subjectFilter);
  }

  const uniqueTeachers = new Set(filteredLogs.map(a => a.teacherId)).size;
  const lessonsCreated = filteredLogs.filter(a => a.activityType === 'Lesson Plan').length;
  const assessmentsMade = filteredLogs.filter(a => a.activityType === 'Question Paper').length;
  const quizzesConducted = filteredLogs.filter(a => a.activityType === 'Quiz').length;
  
  // Calculate submission rate: (Quizzes / Total Activities) * 100
  const total = lessonsCreated + assessmentsMade + quizzesConducted;
  const submissionRate = total > 0 ? Math.round((quizzesConducted / total) * 100) + "%" : "0%";

  const rangeLabel = timeRange === 'week' ? 'This week' : timeRange === 'month' ? 'This month' : 'This year';

  return [
    { id: '1', label: 'Active Teachers', value: uniqueTeachers, sublabel: rangeLabel, iconType: 'users', color: 'purple' },
    { id: '2', label: 'Lessons Created', value: lessonsCreated, sublabel: rangeLabel, iconType: 'book', color: 'green' },
    { id: '3', label: 'Assessments Made', value: assessmentsMade, sublabel: rangeLabel, iconType: 'file-text', color: 'rose' },
    { id: '4', label: 'Quizzes Conducted', value: quizzesConducted, sublabel: rangeLabel, iconType: 'book', color: 'yellow' },
    { id: '5', label: 'Submission Rate', value: submissionRate, sublabel: rangeLabel, iconType: 'award', color: 'purple' },
  ];
};

export const getWeeklyActivityData = (
  timeRange: 'week' | 'month' | 'year' = 'week',
  gradeFilter?: string,
  subjectFilter?: string
): ActivityData[] => {
  let filteredLogs = rawActivityLog.filter(log => filterByTimeRange(log.createdAt, timeRange));

  if (gradeFilter && gradeFilter !== 'All') {
    filteredLogs = filteredLogs.filter(log => log.grade === gradeFilter);
  }
  if (subjectFilter && subjectFilter !== 'All') {
    filteredLogs = filteredLogs.filter(log => log.subject === subjectFilter);
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts: Record<string, number> = {};
  
  filteredLogs.forEach(log => {
    const date = new Date(log.createdAt);
    const dayName = days[date.getDay()];
    counts[dayName] = (counts[dayName] || 0) + 1;
  });

  const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return orderedDays.map(day => ({
    name: day,
    value: counts[day] || 0,
    secondaryValue: Math.max(0, (counts[day] || 0) * 0.6) // Simulated secondary metric for visual consistency
  }));
};

export const getPulseSummary = (searchQuery?: string): PulseItem[] => {
  // Generate dynamic insights based on the full dataset
  const teacherCounts: Record<string, number> = {};
  const gradeCounts: Record<string, number> = {};
  
  rawActivityLog.forEach(l => { 
    teacherCounts[l.teacherName] = (teacherCounts[l.teacherName] || 0) + 1; 
    gradeCounts[l.grade] = (gradeCounts[l.grade] || 0) + 1;
  });

  const sortedTeachers = Object.entries(teacherCounts).sort((a,b) => b[1] - a[1]);
  const sortedGrades = Object.entries(gradeCounts).sort((a,b) => b[1] - a[1]);

  const topTeacher = sortedTeachers[0];
  const topGrade = sortedGrades[0];

  const items: PulseItem[] = [
    { 
      id: '1', 
      title: `${topTeacher ? topTeacher[0] : 'Staff'} has the highest workload`, 
      description: `with ${topTeacher ? topTeacher[1] : 0} activities logged.`, 
      category: 'workload', 
      color: 'purple' 
    },
    { 
      id: '2', 
      title: `Grade ${topGrade ? topGrade[0] : '10'} has the most active assessments`, 
      description: 'across all subjects.', 
      category: 'enrollment', 
      color: 'green' 
    },
    { 
      id: '3', 
      title: 'Science Dept has low lesson plan submission', 
      description: '- consider sending a reminder.', 
      category: 'alert', 
      color: 'yellow' 
    },
    { 
      id: '4', 
      title: 'New "AI Grading" feature is now live', 
      description: 'for all math teachers.', 
      category: 'info', 
      color: 'rose' 
    }
  ];

  if (!searchQuery) return items;
  return items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

// --- Teacher View Analytics ---

export const getTeacherProfile = (
  teacherId: string, 
  timeRange: 'week' | 'month' | 'year' = 'week',
  gradeFilter?: string,
  subjectFilter?: string
): Teacher | null => {
  // 1. Get Base Teacher Info (ignoring filters for static info like name)
  const allLogs = rawActivityLog.filter(l => l.teacherId === teacherId);
  if (allLogs.length === 0) return null;

  const name = allLogs[0].teacherName;
  const subjects = Array.from(new Set(allLogs.map(l => l.subject)));
  const grades = Array.from(new Set(allLogs.map(l => `Grade ${l.grade}`))).sort();

  // 2. Apply Filters for Statistics
  let filteredLogs = allLogs.filter(l => filterByTimeRange(l.createdAt, timeRange));

  if (gradeFilter && gradeFilter !== 'All') {
    filteredLogs = filteredLogs.filter(l => l.grade === gradeFilter);
  }
  if (subjectFilter && subjectFilter !== 'All') {
    filteredLogs = filteredLogs.filter(l => l.subject === subjectFilter);
  }

  const lessons = filteredLogs.filter(l => l.activityType === 'Lesson Plan').length;
  const quizzes = filteredLogs.filter(l => l.activityType === 'Quiz').length;
  const assessments = filteredLogs.filter(l => l.activityType === 'Question Paper').length;

  // Dynamic "Low Engagement" Logic
  // If total activity is less than 3 in the selected period, show the note.
  const totalActivity = lessons + quizzes + assessments;
  const isLowEngagement = totalActivity < 3;

  const rangeLabel = timeRange === 'week' ? 'This week' : timeRange === 'month' ? 'This month' : 'This year';

  const stats: Metric[] = [
    { id: 't1', label: 'Lessons\nCreated', value: lessons, sublabel: rangeLabel, iconType: 'file-text', color: 'rose' },
    { id: 't2', label: 'Quizzes\nConducted', value: quizzes, sublabel: rangeLabel, iconType: 'book', color: 'green' },
    { id: 't3', label: 'Assessments\nAssigned', value: assessments, sublabel: rangeLabel, iconType: 'check-circle', color: 'yellow' },
  ];

  if (isLowEngagement) {
    stats.push({ 
      id: 't4', 
      label: 'Low Engagement Note', 
      value: '', 
      sublabel: `Only ${totalActivity} activities logged ${rangeLabel}. Consider reviewing teaching methods.`, 
      iconType: 'alert-triangle', 
      color: 'rose', 
      isNote: true 
    });
  } else {
    stats.push({
      id: 't4',
      label: 'Performance\nStatus',
      value: 'Good',
      sublabel: 'Consistent activity',
      iconType: 'award',
      color: 'blue'
    });
  }

  return {
    id: teacherId,
    name,
    subjects,
    grades,
    stats
  };
};

export const getClassBreakdown = (
  teacherId: string,
  timeRange: 'week' | 'month' | 'year' = 'week',
  gradeFilter?: string,
  subjectFilter?: string
): ActivityData[] => {
  let logs = rawActivityLog.filter(l => l.teacherId === teacherId && filterByTimeRange(l.createdAt, timeRange));

  if (gradeFilter && gradeFilter !== 'All') {
    logs = logs.filter(l => l.grade === gradeFilter);
  }
  if (subjectFilter && subjectFilter !== 'All') {
    logs = logs.filter(l => l.subject === subjectFilter);
  }

  const gradeCounts: Record<string, number> = {};
  
  logs.forEach(l => {
    const key = `Class ${l.grade}`; 
    gradeCounts[key] = (gradeCounts[key] || 0) + 1;
  });

  return Object.keys(gradeCounts).sort().map(grade => ({
    name: grade,
    value: gradeCounts[grade]
  }));
};

export const getTeacherRecentActivity = (
  teacherId: string,
  timeRange: 'week' | 'month' | 'year' = 'week',
  gradeFilter?: string,
  subjectFilter?: string
): RecentActivityItem[] => {
  let logs = rawActivityLog.filter(l => l.teacherId === teacherId && filterByTimeRange(l.createdAt, timeRange));

  if (gradeFilter && gradeFilter !== 'All') {
    logs = logs.filter(l => l.grade === gradeFilter);
  }
  if (subjectFilter && subjectFilter !== 'All') {
    logs = logs.filter(l => l.subject === subjectFilter);
  }

  const sortedLogs = logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return sortedLogs.slice(0, 5).map((log, index) => ({
    id: `act-${index}`,
    title: log.activityType,
    subtitle: `${log.subject} • Grade ${log.grade} • ${new Date(log.createdAt).toLocaleDateString()}`,
    icon: 'file-text'
  }));
};

// --- Export Helper ---
export const generateCSV = (teacherId: string) => {
  const logs = rawActivityLog.filter(l => l.teacherId === teacherId);
  const headers = ['Date', 'Teacher', 'Grade', 'Subject', 'Activity Type'];
  const rows = logs.map(l => [
    l.createdAt,
    l.teacherName,
    l.grade,
    l.subject,
    l.activityType
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  return csvContent;
};
