import {useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function Articledetails(){
    const {id}= useParams();
    const [article, setArticle] = useState(null);
    const [text, setText] = useState('');
    const [head, setHead] = useState('');
    const [iseditingTitle, seteditingTitle] = useState(false);
    const [iseditingContent, seteditingContent] = useState(false);
    const navigate = useNavigate();
   

    const loadArticle = async() =>{
        try{
          const res  =   await axiosInstance.get(`/articles/my/${id}`)
          setArticle(res.data);
         
        }catch(error){
            console.log("error Loading Articles", error);
        }
    }

    useEffect(()=>{
        loadArticle();
    }, [id])


    useEffect(()=>{
        if(article){
            setHead(article.title);
            setText(article.content);
        }

    }, [article])


    if(!article){
        return <div>Loading.....</div>
    }

    const handleHeadChange = (e) =>{
        setHead(e.target.value);
    }

    const handleTextChange = (e) =>{
        setText(e.target.value);
    }

    const handleUpdate =async(id) =>{
        // e.preventDefault();
        if(!confirm("save updates")) return;
        const res = await axiosInstance.put(`/articles/${id}`, {title: head, content:text});
        
        setArticle(res.data);
    };

    const handleDelete = async (id) => {
        // e.preventDefault();
    if (!confirm('Delete this article?')) return;
    await axiosInstance.delete(`/articles/${id}`);
    setArticles(prev => prev.filter(a => a._id !== id));
  };


    return(
        <div style={styles.page}>
            <div style={styles.glow} />
            <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Your Article</h1>
                </div>
                <div style={styles.btnRow}>
                    <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
                </div>
            </div>

            
                
                    <div  style={styles.articleCard}>
                       <form >
                        
                              
                        <div style={styles.articleMeta}>
                            {new Date(article.createdAt).toLocaleString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}
                            </div>
                            {iseditingTitle ? (
                                <textarea onChange={handleHeadChange}
                                 value={head}
                                 type="text"
                                 placeholder="Title"
                                />
                            ) :(
                              <h3 onClick={() => seteditingTitle(true)} style={styles.articleTitle}>{article.title}</h3>
                            )}
                            {iseditingContent ? (
                                <textarea
                                    onChange={handleTextChange}
                                    value={text}
                                    placeholder="content"
                                />
                            ) : (
                                <p  onClick={() => seteditingContent(true)}   style={styles.articlePreview}>
                  {article.content.length > 120 ? article.content.slice(0) : article.content}
                </p>
                            )}
                
                <button style={styles.deleteBtn} onClick={() => handleDelete(article._id)}>Delete</button>
                <button type='button' style={styles.updateBtn} onClick={() => handleUpdate(article._id)}>Update</button>
                </form>
                </div>
                
            </div>
            
        
        </div>
    )
}

const styles ={
    page: { minHeight: '100vh', background: '#0a0a0f', padding: '40px 24px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'fixed', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,109,250,0.1) 0%, transparent 70%)', top: 0, left: '30%', pointerEvents: 'none' },
  container: { maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#f0f0f8' },
  btnRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
   backBtn: { background: 'transparent', border: '1px solid #2a2a38', color: '#6b6b85', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif' },
   articleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
   articleCard: { background: '#13131a', border: '1px solid #2a2a38', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 },
    articleMeta: { fontSize: 12, color: '#6b6b85', fontWeight: 500, letterSpacing: 0.5 },
    articleTitle: { fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#f0f0f8', lineHeight: 1.4 },
    articlePreview: { fontSize: 14, color: '#6b6b85', lineHeight: 1.7, flex: 1 },
    deleteBtn: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif', alignSelf: 'flex-start', marginTop: 4 },
    updateBtn: { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif', alignSelf: 'flex-start', marginTop: 4 },
}
