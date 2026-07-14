import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

export default function WriteArticle() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/articles', form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  const handleAskGemini = async() =>{
    try{
      const res = await axiosInstance.post('/gemini/ask', {question});
      setForm({...form, content: res.data.reply});
    }catch(error){
      console.log("error asking gemini", error);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>NEW ARTICLE</div>
            <h1 style={styles.title}>Write Article ✍️</h1>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} placeholder="Enter article title..."
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div style={styles.gemRow}>
            <button style={styles.btn} type='button' onClick={handleAskGemini} >askGemini</button>
            <input style={styles.input} placeholder='Write your Question' onChange={e => setQuestion(e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Content</label>
            <textarea style={styles.textarea} placeholder="Write your article here..."
              value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              rows={14} required />
          </div>
          <button style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} type="submit" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Article →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', padding: '40px 24px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'fixed', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,109,250,0.1) 0%, transparent 70%)', top: 0, left: '30%', pointerEvents: 'none' },
  container: { maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 },
  badge: { display: 'inline-block', background: 'rgba(124,109,250,0.15)', color: '#a78bfa', fontSize: 11, fontWeight: 600, letterSpacing: 2, padding: '4px 12px', borderRadius: 20, marginBottom: 12 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#f0f0f8' },
  backBtn: { background: 'transparent', border: '1px solid #2a2a38', color: '#6b6b85', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif' },
  error: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 500, color: '#9090aa' },
  input: { background: '#13131a', border: '1px solid #2a2a38', borderRadius: 10, padding: '14px 16px', color: '#f0f0f8', fontSize: 16, outline: 'none', fontFamily: 'DM Sans, sans-serif' },
  textarea: { background: '#13131a', border: '1px solid #2a2a38', borderRadius: 10, padding: '14px 16px', color: '#f0f0f8', fontSize: 15, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7 },
  btn: { background: 'linear-gradient(135deg, #7c6dfa, #a78bfa)', color: '#022311', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne, sans-serif', letterSpacing: 0.5 },
  gemRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
};