import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TrendingItem from '../components/TrendingItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronRight, Calendar, User, Share2, Bookmark, MessageSquare, Mail, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchArticle, deleteArticle, BASE_URL } from '../services/api';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslate } from '../hooks/useDynamicTranslate';
import toast from 'react-hot-toast';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const isAuthor = hasRole(['admin', 'employee']);
  const isAdmin = hasRole('admin');
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { t } = useTranslation();
  const { translatedText: title } = useDynamicTranslate(article?.title);
  const { translatedText: content } = useDynamicTranslate(article?.content);
  const { translatedText: categoryName } = useDynamicTranslate(article?.category);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await fetchArticle(id);
        if (res.success) {
          setArticle(res.data);
        } else {
          setError(t('article.noStories'));
        }
      } catch (err) {
        setError(err.message || t('article.noStories'));
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id, t]);

  const handleDelete = async () => {
    if (window.confirm(t('dashboard.signOutConfirm'))) {
      try {
        const res = await deleteArticle(id);
        if (res.success) {
          toast.success(t('dashboard.inviteSuccess'));
          navigate('/');
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Opening Story..." />;

  if (error || !article) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in fade-in">
      <div className="p-6 rounded-full bg-surface border border-border inline-block mb-6 shadow-xl">
        <AlertCircle className="h-12 w-12 text-muted" />
      </div>
      <h1 className="text-4xl font-display font-black text-text mb-4 uppercase italic tracking-tighter">
        {error || t('article.noStories')}
      </h1>
      <Link to="/" className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] hover:underline">
        {t('article.backHome')}
      </Link>
    </div>
  );

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in slide-in-from-bottom duration-700">
      {/* Author/Admin Actions */}
      {isAuthor && (
        <div className="flex justify-end space-x-4 mb-4">
          <Link to={`/edit-article/${article.id || article._id}`} className="flex items-center space-x-2 text-sm font-bold text-accent bg-accent/10 px-4 py-2 rounded-lg hover:bg-accent/20 transition-colors">
            <Edit className="h-4 w-4" />
            <span>{t('dashboard.writeArticle').split(' ')[0]}</span>
          </Link>
          {isAdmin && (
            <button onClick={handleDelete} className="flex items-center space-x-2 text-sm font-bold text-red-500 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors">
              <Trash2 className="h-4 w-4" />
              <span>{t('dashboard.signOut').split(' ')[1] || 'Delete'}</span>
            </button>
          )}
        </div>
      )}
      
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-muted mb-8">
        <Link to="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/category/${article.category?.toLowerCase()}`} className="hover:text-accent transition-colors">
          {t(`nav.categories.${article.category?.toLowerCase()}`, categoryName)}
        </Link>
        <ChevronRight className="h-3 w-3 hidden md:block" />
        <span className="text-accent hidden md:block truncate max-w-xs">{title}</span>
      </div>

      <header className="max-w-4xl mb-12 space-y-6">
        <span className="bg-accent px-4 py-1.5 rounded-badge text-[11px] uppercase font-black tracking-widest text-white shadow-lg shadow-accent/20">
          {t(`nav.categories.${article.category?.toLowerCase()}`, categoryName)}
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-black leading-tight tracking-tighter">
          {title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest text-muted leading-tight">{t('article.writtenBy')}</span>
              <span className="text-sm font-bold">{typeof article.author === 'object' ? article.author?.name : (article.author || 'Admin')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Recent'}</span>
            </div>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-3">
            {[Share2, Bookmark, MessageSquare].map((Icon, i) => (
              <button key={i} className="p-2.5 rounded-full bg-surface border border-border hover:bg-accent/10 hover:border-accent/40 transition-all text-muted hover:text-accent">
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Article Images Display */}
      {article.images && article.images.length > 0 && (
        <div className="space-y-6 mb-16">
          <div className="relative aspect-[16/7] w-full rounded-card overflow-hidden shadow-2xl group border border-border">
            <img 
              src={`${BASE_URL}${article.images[0]}`} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {article.images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
              {article.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-md hover:scale-[1.03] transition-all cursor-zoom-in">
                  <img src={`${BASE_URL}${img}`} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl md:text-2xl font-body leading-relaxed text-text mb-8 whitespace-pre-wrap">
              {content}
            </p>
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-border/50 flex flex-wrap gap-3">
            <span className="text-[10px] uppercase font-black tracking-widest text-muted mr-4 self-center">{t('article.category')}</span>
            <span className="px-4 py-1.5 bg-surface border border-border rounded-full text-xs font-bold hover:bg-accent/5 hover:border-accent/20 cursor-pointer transition-colors">
              {t(`nav.categories.${article.category?.toLowerCase()}`, categoryName)}
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-12">
          <div className="bg-accent text-white rounded-card p-10 flex flex-col items-center text-center space-y-6 shadow-2xl shadow-accent/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Mail className="h-20 w-20" />
            </div>
            <h3 className="text-2xl font-display font-black leading-tight italic">{t('article.neverMiss')}</h3>
            <p className="text-white/80 text-sm italic font-medium leading-relaxed">
              {t('article.subscribeDesc')}
            </p>
            <input type="email" placeholder={t('footer.subscribePlaceholder')} className="w-full bg-white/20 border border-white/30 rounded-input py-3 px-4 text-sm placeholder:text-white/60 focus:outline-none focus:bg-white/30" />
            <button className="w-full bg-white text-accent py-3 rounded-input font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-lg">
              {t('article.signMeUp')}
            </button>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default ArticlePage;

