import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [tab, setTab] = useState('articles');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/admin/users'),
      axiosInstance.get('/admin/articles'),
    ]).then(([u, a]) => {
      setUsers(u.data);
      setArticles(a.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>ADMIN PANEL</div>
            <h1 style={styles.title}>Control Center 👑</h1>
            <p style={styles.subtitle}>Logged in as <span style={styles.accent}>{user?.email}</span></p>
          </div>
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>Sign Out</button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{users.length}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{articles.length}</div>
            <div style={styles.statLabel}>Total Articles</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{users.filter(u => u.role === 'admin').length}</div>
            <div style={styles.statLabel}>Admins</div>
          </div>
        </div>

        <div style={styles.tabs}>
          <button style={tab === 'articles' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
            onClick={() => setTab('articles')}>📝 Articles</button>
          <button style={tab === 'users' ? { ...styles.tab, ...styles.tabActive } : styles.tab}
            onClick={() => setTab('users')}>👥 Users</button>
        </div>

        {loading ? (
          <p style={{ color: '#6b6b85', padding: 24 }}>Loading...</p>
        ) : tab === 'articles' ? (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>{['Title', 'Author', 'Email', 'Date'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {articles.map((a, i) => (
                  <tr key={a._id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>
                      <div style={styles.articleTitle}>{a.title}</div>
                      <div style={styles.articlePreview}>{a.content.slice(0, 60)}...</div>
                    </td>
                    <td style={styles.td}>{a.author?.name}</td>
                    <td style={styles.td}>{a.author?.email}</td>
                    <td style={styles.td}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>{['Name', 'Email', 'Role', 'Joined'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={u.role === 'admin' ? styles.roleAdmin : styles.roleUser}>
                        {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', padding: '40px 24px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'fixed', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,109,250,0.08) 0%, transparent 70%)', top: 0, left: '30%', pointerEvents: 'none' },
  container: { maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 },
  badge: { display: 'inline-block', background: 'rgba(250,191,71,0.1)', color: '#fbbf47', fontSize: 11, fontWeight: 600, letterSpacing: 2, padding: '4px 12px', borderRadius: 20, marginBottom: 12 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#f0f0f8', marginBottom: 8 },
  subtitle: { color: '#6b6b85', fontSize: 15 },
  accent: { color: '#a78bfa' },
  logoutBtn: { background: 'transparent', border: '1px solid #2a2a38', color: '#6b6b85', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 },
  statCard: { background: '#13131a', border: '1px solid #2a2a38', borderRadius: 16, padding: '24px', textAlign: 'center' },
  statNum: { fontFamily: 'Syne, sans-serif', fontSize: 42, fontWeight: 800, color: '#a78bfa', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#6b6b85', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: { padding: '10px 24px', borderRadius: 10, border: '1px solid #2a2a38', background: '#13131a', color: '#6b6b85', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif' },
  tabActive: { border: '1px solid #7c6dfa', background: 'rgba(124,109,250,0.12)', color: '#a78bfa', fontWeight: 600 },
  tableCard: { background: '#13131a', border: '1px solid #2a2a38', borderRadius: 16, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b85', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #2a2a38' },
  td: { padding: '14px 24px', fontSize: 14, color: '#c0c0d8', verticalAlign: 'top' },
  trEven: { background: 'transparent' },
  trOdd: { background: 'rgba(255,255,255,0.02)' },
  articleTitle: { fontWeight: 600, color: '#f0f0f8', marginBottom: 4, fontFamily: 'Syne, sans-serif' },
  articlePreview: { fontSize: 12, color: '#6b6b85' },
  roleAdmin: { background: 'rgba(250,191,71,0.1)', color: '#fbbf47', padding: '3px 10px', borderRadius: 20, fontSize: 13, fontWeight: 500 },
  roleUser: { background: 'rgba(124,109,250,0.1)', color: '#a78bfa', padding: '3px 10px', borderRadius: 20, fontSize: 13, fontWeight: 500 },
};