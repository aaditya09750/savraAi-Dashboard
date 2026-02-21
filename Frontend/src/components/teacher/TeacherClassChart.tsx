import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';
import { ActivityData } from '../../types';

export const TeacherClassChart: React.FC<{ data: ActivityData[] }> = ({ data }) => {
  return (
    <Card className="h-full p-6 shadow-sm border border-gray-100 rounded-2xl">
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900">Class-wise Breakdown</h3>
        <p className="text-xs text-gray-500 mt-1">Activity distribution by grade</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Poppins' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'Poppins' }} 
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: '#F8FAFC' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontFamily: 'Poppins' }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8B5CF6' : '#A78BFA'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
