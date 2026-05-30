import type { ComponentType } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard, CheckSquare, KanbanSquare, Calendar,
  Timer, Bot, Users, ChevronLeft, ChevronRight, BookOpen
} from 'lucide-react';
import type { Page } from '@/types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const menuItems: { id: Page; icon: ComponentType<{ className?: string }>; label: string; color?: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'tasks', icon: CheckSquare, label: 'Công việc' },
  { id: 'kanban', icon: KanbanSquare, label: 'Kanban Board' },
  { id: 'schedule', icon: Calendar, label: 'Lịch học', color: 'text-red-400' },
  { id: 'pomodoro', icon: Timer, label: 'Pomodoro', color: 'text-purple-400' },
  { id: 'ai', icon: Bot, label: 'AI Assistant', color: 'text-blue-400' },
  { id: 'groups', icon: Users, label: 'Nhóm học tập', color: 'text-pink-400' },
];

export function Sidebar({ currentPage, setCurrentPage, collapsed, setCollapsed }: SidebarProps) {
  return (
    <motion.aside
      className="bg-white border-r border-slate-200 dark:bg-[#161b27] dark:border-[#252d3d] flex flex-col flex-shrink-0 relative z-10"
      animate={{ width: collapsed ? 70 : 200 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ minWidth: collapsed ? 70 : 200 }}
    >
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-slate-200 dark:border-[#252d3d]">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="text-sm font-bold text-slate-950 dark:text-white leading-tight whitespace-nowrap">StudyAI</div>
            <div className="text-[10px] text-slate-500 dark:text-gray-400 leading-tight whitespace-nowrap">Hệ thống học tập thông minh</div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-hidden">
        {!collapsed && (
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2 mb-2 font-medium">Menu chính</div>
        )}
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-150 text-left group relative ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-gray-400 dark:hover:bg-[#1e2534] dark:hover:text-gray-200'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : (item.color || 'text-slate-500 group-hover:text-slate-700 dark:text-gray-400 dark:group-hover:text-gray-300')}`} />
                {!collapsed && (
                  <span className="text-xs font-medium truncate whitespace-nowrap">{item.label}</span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-950 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl border border-slate-700 z-50 dark:bg-[#1e2534] dark:border-[#2a3444]">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-2 border-t border-[#252d3d] pt-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-2.5 text-slate-700 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 text-xs px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1e2534] transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Thu gọn sidebar</span>
            </>
          )}
        </button>
      </div>

      {/* User profile */}
      <div className="px-2 pb-3 border-t border-[#252d3d] pt-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white shadow-md">
            VA
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-950 dark:text-white truncate">Nguyễn Văn An</div>
              <div className="text-[10px] text-orange-500 dark:text-orange-400 whitespace-nowrap">🔥 7 ngày streak</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
