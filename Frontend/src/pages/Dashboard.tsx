import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { MetricCard } from '../components/dashboard/MetricCard';
import { WeeklyActivityChart } from '../components/dashboard/WeeklyActivityChart';
import { PulseSummary } from '../components/dashboard/PulseSummary';
import { useDashboardData } from '../hooks/useDashboardData';
import { Button } from '../components/ui/Button';
import { clsx } from 'clsx';

export const Dashboard: React.FC = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  
  // Local State for Filters
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { metrics, weeklyData, pulseData } = useDashboardData(timeRange, selectedGrade, selectedSubject, searchQuery);

  return (
    <div className="animate-fade-in">
      <Header 
        title="Admin Companion" 
        subtitle="See What's Happening Across your School" 
        onMenuClick={onMenuClick}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        onSearch={setSearchQuery}
      />

      {/* Insights Section */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-900">Insights</h2>
          
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {metrics.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 min-h-[350px]">
          <WeeklyActivityChart data={weeklyData} />
        </div>
        <div className="xl:col-span-1">
          <PulseSummary items={pulseData} />
        </div>
      </div>
    </div>
  );
};
