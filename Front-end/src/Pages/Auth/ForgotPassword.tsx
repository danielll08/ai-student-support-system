import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, CheckCircle, Loader } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep(2);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><BookOpen size={28} color="white" /></div>
          <div>
            <div className="auth-title">
              {step === 1 ? 'Quên mật khẩu? 🔑' : 'Kiểm tra email! 📧'}
            </div>
            <div className="auth-subtitle">
              {step === 1 ? 'Nhập email để nhận link đặt lại mật khẩu' : 'Chúng tôi đã gửi link khôi phục đến email của bạn'}
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: s <= step ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
              transition: 'background 0.4s'
            }} />
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Địa chỉ Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input className="form-input" type="email" placeholder="email@student.edu.vn" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 38 }} />
              </div>
            </div>
            <button className="btn btn-primary btn-lg btn-full" type="submit" disabled={loading}>
              {loading
                ? <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Đang gửi...</>
                : '✈️ Gửi link khôi phục'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInScale 0.5s both' }}>
              <CheckCircle size={36} color="var(--success)" />
            </div>
            <div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Link khôi phục mật khẩu đã được gửi đến<br />
                <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 8 }}>
                Kiểm tra hộp thư (kể cả thư mục Spam)
              </p>
            </div>
            <button className="btn btn-secondary btn-full" onClick={() => setStep(1)}>
              Gửi lại email
            </button>
          </div>
        )}

        <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}