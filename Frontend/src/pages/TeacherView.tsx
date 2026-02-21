import React, { useState } from 'react';
import { useOutletContext, useParams, Navigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { MetricCard } from '../components/dashboard/MetricCard';
import { TeacherClassChart } from '../components/teacher/TeacherClassChart';
import { RecentActivityPanel } from '../components/teacher/RecentActivityPanel';
import { Icons } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { useTeacherData } from '../hooks/useTeacherData';
import { generateCSV } from '../utils/analytics';
import { clsx } from 'clsx';

export const TeacherView: React.FC = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { teacherId } = useParams<{ teacherId: string }>();
  
  // Local State for Filters
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  
  // Redirect if no ID provided
  if (!teacherId) return <Navigate to="/teachers" />;
  
  const { teacher, classData, activities, isLoading } = useTeacherData(
    teacherId, 
    timeRange,
    selectedGrade,
    selectedSubject
  );

  const handleExport = () => {
    const csvContent = generateCSV(teacherId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${teacher?.name.replace(' ', '_')}_Activity_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !teacher) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24 animate-fade-in">
      <Header 
        title={teacher.name} 
        subtitle="Performance Overview"
        showBack={true}
        onMenuClick={onMenuClick}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
      />

      {/* Teacher Info Lines & Time Toggle */}
      <div className="mb-8 space-y-3 bg-white/50 p-4 rounded-xl border border-gray-100 sm:bg-transparent sm:p-0 sm:border-0">
        <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-900 font-medium">Subject:</span>
            <span className="text-gray-600">{teacher.subjects.join(', ')}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm">
                <span className="text-gray-900 font-medium">Grade Taught:</span>
                <span className="text-gray-600 ml-1">{teacher.grades.join(', ')}</span>
            </div>
            
            <div className="flex bg-white rounded-lg border border-gray-200 p-1 self-start sm:self-auto shadow-sm">
              {(['week', 'month', 'year'] as const).map((range) => (
                <Button 
                  key={range}
                  variant={timeRange === range ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className={clsx("rounded-md capitalize", timeRange === range && "bg-purple-100 text-purple-700 font-semibold")}
                  onClick={() => setTimeRange(range)}
                >
                  This {range}
                </Button>
              ))}
            </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {teacher.stats.map(metric => (
          <MetricCard key={metric.id} metric={metric} isTeacherView={true} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 min-h-[350px]">
          <TeacherClassChart data={classData} />
        </div>
        <div className="xl:col-span-1">
          <RecentActivityPanel activities={activities} />
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 bg-[#F97316] text-white rounded-xl font-medium shadow-floating hover:bg-orange-600 transition-all text-sm active:scale-95"
        >
            <Icons.Download size={18} />
            <span>Export Report (CSV)</span>
        </button>
      </div>
    </div>
  );
};
