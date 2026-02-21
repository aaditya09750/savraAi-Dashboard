import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '../ui/Icon';
import { clsx } from 'clsx';
import { NAVIGATION_ITEMS, APP_CONFIG } from '../../config/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear auth tokens here
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={clsx(
        "fixed left-0 top-0 h-full w-64 bg-brand-purple rounded-r-[32px] flex flex-col py-8 px-6 z-50 transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#9F85F3] tracking-wide font-sans">{APP_CONFIG.APP_NAME}</h1>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors">
            <Icons.ChevronLeft size={24} />
          </button>
        </div>

        {/* Main Label */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">MAIN</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-white text-black font-medium" 
                    : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
                )}
              >
                <item.icon size={20} strokeWidth={1.5} className={clsx("transition-colors duration-300", isActive ? "text-black" : "text-gray-500 group-hover:text-gray-700")} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions Area */}
        <div className="mt-auto pt-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 group mb-4 active:scale-[0.98]"
          >
            <Icons.LogOut size={20} strokeWidth={1.5} className="text-gray-500 group-hover:text-rose-500 transition-colors duration-300" />
            <span className="text-sm font-medium">Logout</span>
          </button>

          {/* User Profile */}
          <div className="border-t border-purple-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-black border-2 border-white shadow-sm shrink-0">
              {APP_CONFIG.USER_INITIALS}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">{APP_CONFIG.USER_ROLE}</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{APP_CONFIG.USER_NAME}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
