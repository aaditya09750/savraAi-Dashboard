import React from 'react';
import { Icons } from '../ui/Icon';
import { Metric } from '../../types';
import { clsx } from 'clsx';

const colorMap = {
  purple: 'bg-pastel-purple',
  green: 'bg-pastel-green',
  rose: 'bg-pastel-rose',
  yellow: 'bg-pastel-yellow',
  orange: 'bg-pastel-orange',
  blue: 'bg-pastel-blue',
};

export const MetricCard: React.FC<{ metric: Metric; isTeacherView?: boolean }> = ({ metric }) => {
  const Icon = Icons[metric.iconType === 'users' ? 'Users' : 
                     metric.iconType === 'book' ? 'Book' : 
                     metric.iconType === 'award' ? 'Award' : 
                     metric.iconType === 'alert-triangle' ? 'AlertTriangle' : 
                     metric.iconType === 'activity' ? 'Users' : // Fallback
                     metric.iconType === 'clock' ? 'Users' : // Fallback
                     metric.iconType === 'star' ? 'Users' : // Fallback
                     'FileText'];

  // Handle text-based cards (like "Low Engagement Note")
  if (metric.isNote || metric.label === 'Low Engagement Note') {
    return (
      <div className={clsx("rounded-xl p-5 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-default", colorMap[metric.color])}>
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold text-gray-800">{metric.label}</p>
          <Icon size={18} className="text-gray-400" />
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-600 leading-relaxed">{metric.sublabel}</p>
        </div>
      </div>
    );
  }

  // Standard Numeric Card
  return (
    <div className={clsx("rounded-xl p-5 h-full flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-md cursor-default", colorMap[metric.color])}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-semibold text-gray-700 whitespace-pre-line leading-tight">{metric.label}</p>
        <Icon size={18} className="text-gray-400" />
      </div>
      
      <div className="mt-4">
        <h3 className="text-3xl font-semibold text-gray-900">{metric.value}</h3>
        {metric.sublabel && (
          <p className="text-xs text-gray-500 mt-1">{metric.sublabel}</p>
        )}
      </div>
    </div>
  );
};
