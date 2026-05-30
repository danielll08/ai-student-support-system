import { useState } from 'react';
import type { ReactNode } from 'react';
// ĐÂY LÀ DÒNG BỊ THIẾU GÂY LỖI TRẮNG MÀN HÌNH:
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext'; 

// Layout
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';

// Auth Pages 
import Login from '@/Pages/Auth/Login';
import SignUp from '@/Pages/Auth/SignUp';
import ForgotPassword from '@/Pages/Auth/ForgotPassword';

// Dashboard Pages
import { Dashboard } from '@/Pages/Dashboard';
import { TaskList } from '@/Pages/TaskList';
import { KanbanBoard } from '@/Pages/KanbanBoard';
import { Schedule } from '@/Pages/Schedule';
import { Pomodoro } from '@/Pages/Pomodoro';
import { AIAssistant } from '@/Pages/AIAssistant';
import { StudyGroups } from '@/Pages/StudyGroups';
import type { Page } from '@/types';

const pageMap: Record<Page, ReactNode> = {
  dashboard: <Dashboard />,
  tasks: <TaskList />,
  kanban: <KanbanBoard />,
  schedule: <Schedule />,
  pomodoro: <Pomodoro />,
  ai: <AIAssistant />,
  groups: <StudyGroups />,
};

// Component chứa logic giao diện chính (Yêu cầu đăng nhập)
function MainLayout() {
  const { isAuthenticated } = useAuth();
  
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  
  // Cổng bảo vệ: Nếu chưa đăng nhập, tự động đá về trang /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="flex min-h-screen">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
        />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-4">
            {pageMap[currentPage]}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

// Component Gốc: Bọc hệ thống Router và các Context (Theme + Auth)
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Các Route tự do không cần đăng nhập */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Mọi đường dẫn khác đều trỏ vào MainLayout */}
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}