import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { TeacherList } from './pages/TeacherList';
import { TeacherView } from './pages/TeacherView';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<TeacherList />} />
          <Route path="teachers/:teacherId" element={<TeacherView />} />
          {/* 404 Page for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
