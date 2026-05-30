import { useState } from 'react';
import { Search, Sun, Moon, Bell } from 'lucide-react';
import { mockNotifications } from '@/data/mockData';
import type { Notification } from '@/types';

// Dùng Hook để lấy Theme và Auth trực tiếp, không cần nhận từ Props nữa
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Đưa các State của Header vào bên trong chính nó thay vì đẩy ra App.tsx
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const displayName = user?.name || user?.fullName || 'Người dùng';
  const email = user?.email ?? 'admin@student.edu.vn';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Xử lý đóng/mở menu
  const toggleNotifications = () => {
    setNotificationsOpen((prev) => !prev);
    setProfileOpen(false); // Đóng Profile nếu đang mở
  };

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    setNotificationsOpen(false); // Đóng Notifications nếu đang mở
  };

  const markAllNotificationsRead = () => 
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  
  const markNotificationRead = (id: string) => 
    setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, isRead: true } : item));

  return (
    <header className="relative h-14 bg-white/90 text-slate-950 dark:bg-slate-950/90 dark:text-white backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between px-5 flex-shrink-0 transition-colors duration-300">
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
        {/* Nút Đổi Theme (Sáng/Tối) */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center transition-all border border-slate-200 dark:border-slate-700"
          title="Chuyển sáng/tối"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-slate-600" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        </button>

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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Mới nhất</p>
                </div>
                <button onClick={markAllNotificationsRead} className="text-[11px] text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Đánh dấu đã đọc
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500 dark:text-slate-400">Không có thông báo.</div>
                ) : (
                  notifications.map((notice) => (
                    <button
                      key={notice.id}
                      onClick={() => markNotificationRead(notice.id)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{notice.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notice.message}</p>
                        </div>
                        {!notice.isRead && <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                        {new Date(notice.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
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
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 transition-all"
            title="Hồ sơ"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
              {/* ĐÃ FIX: Thêm (n: string) */}
              {displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{displayName}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{email}</div>
            </div>
          </button>

          {/* Popup Hồ Sơ */}
          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-black/10 dark:border-[#2b3343] dark:bg-[#11171f]">
              <div className="px-4 py-4 border-b border-slate-200 dark:border-[#252d3d]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                    {/* ĐÃ FIX: Thêm (n: string) */}
                    {displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{displayName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 px-4 py-4 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Vai trò</p>
                  <p className="mt-1">{user?.role || 'Sinh viên'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 pb-4">
                <button className="flex-1 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                  Xem hồ sơ
                </button>
                <button
                  onClick={logout}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
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