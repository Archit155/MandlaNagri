import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchCategories, createArticle } from '../services/api';
import toast from 'react-hot-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const CreateArticlePage = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories().then(res => {
      if (res.success) {
        const cats = res.data.filter(c => c !== 'All');
        setCategories(cats);
        if (cats.length > 0) setCategory(cats[0]);
      }
    }).catch(console.error);
  }, []);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check limit
    if (photos.length + selectedFiles.length > 3) {
      toast.error('You can only upload up to 3 photos!');
      return;
    }

    const newPhotos = [...photos, ...selectedFiles];
    const newPreviews = [...previews, ...selectedFiles.map(file => URL.createObjectURL(file))];

    setPhotos(newPhotos);
    setPreviews(newPreviews);
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    photos.forEach(file => {
      formData.append('photos', file);
    });

    try {
      const res = await createArticle(formData);
      if (res.success) {
        toast.success('Article published successfully!');
        navigate(`/article/${res.data._id}`);
      } else {
        setError(res.message || 'Failed to create article');
      }
    } catch (err) {
      setError(err.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !hasRole(['admin', 'employee'])) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-display font-black text-muted mb-4 uppercase italic tracking-tighter">
          Not Authorized
        </h1>
        <p className="text-muted mb-8 tracking-wide">You must be an Author or Admin to create articles.</p>
        <Link to="/dashboard" className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] hover:underline">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-black tracking-tighter italic">Create News Article</h1>
        <p className="text-muted text-sm mt-2 font-medium">Publish a new story to the platform.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 font-bold text-sm flex items-center gap-3">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-border p-10 rounded-card shadow-2xl relative overflow-hidden">
        {/* UI Accent */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <ImageIcon className="h-32 w-32" />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-muted mb-3">Headline</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-bg border border-border rounded-input py-4 px-5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold text-lg"
            placeholder="Enter an engaging title..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-xs font-black uppercase tracking-widest text-muted mb-3">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-bg border border-border rounded-input py-4 px-5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-black uppercase tracking-widest text-muted mb-3">
               Upload Photos (Max 3)
            </label>
            <div className="relative">
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={photos.length >= 3}
                className="hidden"
                id="photo-upload"
              />
              <label 
                htmlFor="photo-upload"
                className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-input py-4 transition-all cursor-pointer ${photos.length >= 3 ? 'opacity-50 cursor-not-allowed border-border bg-bg' : 'border-accent/40 bg-accent/5 hover:bg-accent/10 hover:border-accent'}`}
              >
                <Upload className="h-5 w-5 text-accent" />
                <span className="text-xs font-black uppercase tracking-widest text-accent">
                  {photos.length >= 3 ? 'Limit Reached' : 'Add Photos'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Image Preview Grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 py-4">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square group rounded-xl overflow-hidden border border-border shadow-md">
                <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <button 
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-muted mb-3">Article Content</label>
          <textarea 
            required 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full bg-bg border border-border rounded-input py-4 px-5 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y font-medium text-text leading-relaxed"
            placeholder="Write the full story here..."
          />
        </div>

        <div className="flex justify-end pt-8 border-t border-border mt-8">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-6 py-4 mr-6 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-accent text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center min-w-[200px]"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Publish Article'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePage;
