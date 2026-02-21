import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { ActivityData } from '../../types';

export const WeeklyActivityChart: React.FC<{ data: ActivityData[] }> = ({ data }) => {
  return (
    <Card className="h-full p-6 shadow-sm border border-gray-100 rounded-2xl">
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900">Weekly Activity</h3>
        <p className="text-xs text-gray-500 mt-1">Content creation trends</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F87171" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Poppins' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Poppins' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontFamily: 'Poppins' }}
              cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4ADE80" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
            <Area 
              type="monotone" 
              dataKey="secondaryValue" 
              stroke="#F87171" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSec)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
