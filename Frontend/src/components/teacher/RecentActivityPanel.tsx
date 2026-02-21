import React from 'react';
import { Card } from '../ui/Card';
import { RecentActivityItem } from '../../types';
import { Icons } from '../ui/Icon';

export const RecentActivityPanel: React.FC<{ activities: RecentActivityItem[] }> = ({ activities }) => {
  return (
    <Card className="h-full p-6 shadow-sm border border-gray-100 rounded-2xl">
      <h3 className="text-base font-bold text-gray-900 mb-6">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="bg-[#F3E8FF] rounded-xl p-4 flex items-start gap-3">
          <div className="mt-1 text-gray-400">
            <Icons.FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">No Recent Activity</p>
            <p className="text-xs text-gray-500 mt-1">No lessons or quizzes created yet</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
             <div key={activity.id} className="flex gap-3 items-start">
               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                 <Icons.FileText size={14} />
               </div>
               <div>
                 <p className="text-sm text-gray-800">{activity.title}</p>
                 <p className="text-xs text-gray-500">{activity.subtitle}</p>
               </div>
             </div>
          ))}
        </div>
      )}
    </Card>
  );
};
