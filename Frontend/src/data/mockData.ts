import { Metric, ActivityData, PulseItem, Teacher, RecentActivityItem } from '../types';

export const dashboardMetrics: Metric[] = [
  { id: '1', label: 'Total Students', value: '1,240', sublabel: '+12% This week', iconType: 'users', color: 'purple' },
  { id: '2', label: 'Avg. Attendance', value: '94%', sublabel: '+2% This week', iconType: 'activity', color: 'green' },
  { id: '3', label: 'Learning Hours', value: '8.5h', sublabel: 'Avg per student', iconType: 'clock', color: 'blue' },
  { id: '4', label: 'Active Courses', value: '42', sublabel: 'Across 8 grades', iconType: 'book', color: 'yellow' },
  { id: '5', label: 'Teacher Rating', value: '4.8', sublabel: 'Based on feedback', iconType: 'star', color: 'rose' },
];

export const weeklyActivityData: ActivityData[] = [
  { name: 'Mon', value: 400, secondaryValue: 240 },
  { name: 'Tue', value: 300, secondaryValue: 139 },
  { name: 'Wed', value: 550, secondaryValue: 380 },
  { name: 'Thu', value: 450, secondaryValue: 290 },
  { name: 'Fri', value: 600, secondaryValue: 430 },
  { name: 'Sat', value: 350, secondaryValue: 220 },
  { name: 'Sun', value: 200, secondaryValue: 100 },
];

export const pulseSummary: PulseItem[] = [
  { id: '1', title: 'Grade 10 Math Quiz Completion', time: '2 hrs ago', category: 'Academic', color: 'blue' },
  { id: '2', title: 'New Science Curriculum Uploaded', time: '4 hrs ago', category: 'Content', color: 'green' },
  { id: '3', title: 'Parent Meeting Scheduled', time: '5 hrs ago', category: 'Admin', color: 'purple' },
  { id: '4', title: 'System Maintenance Alert', time: '1 day ago', category: 'System', color: 'orange' },
  { id: '5', title: 'Library Books Overdue Report', time: '1 day ago', category: 'Admin', color: 'rose' },
];

export const teacherData: Teacher = {
  id: 't1',
  name: 'Sarah Wilson',
  role: 'Senior Mathematics Teacher',
  subject: 'Grade 10 & 11 • Mathematics',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  stats: [
    { id: 't1', label: 'Total Classes', value: '24', sublabel: 'This week', iconType: 'book', color: 'purple' },
    { id: 't2', label: 'Students', value: '145', sublabel: 'Active', iconType: 'users', color: 'blue' },
    { id: 't3', label: 'Avg Score', value: '88%', sublabel: '+5% vs last term', iconType: 'activity', color: 'green' },
    { id: 't4', label: 'Assignments', value: '12', sublabel: 'Pending review', iconType: 'clock', color: 'orange' },
  ]
};

export const classBreakdownData: ActivityData[] = [
  { name: '10-A', value: 85 },
  { name: '10-B', value: 78 },
  { name: '11-A', value: 92 },
  { name: '11-B', value: 88 },
  { name: '12-A', value: 76 },
];

export const recentActivity: RecentActivityItem[] = [
  { id: '1', user: 'James Anderson', action: 'submitted', target: 'Algebra Homework', time: '10 min ago', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: '2', user: 'Emily Chen', action: 'commented on', target: 'Geometry Quiz', time: '45 min ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  { id: '3', user: 'Michael Scott', action: 'viewed', target: 'Course Syllabus', time: '2 hrs ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];
