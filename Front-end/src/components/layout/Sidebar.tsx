'use client';

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Kanban, CalendarDays, BookOpen, 
  Settings, Bell, Timer, ListTodo, Plus, Hash, X
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  colorClass: string;
  bgClass: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", colorClass: "text-indigo-600 dark:text-indigo-400", bgClass: "bg-indigo-50 dark:bg-indigo-500/10" },
  { icon: ListTodo, label: "Công việc", path: "/dashboard/tasks", colorClass: "text-violet-600 dark:text-violet-400", bgClass: "bg-violet-50 dark:bg-violet-500/10" },
  { icon: Kanban, label: "Kanban Board", path: "/dashboard/kanban", colorClass: "text-sky-600 dark:text-sky-400", bgClass: "bg-sky-50 dark:bg-sky-500/10" },
  { icon: CalendarDays, label: "Lịch học", path: "/dashboard/schedule", colorClass: "text-emerald-600 dark:text-emerald-400", bgClass: "bg-emerald-50 dark:bg-emerald-500/10" },
  { icon: Timer, label: "Pomodoro", path: "/dashboard/pomodoro", colorClass: "text-orange-600 dark:text-orange-400", bgClass: "bg-orange-50 dark:bg-orange-500/10" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleNavClick = (path: string) => navigate(path);
  
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    alert(`Đã tạo nhóm: ${newGroupName} (Logic API sẽ gắn ở đây)`);
    setShowCreateGroup(false);
    setNewGroupName('');
  };
  
  return (
    <>
      <aside className="w-[260px] shrink-0 flex flex-col h-screen sticky top-0 bg-white dark:bg-[#0b1120] border-r border-slate-200 dark:border-white/10 transition-colors duration-300 z-30">
        
        {/* BRAND LOGO */}
        <div className="h-16 px-6 flex items-center shrink-0 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('/dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <BookOpen size={18} className="text-white" />
            </div>
            <h1 className="text-[16px] font-bold text-slate-900 dark:text-white tracking-tight">StudyAI</h1>
          </div>
        </div>

        {/* NAVIGATION LIST */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-800">
          
          <div className="px-3 mb-2">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Menu chính</p>
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard');
            const Icon = item.icon;
            
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-left relative group ${isActive ? `${item.bgClass} ${item.colorClass}` : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"}`}
              >
                {isActive && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full ${item.colorClass.split(' ')[0].replace('text', 'bg')} dark:${item.colorClass.split(' ')[1].replace('text', 'bg')}`} />}
                <Icon size={18} className={`transition-colors ${isActive ? "" : `text-slate-400 dark:text-slate-500 group-hover:${item.colorClass.split(' ')[0]} dark:group-hover:${item.colorClass.split(' ')[1]}`}`} />
                <span className={`text-[13px] transition-colors ${isActive ? "font-semibold" : "font-medium group-hover:text-slate-900 dark:group-hover:text-slate-200"}`}>{item.label}</span>
              </button>
            );
          })}

          {/* SECTION: NHÓM & BẠN BÈ */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/5">
            <div className="px-3 mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nhóm & Bạn bè</p>
              <button onClick={() => setShowCreateGroup(true)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Tạo nhóm mới">
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>
            
            <button onClick={() => handleNavClick('/dashboard/study-groups')} className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all text-left group ${location.pathname === '/dashboard/study-groups' ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
              <Hash size={15} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[13px] font-medium truncate">Đồ án AI</span>
            </button>
          </div>
        </nav>

        {/* USER PROFILE */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-transparent shrink-0">
          <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-left border border-transparent group">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white text-[13px] font-bold">NA</span>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0b1120]"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">Nguyễn Văn An</p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Học viên Pro</p>
            </div>
            <Settings size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0 transition-transform group-hover:rotate-45" />
          </button>
        </div>
      </aside>

      {/* MODAL TẠO NHÓM MỚI */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#151b28] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Tạo nhóm mới</h3>
              <button onClick={() => setShowCreateGroup(false)} className="text-slate-400 hover:text-rose-500"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Tên nhóm</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
                  placeholder="Ví dụ: Nhóm học tiếng Anh" 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 rounded-md text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 dark:bg-[#1a2130] border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button onClick={() => setShowCreateGroup(false)} className="px-4 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors">Hủy</button>
              <button onClick={handleCreateGroup} disabled={!newGroupName.trim()} className="px-4 py-2 text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 rounded-md transition-colors">Tạo ngay</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}