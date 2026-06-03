import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; 

// Layout
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Auth Pages 
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import ForgotPassword from './Pages/Auth/ForgotPassword';

// Dashboard Pages
import { Dashboard } from './Pages/Dashboard';
import { TaskList } from './Pages/TaskList';
import { KanbanBoard } from './Pages/KanbanBoard';
import { Schedule } from './Pages/Schedule';
import { Pomodoro } from './Pages/Pomodoro';
import { StudyGroups } from './Pages/StudyGroups';
import { Profile } from './Pages/Profile'; // <-- BỔ SUNG: Import trang Profile

import type { Page } from './types';

// ĐỔI LẠI THÀNH Record<string, ReactNode> để không bị lỗi nếu quên thêm vào file types.ts
const pageMap: Record<string, ReactNode> = {
  dashboard: <Dashboard />,
  tasks: <TaskList />,
  kanban: <KanbanBoard />,
  schedule: <Schedule />,
  pomodoro: <Pomodoro />,
  ai: <div className="p-4 text-center">Trợ lý AI đã được gỡ bỏ</div>, 
  groups: <StudyGroups />,
  profile: <Profile />, // <-- BỔ SUNG: Khai báo giao diện Profile
};

// Component chứa logic giao diện chính
function MainLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  // Đổi thành useState<string> thay vì <Page> để dễ dàng thêm trang mới
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const path = location.pathname.replace('/dashboard/', '').replace('/', '');
    if (path === '' || path === 'dashboard') setCurrentPage('dashboard');
    else if (path === 'tasks') setCurrentPage('tasks');
    else if (path === 'kanban') setCurrentPage('kanban');
    else if (path === 'schedule') setCurrentPage('schedule');
    else if (path === 'pomodoro') setCurrentPage('pomodoro');
    else if (path === 'ai-assistant') setCurrentPage('ai');
    else if (path === 'study-groups') setCurrentPage('groups');
    else if (path === 'profile') setCurrentPage('profile'); // <-- BỔ SUNG: Bắt đường dẫn /dashboard/profile
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white transition-colors duration-300 relative">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex h-screen flex-1 flex-col min-w-0">
          <Header />
          
          {/* Tràn viền cho trang Chat */}
          <main className={`flex-1 relative ${currentPage === 'groups' ? 'overflow-hidden' : 'p-4 overflow-auto'}`}>
            {pageMap[currentPage]}
          </main>
          
          {/* Ẩn Footer khi ở trang Chat */}
          {currentPage !== 'groups' && <Footer />}
        </div>
      </div>
    </div>
  );
}

// Component Gốc
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/dashboard" element={<MainLayout />} />
            <Route path="/dashboard/tasks" element={<MainLayout />} />
            <Route path="/dashboard/kanban" element={<MainLayout />} />
            <Route path="/dashboard/schedule" element={<MainLayout />} />
            <Route path="/dashboard/pomodoro" element={<MainLayout />} />
            <Route path="/dashboard/study-groups" element={<MainLayout />} />
            <Route path="/dashboard/profile" element={<MainLayout />} /> {/* <-- BỔ SUNG: Khai báo Route */}

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}