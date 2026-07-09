import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/auth/login', form);
      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.badge}>WELCOME BACK</div>
        <h2 style={styles.title}>Log In</h2>
        <p style={styles.subtitle}>Enter your credentials to continue</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Log In →'}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>SignUp here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', position: 'relative', overflow: 'hidden' },
  glow: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,109,250,0.15) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' },
  card: { background: '#13131a', border: '1px solid #2a2a38', borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 },
  badge: { display: 'inline-block', background: 'rgba(124,109,250,0.15)', color: '#a78bfa', fontSize: 11, fontWeight: 600, letterSpacing: 2, padding: '4px 12px', borderRadius: 20, marginBottom: 16 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#f0f0f8', marginBottom: 8 },
  subtitle: { color: '#6b6b85', fontSize: 14, marginBottom: 32 },
  error: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 500, color: '#9090aa' },
  input: { background: '#1c1c26', border: '1px solid #2a2a38', borderRadius: 10, padding: '12px 16px', color: '#f0f0f8', fontSize: 15, outline: 'none', fontFamily: 'DM Sans, sans-serif' },
  btn: { background: 'linear-gradient(135deg, #7c6dfa, #a78bfa)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8, fontFamily: 'Syne, sans-serif', letterSpacing: 0.5 },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b6b85' },
  link: { color: '#a78bfa', textDecoration: 'none', fontWeight: 500 },
};