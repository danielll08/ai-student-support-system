import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, Mail, Lock, Loader } from 'lucide-react';

import { mockUser } from '@/data/mockData';
// Gọi đúng hàm useAuth từ AuthContext mới tạo
import { useAuth } from '@/contexts/AuthContext'; 

export default function LoginPage() {
  const navigate = useNavigate();
  // Lấy hàm login từ hệ thống
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState('an.nguyen@student.edu.vn');
  const [password, setPassword] = useState('password123');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Đổi tên state loading để tránh trùng lặp nếu có
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) { 
        setError('Vui lòng nhập đầy đủ thông tin!'); 
        return; 
    }
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // Giả lập call API
    setIsLoading(false);
    
    // Gọi hàm login và truyền mockUser vào, sau đó chuyển hướng
    login({ ...mockUser, name: mockUser.fullName });
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <aside className="auth-sidebar">
          <div className="auth-sidebar-badge">StudyAI</div>
          <h2 className="auth-sidebar-title">Quản lý học tập dễ dàng hơn mỗi ngày</h2>
          <p className="auth-sidebar-text">Đăng nhập để truy cập dashboard cá nhân, lập kế hoạch, theo dõi tiến độ và sử dụng trợ lý AI hỗ trợ học tập.</p>
          <ul className="auth-features">
            <li>📌 Dashboard trực quan cho sinh viên</li>
            <li>🗂️ Quản lý nhiệm vụ với Kanban</li>
            <li>⏱️ Pomodoro & nhắc nhở học tập</li>
          </ul>
        </aside>

        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon"><BookOpen size={28} color="white" /></div>
            <div>
              <div className="auth-title">Chào mừng trở lại! 👋</div>
              <div className="auth-subtitle">Đăng nhập để tiếp tục hành trình học tập</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--danger)', animation: 'shake 0.4s ease' }}>
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email / Tên đăng nhập</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  className="form-input"
                  type="email"
                  placeholder="email@student.edu.vn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 38 }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  className="form-input"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 38, paddingRight: 40 }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: 'var(--accent-blue)' }} />
                Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>
                Quên mật khẩu?
              </Link>
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={isLoading} style={{ marginTop: 8 }}>
              {isLoading ? <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Đang đăng nhập...</> : '🚀 Đăng nhập'}
            </button>
          </form>

          <div className="auth-divider">hoặc đăng nhập nhanh</div>

          <button className="btn btn-secondary btn-full" onClick={() => { login({ ...mockUser, name: mockUser.fullName }); navigate('/dashboard'); }} style={{ gap: 8 }}>
            🎭 Demo - Đăng nhập không cần tài khoản
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
            Chưa có tài khoản?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}