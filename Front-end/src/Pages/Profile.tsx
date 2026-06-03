import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Camera, Save, Key } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const displayName = user?.name || user?.fullName || 'Nguyễn Văn An';
  const email = user?.email ?? 'admin@student.edu.vn';
  const role = user?.role || 'Học viên Pro';

  const [nameInput, setNameInput] = useState(displayName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Giả lập gọi API lưu dữ liệu
    setTimeout(() => {
      setIsSaving(false);
      alert('Đã cập nhật thông tin thành công!');
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hồ sơ cá nhân</h2>
        <p className="text-sm text-slate-500 mt-1">Quản lý thông tin và bảo mật tài khoản của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* --- CỘT TRÁI: AVATAR & INFO --- */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#151b28] border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="relative group cursor-pointer mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-md">
                {displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              {/* Nút overlay đổi avatar */}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{displayName}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{email}</p>
            <div className="mt-4 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-100 dark:border-indigo-500/20">
              {role}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM CẬP NHẬT --- */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Box 1: Thông tin cơ bản */}
          <div className="bg-white dark:bg-[#151b28] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Thông tin cơ bản
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Tên hiển thị</label>
                <input 
                  type="text" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#1e2534] border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">Email không thể thay đổi do liên kết với tài khoản trường.</p>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving || nameInput === displayName}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </div>
            </div>
          </div>

          {/* Box 2: Bảo mật */}
          <div className="bg-white dark:bg-[#151b28] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" /> Đổi mật khẩu
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Mật khẩu hiện tại</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Mật khẩu mới</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1e2534] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors mt-2">
                <Key className="w-4 h-4" /> Cập nhật mật khẩu
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}   