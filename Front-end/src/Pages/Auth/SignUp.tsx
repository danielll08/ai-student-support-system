import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, Eye, EyeOff, GraduationCap, Loader } from 'lucide-react';

// Sửa lại đường dẫn import sử dụng Alias (@/)
import { useAuth } from '@/contexts/AuthContext';
import { mockUser } from '@/data/mockData';

const UNIVERSITIES = [
  'Đại học Công nghệ TP.HCM (HUTECH)',
  'Đại học Bách Khoa TP.HCM',
  'Đại học Khoa học Tự nhiên TP.HCM',
  'Đại học Khoa học Xã hội & Nhân văn TP.HCM',
  'Đại học Sư phạm Kỹ thuật TP.HCM',
  'Đại học FPT',
  'Đại học Hà Nội',
  'Đại học Quốc gia Hà Nội',
  'Khác',
];

function getStrength(pwd: string) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

export default function SignUpPage() {
  // Thay đổi useApp thành useAuth và lấy hàm login
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', university: '', major: '', studentId: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = getStrength(form.password);
  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh'];
  const strengthColors = ['', 'var(--danger)', 'var(--warning)', '#22C55E', 'var(--success)'];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên';
    if (!form.email.includes('@')) e.email = 'Email không hợp lệ';
    if (form.password.length < 6) e.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (form.password !== form.confirm) e.confirm = 'Mật khẩu không khớp';
    if (!form.university) e.university = 'Vui lòng chọn trường';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Giả lập gọi API đăng ký
    setLoading(false);
    
    // Gọi hàm login với thông tin user mới đăng ký
    login({ 
        ...mockUser, 
        fullName: form.fullName, 
        email: form.email, 
        university: form.university, 
        major: form.major, 
        studentId: form.studentId 
    });
    
    navigate('/dashboard');
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-container">
        <aside className="auth-sidebar">
          <div className="auth-sidebar-badge">StudyAI</div>
          <h2 className="auth-sidebar-title">Tạo tài khoản, bắt đầu hành trình học tập</h2>
          <p className="auth-sidebar-text">Đăng ký để quản lý lịch học, theo dõi tiến độ và nhận hỗ trợ AI thông minh cho sinh viên.</p>
          <ul className="auth-features">
            <li>🏫 Thông tin cá nhân & học tập rõ ràng</li>
            <li>📈 Dashboard tiến độ học tập</li>
            <li>💡 Tối ưu lịch và nhiệm vụ hàng ngày</li>
          </ul>
        </aside>

        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon"><BookOpen size={28} color="white" /></div>
            <div>
              <div className="auth-title">Bắt đầu hành trình học tập 🎓</div>
              <div className="auth-subtitle">Tạo tài khoản miễn phí ngay hôm nay</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input className="form-input" placeholder="Nguyễn Văn A" value={form.fullName} onChange={set('fullName')} style={{ paddingLeft: 34 }} />
                </div>
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">MSSV</label>
                <input className="form-input" placeholder="SV2021001" value={form.studentId} onChange={set('studentId')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input className="form-input" type="email" placeholder="email@student.edu.vn" value={form.email} onChange={set('email')} style={{ paddingLeft: 34 }} />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Trường đại học *</label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', zIndex: 1 }} />
                <select className="form-select" value={form.university} onChange={set('university')} style={{ paddingLeft: 34 }}>
                  <option value="">-- Chọn trường --</option>
                  {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              {errors.university && <span className="form-error">{errors.university}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Chuyên ngành</label>
              <input className="form-input" placeholder="Công nghệ thông tin" value={form.major} onChange={set('major')} />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input className="form-input" type={showPwd ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={set('password')} style={{ paddingLeft: 34, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && (
                <>
                  <div className="password-strength" style={{ marginTop: 6 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`strength-bar ${i <= strength ? (strength === 1 ? 'weak' : strength === 2 ? 'fair' : strength === 3 ? 'good' : 'strong') : ''}`} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColors[strength], fontWeight: 600 }}>
                    {strengthLabels[strength]}
                  </span>
                </>
              )}
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input className="form-input" type="password" placeholder="Nhập lại mật khẩu" value={form.confirm} onChange={set('confirm')} style={{ paddingLeft: 34 }} />
              </div>
              {errors.confirm && <span className="form-error">{errors.confirm}</span>}
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Đang tạo tài khoản...</> : '✨ Tạo tài khoản'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}