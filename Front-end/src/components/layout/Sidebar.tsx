'use client';

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  CalendarDays,
  Bot,
  Users,
  BookOpen,
  Settings,
  Bell,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
  color?: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={17} />, label: "Dashboard", path: "/dashboard", color: "#6366F1" },
  { icon: <Kanban size={17} />, label: "Công việc", path: "/dashboard/tasks", color: "#8B5CF6" },
  { icon: <Kanban size={17} />, label: "Kanban Board", path: "/dashboard/kanban", color: "#0EA5E9" },
  { icon: <CalendarDays size={17} />, label: "Lịch học", path: "/dashboard/schedule", color: "#10B981" },
  { icon: <Bot size={17} />, label: "AI Assistant", path: "/dashboard/ai-assistant", color: "#8B5CF6" },
  { icon: <Users size={17} />, label: "Nhóm học tập", path: "/dashboard/study-groups", color: "#EC4899" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };
  return (
    <aside className="w-60 shrink-0 flex flex-col h-screen sticky top-0 bg-white dark:bg-[#161b27] transition-colors duration-300" style={{ borderRight: "1px solid #E8EAF0", boxShadow: "2px 0 12px rgba(0,0,0,0.04)" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200 dark:border-[#252d3d]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
            <BookOpen size={16} className="text-white" />
          </div>
          <div>
            <span className="text-slate-900 dark:text-white transition-colors" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>StudyAI</span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-500 dark:text-emerald-400 transition-colors" style={{ fontSize: "10px", fontWeight: 500 }}>Đang hoạt động</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-1 mb-1 dark:text-slate-400 transition-colors" style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Menu chính
        </p>

        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/dashboard' && location.pathname === '/dashboard');
          
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left relative group ${
                isActive 
                  ? "text-indigo-700 dark:text-indigo-400" 
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#1e2534]"
              }`}
              style={isActive ? {
                background: "linear-gradient(135deg, #EEF2FF, #F5F3FF)",
                boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.15)"
              } : {}}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 w-1 h-5 rounded-r-full bg-indigo-600 dark:bg-indigo-500" style={{ transform: "translateY(-50%)" }} />
              )}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                style={isActive
                  ? { background: item.color, color: "#fff", boxShadow: `0 4px 10px ${item.color}50` }
                  : { background: "#F8FAFC", color: "#94A3B8" }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: "13.5px", fontWeight: isActive ? 600 : 400 }}>
                {item.label}
              </span>
              {item.badge && (
                <span
                  className="ml-auto text-white rounded-full px-2 py-0.5 shrink-0"
                  style={{ fontSize: "10px", fontWeight: 700, background: item.color ?? "#6366F1" }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 mt-3 border-t border-slate-200 dark:border-[#252d3d]">
          <p className="px-3 py-1 mb-1 dark:text-slate-400 transition-colors" style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Hệ thống
          </p>
          {[
            { icon: <Bell size={17} />, label: "Thông báo" },
            { icon: <Settings size={17} />, label: "Cài đặt" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-[#1e2534] hover:text-slate-800 dark:hover:text-gray-200 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-[#0d1117] flex items-center justify-center shrink-0 text-slate-400 dark:text-gray-600">
                {item.icon}
              </div>
              <span style={{ fontSize: "13.5px" }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User profile */}
      <div className="p-3 border-t border-slate-200 dark:border-[#252d3d]">
        <button
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1e2534] transition-all text-left"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 4px 10px rgba(99,102,241,0.3)" }}
          >
            <span className="text-white" style={{ fontSize: "13px", fontWeight: 700 }}>N</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 dark:text-white transition-colors" style={{ fontSize: "13px", fontWeight: 600 }}>Nguyễn Văn An</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
