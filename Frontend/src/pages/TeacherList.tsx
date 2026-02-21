import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { getAllTeachers } from '../utils/analytics';
import { Icons } from '../components/ui/Icon';
import { clsx } from 'clsx';

export const TeacherList: React.FC = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const navigate = useNavigate();
  const teachers = getAllTeachers();
  const [search, setSearch] = React.useState('');

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <Header 
        title="Teachers" 
        subtitle="Manage and view teacher performance" 
        onMenuClick={onMenuClick}
        onSearch={setSearch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher, index) => (
          <Card 
            key={teacher.id} 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-purple-100 active:scale-[0.99]"
            onClick={() => navigate(`/teachers/${teacher.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
                index % 3 === 0 ? "bg-pastel-purple text-purple-600" :
                index % 3 === 1 ? "bg-pastel-blue text-blue-600" : "bg-pastel-rose text-rose-600"
              )}>
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="p-2 bg-gray-50 rounded-full group-hover:bg-purple-50 transition-colors duration-300">
                <Icons.ChevronLeft size={16} className="rotate-180 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{teacher.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{teacher.subject}</p>
            
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 w-fit px-3 py-1.5 rounded-lg">
              <Icons.School size={14} />
              <span>Grade {teacher.grade}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
