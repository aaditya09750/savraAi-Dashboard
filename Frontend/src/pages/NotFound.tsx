import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icon';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen min-w-full bg-white animate-fade-in z-50 overflow-hidden">
      <div className="bg-white p-8 sm:p-12 rounded-[25px] shadow-card text-center max-w-lg w-full border border-gray-100">
        <div className="w-24 h-24 bg-pastel-rose rounded-full flex items-center justify-center mx-auto mb-8 text-rose-400 transform rotate-3">
          <Icons.AlertTriangle size={48} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-10 leading-relaxed text-sm sm:text-base">
          Oops! The page you are looking for seems to have wandered off. It might have been removed or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 min-w-[140px]">
            <Icons.ChevronLeft size={18} />
            <span>Go Back</span>
          </Button>
          <Button variant="primary" onClick={() => navigate('/')} className="gap-2 min-w-[140px]">
            <Icons.LayoutGrid size={18} />
            <span>Dashboard</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
