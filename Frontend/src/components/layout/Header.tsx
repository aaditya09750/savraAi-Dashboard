import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../ui/Icon';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { metadataApi } from '../../services/metadataApi';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onMenuClick: () => void;
  // Filter Props
  selectedGrade?: string;
  onGradeChange?: (grade: string) => void;
  selectedSubject?: string;
  onSubjectChange?: (subject: string) => void;
  // Search Props
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showBack, 
  onMenuClick,
  selectedGrade,
  onGradeChange,
  selectedSubject,
  onSubjectChange,
  onSearch
}) => {
  const navigate = useNavigate();
  const [showGradeMenu, setShowGradeMenu] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [grades, setGrades] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  
  const gradeRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const gradeOptions = ['All', ...grades];
  const subjectOptions = ['All', ...subjects];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gradeRef.current && !gradeRef.current.contains(event.target as Node)) {
        setShowGradeMenu(false);
      }
      if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
        setShowSubjectMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!onGradeChange || !onSubjectChange) {
      return;
    }

    let mounted = true;

    const fetchFilters = async () => {
      try {
        const options = await metadataApi.getFilters();

        if (!mounted) {
          return;
        }

        setGrades(options.classes ?? options.grades ?? []);
        setSubjects(options.subjects);
      } catch {
        if (!mounted) {
          return;
        }

        setGrades([]);
        setSubjects([]);
      }
    };

    void fetchFilters();

    return () => {
      mounted = false;
    };
  }, [onGradeChange, onSubjectChange]);

  return (
    <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8 relative z-20">
      <div className="flex items-start gap-4">
        {/* Mobile Menu Button */}
        <Button 
          variant="icon" 
          onClick={onMenuClick}
          className="lg:hidden mt-1"
          aria-label="Open menu"
        >
          <Icons.More size={24} />
        </Button>

        {showBack && (
          <button 
            onClick={() => navigate(-1)} 
            className="mt-1 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <Icons.ChevronLeft size={18} />
          </button>
        )}
        <div>
          {title && <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>}
          {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
        {/* Search */}
        <div className="relative w-full sm:w-[320px]">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Ask Savra Ai" 
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        {/* Filters */}
        {onGradeChange && onSubjectChange && (
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-visible pb-1 sm:pb-0">
            {/* Grade Dropdown */}
            <div className="relative" ref={gradeRef}>
              <Button 
                variant="primary" 
                className="whitespace-nowrap gap-2 w-full sm:w-auto justify-between"
                onClick={() => setShowGradeMenu(!showGradeMenu)}
              >
                <span>{selectedGrade === 'All' ? 'All Grades' : `Grade ${selectedGrade}`}</span>
                <Icons.ChevronDown size={16} className={showGradeMenu ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </Button>
              
              {showGradeMenu && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-floating border border-gray-100 py-2 z-50 animate-fade-in">
                  {gradeOptions.map(grade => (
                    <button
                      key={grade}
                      onClick={() => {
                        onGradeChange(grade);
                        setShowGradeMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      {grade === 'All' ? 'All Grades' : `Grade ${grade}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Subject Dropdown */}
            <div className="relative" ref={subjectRef}>
              <Button 
                variant="outline" 
                className="whitespace-nowrap gap-2 w-full sm:w-auto justify-between"
                onClick={() => setShowSubjectMenu(!showSubjectMenu)}
              >
                <span>{selectedSubject === 'All' ? 'All Subjects' : selectedSubject}</span>
                <Icons.ChevronDown size={16} className={showSubjectMenu ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </Button>

              {showSubjectMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-floating border border-gray-100 py-2 z-50 animate-fade-in">
                  {subjectOptions.map(subject => (
                    <button
                      key={subject}
                      onClick={() => {
                        onSubjectChange(subject);
                        setShowSubjectMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
