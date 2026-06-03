import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // BỔ SUNG: Import useNavigate
import { mockNotifications } from '@/data/mockData';
import type { Notification } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const navigate = useNavigate(); // BỔ SUNG: Khai báo navigate
  const { user, logout } = useAuth();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const displayName = user?.name || user?.fullName || 'Người dùng';
  const email = user?.email ?? 'admin@student.edu.vn';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleNotifications = () => {
    setNotificationsOpen((prev) => !prev);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    setNotificationsOpen(false);
  };

  const markAllNotificationsRead = () => 
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  
  const markNotificationRead = (id: string) => 
    setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, isRead: true } : item));

  return (
    <header className="sticky top-0 z-50 h-14 bg-white/90 text-slate-950 dark:bg-slate-950/90 dark:text-white backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between px-5 flex-shrink-0 transition-colors duration-300">
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc, lịch học... (Ctrl+K)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-600 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        {/* Nút Thông Báo */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center transition-all border border-slate-200 dark:border-slate-700"
            title="Thông báo"
          >
            <Bell className="w-3.5 h-3.5 text-slate-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Popup Thông Báo */}
          {notificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-black/10 dark:border-[#2b3343] dark:bg-[#11171f]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-[#252d3d]">
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Thông báo</p>
                </div>
                <button onClick={markAllNotificationsRead} className="text-[11px] text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Đánh dấu đã đọc
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500">Không có thông báo.</div>
                ) : (
                  notifications.map((notice) => (
                    <button key={notice.id} onClick={() => markNotificationRead(notice.id)} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{notice.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{notice.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Nút Hồ Sơ */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
              {displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{displayName}</div>
            </div>
          </button>

          {/* Popup Hồ Sơ */}
          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-[#11171f] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{email}</p>
              </div>
              <div className="p-2 flex flex-col gap-1">
                {/* BỔ SUNG: Nút Xem Hồ Sơ */}
                <button 
                  onClick={() => {
                    navigate('/dashboard/profile');
                    setProfileOpen(false); // Đóng menu sau khi click
                  }}
                  className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  Xem hồ sơ
                </button>
                <button 
                  onClick={logout} 
                  className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-500 dark:hover:bg-rose-500/10 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}