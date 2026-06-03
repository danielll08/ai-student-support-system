import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, EyeOff, BookOpen, Mail, Lock, Loader2, Sparkles,
  CheckCircle2, Circle, BarChart3
} from 'lucide-react';

import { mockUser } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState('an.nguyen@student.edu.vn');
  const [password, setPassword] = useState('password123');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) { 
        setError('Vui lòng nhập đầy đủ email và mật khẩu.'); 
        return; 
    }
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200)); 
    setIsLoading(false);
    
    login({ ...mockUser, name: mockUser.fullName });
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    login({ ...mockUser, name: mockUser.fullName });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#0b1120] font-sans">
      
      {/* --- CỘT TRÁI: FORM ĐĂNG NHẬP --- */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-28 relative z-10 border-r border-slate-200 dark:border-slate-800/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">StudyAI</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Đăng nhập
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">
            Chào mừng trở lại! Tiếp tục quản lý công việc và học tập.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-2.5 text-rose-600 dark:text-rose-400">
            <span className="text-base leading-none">⚠️</span>
            <p className="text-[12px] font-medium mt-0.5">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Email học tập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                placeholder="email@student.edu.vn"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0b1120] border border-slate-300 dark:border-slate-700 rounded-lg text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-[#0b1120] border border-slate-300 dark:border-slate-700 rounded-lg text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="peer appearance-none w-4 h-4 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-[#0b1120] checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                Ghi nhớ đăng nhập
              </span>
            </label>
            
            <Link to="/forgot-password" className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-70 text-white text-[13px] font-bold rounded-lg transition-all active:scale-[0.98] shadow-md shadow-indigo-900/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Đăng nhập vào hệ thống'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoặc</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-slate-50 dark:bg-[#151b28] dark:hover:bg-white/5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[13px] font-bold rounded-lg transition-all active:scale-[0.98] shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Đăng nhập Demo
        </button>

        <p className="text-center mt-8 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="font-bold text-slate-900 dark:text-white hover:underline transition-colors">
            Đăng ký ngay
          </Link>
        </p>
      </div>

      {/* --- CỘT PHẢI: MOCKUP SAAS CHUYÊN NGHIỆP (MÀU MỚI SANG TRỌNG HƠN) --- */}
      <div className="hidden lg:flex flex-1 bg-[#020617] relative items-center justify-center overflow-hidden">
        
        {/* Lưới Grid tinh tế (Dot Pattern) sáng hơn một chút */}
        <div 
          className="absolute inset-0 opacity-[0.25]" 
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        ></div>

        {/* Cấu trúc Mô phỏng UI (Mockup) */}
        <div className="relative z-10 w-full max-w-[580px] p-8">
          
          <div className="mb-10">
            {/* Đổ bóng chữ (Gradient Text) tạo cảm giác cực kỳ Premium */}
            <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight mb-4">
              Tối ưu hóa<br/>hiệu suất học tập.
            </h2>
            <p className="text-sm text-slate-400 font-medium max-w-sm leading-relaxed">
              Quản lý dự án, theo dõi lịch trình và đo lường sự tập trung trên cùng một nền tảng tốc độ cao.
            </p>
          </div>

          {/* Cửa sổ ứng dụng giả lập */}
          <div className="w-full bg-[#0f172a] rounded-xl border border-slate-700/60 shadow-[0_0_80px_-20px_rgba(79,70,229,0.15)] overflow-hidden flex flex-col transform transition-transform hover:scale-[1.02] duration-500">
            
            {/* Thanh tiêu đề Browser/App */}
            <div className="h-10 bg-[#1e293b] border-b border-slate-700/60 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-600/50"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600/50"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600/50"></div>
            </div>

            {/* Nội dung Mockup */}
            <div className="p-6 grid grid-cols-2 gap-5 bg-[#0f172a]">
              
              {/* Cột 1: Progress & Tasks */}
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-slate-700/50 bg-[#1e293b]/50 backdrop-blur-sm">
                  <div className="flex justify-between items-end mb-5">
                    <div className="w-14 h-14 rounded-full border-[5px] border-indigo-500 border-r-slate-700 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">75%</span>
                    </div>
                    <div className="px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                      Đang On-track
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full mb-2.5"></div>
                  <div className="h-2 w-2/3 bg-slate-800 rounded-full"></div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-[#1e293b]/30">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="h-2 w-full bg-slate-700 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-[#1e293b]/30">
                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="h-2 w-5/6 bg-slate-700/50 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Cột 2: Lịch & Biểu đồ */}
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-slate-700/50 bg-[#1e293b]/50 backdrop-blur-sm h-36 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tiến độ tuần</span>
                  </div>
                  <div className="flex items-end gap-2.5 h-full pt-2">
                    <div className="w-full bg-indigo-500/30 rounded-t h-[40%]"></div>
                    <div className="w-full bg-indigo-500/50 rounded-t h-[75%]"></div>
                    <div className="w-full bg-indigo-500/80 rounded-t h-[100%] shadow-[0_0_15px_rgba(99,102,241,0.4)]"></div>
                    <div className="w-full bg-indigo-500/40 rounded-t h-[60%]"></div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border border-slate-700/50 bg-[#1e293b]/30">
                  <div className="h-2 w-1/3 bg-slate-500 rounded-full mb-3.5"></div>
                  <div className="space-y-2.5">
                    <div className="h-1.5 w-full bg-slate-700 rounded-full"></div>
                    <div className="h-1.5 w-4/5 bg-slate-700 rounded-full"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}