import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 transition-all duration-300 w-full min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* We pass the menu handler down via Outlet context or props if we were rendering directly. 
              Since Outlet renders child pages which contain the Header, we need a way to pass this.
              Alternatively, we can lift Header here? 
              The design shows Header is part of the page content (different titles).
              Let's use a context or simple prop passing if possible. 
              For simplicity in this setup, I'll export a context or just pass it to Outlet context.
          */}
          <Outlet context={{ onMenuClick: () => setIsSidebarOpen(true) }} />
        </div>
      </main>
    </div>
  );
};
