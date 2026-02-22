import React from 'react';
import { Card } from '../ui/Card';
import { MetricColor, PulseItem } from '../../types';
import { clsx } from 'clsx';
import { Icons } from '../ui/Icon';

const colorMap: Record<MetricColor, string> = {
  purple: 'bg-[#F3E8FF]',
  green: 'bg-[#DCFCE7]',
  yellow: 'bg-[#FEF9C3]',
  rose: 'bg-[#FFE4E6]',
  orange: 'bg-[#FFEDD5]',
  blue: 'bg-[#DBEAFE]',
};

export const PulseSummary: React.FC<{ items: PulseItem[]; summary?: string }> = ({ items, summary }) => {
  return (
    <Card className="h-full p-6 shadow-sm border border-gray-100 rounded-2xl">
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900">AI Pulse Summary</h3>
        <p className="text-xs text-gray-500 mt-1">
          {summary && summary.trim().length > 0 ? summary : 'Real time insights from your data'}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
           const Icon = item.category === 'workload' ? Icons.Award : 
                        item.category === 'enrollment' ? Icons.Users : Icons.AlertTriangle;
           
           return (
            <div key={item.id} className={clsx("p-4 rounded-xl flex items-start gap-3", colorMap[item.color])}>
              <div className="mt-0.5 text-gray-600">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-800 leading-relaxed">
                  <span className="font-semibold">{item.title}</span> {item.description}
                </p>
              </div>
            </div>
           );
        })}
      </div>
    </Card>
  );
};
