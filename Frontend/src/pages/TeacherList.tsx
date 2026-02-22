import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/ui/Icon';
import { clsx } from 'clsx';
import type { TeacherDirectoryItem } from '../types';
import { teacherApi } from '../services/teacherApi';
import { extractErrorMessage } from '../services/apiClient';

export const TeacherList: React.FC = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [teachers, setTeachers] = React.useState<TeacherDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    let mounted = true;
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');

      try {
        const result = await teacherApi.list({
          search,
          page: 1,
          limit: 100,
        });

        if (!mounted) {
          return;
        }

        setTeachers(result);
      } catch (fetchError) {
        if (!mounted) {
          return;
        }

        setError(extractErrorMessage(fetchError));
        setTeachers([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  return (
    <div className="animate-fade-in">
      <Header 
        title="Teachers" 
        subtitle="Manage and view teacher performance" 
        onMenuClick={onMenuClick}
        onSearch={setSearch}
      />

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg border border-rose-100 bg-rose-50 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teachers.map((teacher, index) => (
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
        {isLoading && teachers.length === 0 && (
          <div className="col-span-full flex items-center justify-center min-h-[220px] bg-white rounded-xl border border-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};
