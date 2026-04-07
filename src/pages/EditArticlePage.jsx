import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchCategories, fetchArticle, updateArticle } from '../services/api';
import toast from 'react-hot-toast';

const EditArticlePage = () => {
  const { id } = useParams();
  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState('');
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Headline is required';
    if (!content.trim()) errors.content = 'Content is required';
    if (!category.trim()) errors.category = 'Category is required';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await fetchArticle(id);
        if (res.success) {
          setTitle(res.data.title);
          setContent(res.data.content);
          setCategory(res.data.category);
          setImage(res.data.image || '');
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to fetch article details');
      } finally {
        setInitialLoading(false);
      }
    };

    if (isAuthenticated) {
      loadArticle();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchCategories().then(res => {
      if (res.success) {
        setCategories(res.data.filter(c => c !== 'All'));
      }
    }).catch(console.error);
  }, []);

  // Redirect if not authenticated or not author
  if (!isAuthenticated || !hasRole(['admin', 'employee'])) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-display font-black text-muted mb-4 uppercase italic">Not Authorized</h1>
        <p className="text-muted mb-8">You must be an Author or Admin to edit articles.</p>
        <Link to="/dashboard" className="text-accent font-bold uppercase tracking-widest hover:underline">Go to Dashboard</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await updateArticle(id, { title, content, category, image });
      if (res.success) {
        toast.success('Changes saved successfully!');
        navigate(`/article/${res.data._id}`);
      } else {
        setError(res.message || 'Failed to update article');
      }
    } catch (err) {
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-muted font-bold tracking-widest uppercase">Loading article data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter italic">Edit Article</h1>
          <p className="text-muted text-sm mt-2">Update an existing story.</p>
        </div>
        <Link to={`/article/${id}`} className="text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
          View Article
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 font-bold text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-border p-8 rounded-card shadow-lg">
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-xs font-black uppercase tracking-widest text-muted">Headline</label>
            {fieldErrors.title && <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">{fieldErrors.title}</span>}
          </div>
          <input 
            type="text" 
            required 
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) setFieldErrors(prev => ({ ...prev, title: null }));
            }}
            className={`w-full bg-bg border ${fieldErrors.title ? 'border-red-500 ring-2 ring-red-500/10' : 'border-border'} rounded-input py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-black uppercase tracking-widest text-muted">Category</label>
              {fieldErrors.category && <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">Required</span>}
            </div>
            <input 
              list="edit-category-list"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (fieldErrors.category) setFieldErrors(prev => ({ ...prev, category: null }));
              }}
              placeholder="e.g. Politics"
              className={`w-full bg-bg border ${fieldErrors.category ? 'border-red-500 ring-2 ring-red-500/10' : 'border-border'} rounded-input py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold`}
            />
            <datalist id="edit-category-list">
              {categories.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-muted mb-2">Feature Image URL</label>
            <input 
              type="url" 
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-bg border border-border rounded-input py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-xs font-black uppercase tracking-widest text-muted">Article Content</label>
            {fieldErrors.content && <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">{fieldErrors.content}</span>}
          </div>
          <textarea 
            required 
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (fieldErrors.content) setFieldErrors(prev => ({ ...prev, content: null }));
            }}
            rows={10}
            className={`w-full bg-bg border ${fieldErrors.content ? 'border-red-500 ring-2 ring-red-500/10' : 'border-border'} rounded-input py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y font-medium text-text leading-relaxed`}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border mt-8">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-6 py-3 mr-4 text-xs font-bold uppercase tracking-widest text-muted hover:text-text transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="bg-accent text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center min-w-[160px]"
          >
            {saving ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticlePage;
