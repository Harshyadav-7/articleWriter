import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = () => {
    axiosInstance.get('/articles/my')
      .then(({ data }) => setArticles(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, []);

  

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>USER DASHBOARD</div>
            <h1 style={styles.title}>My Articles ✍️</h1>
            <p style={styles.subtitle}>Welcome, <span style={styles.accent}>{user?.name}</span></p>
          </div>
          <div style={styles.btnRow}>
            <button style={styles.writeBtn} onClick={() => navigate('/write')}>+ New Article</button>
            <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>Sign Out</button>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{articles.length}</div>
            <div style={styles.statLabel}>Total Articles</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{user?.role}</div>
            <div style={styles.statLabel}>Your Role</div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#6b6b85', textAlign: 'center', marginTop: 40 }}>Loading...</p>
        ) : articles.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
            <p style={{ color: '#6b6b85', fontSize: 16 }}>No articles yet. Write your first one!</p>
            <button style={{ ...styles.writeBtn, marginTop: 20 }} onClick={() => navigate('/write')}>
              + Write Article
            </button>
          </div>
        ) : (
          <div style={styles.articleGrid}>
            {articles.map(a => (
              <div key={a._id} style={styles.articleCard}>
               <Link to={`/article/${a._id}`}>
                <div style={styles.articleMeta}>
                  {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <h3 style={styles.articleTitle}>{a.title}</h3>
                <p style={styles.articlePreview}>
                  {a.content.length > 120 ? a.content.slice(0, 120) + '...' : a.content}
                </p>
                </Link>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', padding: '40px 24px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'fixed', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,109,250,0.1) 0%, transparent 70%)', top: 0, left: '30%', pointerEvents: 'none' },
  container: { maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 },
  badge: { display: 'inline-block', background: 'rgba(74,222,128,0.1)', color: '#9b9845', fontSize: 11, fontWeight: 600, letterSpacing: 2, padding: '4px 12px', borderRadius: 20, marginBottom: 12 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#f0f0f8', marginBottom: 8 },
  subtitle: { color: '#6b6b85', fontSize: 15 },
  accent: { color: '#a78bfa' },
  btnRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  writeBtn: { background: 'linear-gradient(135deg, #7c6dfa, #a78bfa)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' },
  logoutBtn: { background: 'transparent', border: '1px solid #2a2a38', color: '#6b6b85', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32, maxWidth: 400 },
  statCard: { background: '#13131a', border: '1px solid #2a2a38', borderRadius: 16, padding: '24px', textAlign: 'center' },
  statNum: { fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#a78bfa', marginBottom: 4, textTransform: 'capitalize' },
  statLabel: { fontSize: 12, color: '#6b6b85', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 },
  emptyState: { textAlign: 'center', marginTop: 80 },
  articleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  articleCard: { background: '#13131a', border: '1px solid #2a2a38', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 },
  articleMeta: { fontSize: 12, color: '#6b6b85', fontWeight: 500, letterSpacing: 0.5 },
  articleTitle: { fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f0f8', lineHeight: 1.4 },
  articlePreview: { fontSize: 14, color: '#6b6b85', lineHeight: 1.7, flex: 1 },
  deleteBtn: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif', alignSelf: 'flex-start', marginTop: 4 },
};