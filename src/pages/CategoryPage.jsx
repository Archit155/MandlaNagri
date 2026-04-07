import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticles } from '../services/api';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    // Reset page when category changes
    setPage(1);
  }, [categoryName]);

  useEffect(() => {
    const loadCategoryNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchArticles({ 
          category: categoryName === 'all' ? '' : categoryName, 
          page, 
          limit 
        });
        if (res.success) {
          setArticles(res.data);
          setTotalPages(res.pages);
        }
      } catch (err) {
        setError(err.message || t('article.noStories'));
      } finally {
        setLoading(false);
      }
    };
    
    loadCategoryNews();
  }, [categoryName, page, t]);

  const currentCategoryKey = categoryName.toLowerCase();
  const currentCategoryDisplay = t(`nav.categories.${currentCategoryKey}`, categoryName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500 min-h-screen flex flex-col">
      {/* Page Header */}
      <div className="mb-12 space-y-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-muted">
          <Link to="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-accent capitalize">{currentCategoryDisplay}</span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight capitalize">
              {currentCategoryDisplay}
            </h1>
          </div>
        </div>
      </div>

      {/* States */}
      {error && (
        <div className="text-center py-24 bg-surface border border-dashed border-red-500/30 rounded-card">
          <h2 className="text-2xl font-display font-black text-red-500 mb-4 italic">Error</h2>
          <p className="text-muted">{error}</p>
        </div>
      )}

      {!error && articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 flex-grow">
            {loading 
              ? Array(limit).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : articles.map(a => <NewsCard key={a._id || a.id} article={{...a, id: a._id || a.id, imageUrl: a.image}} />)
            }
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-8 border-t border-border mt-auto">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-accent hover:text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> {t('home.loadMore').split(' ')[0]}
              </button>
              <span className="text-sm font-black text-muted">
                {page} / {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-accent hover:text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('home.loadMore').split(' ')[0]} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {!error && !loading && articles.length === 0 && (
        <div className="text-center py-24 bg-surface border border-dashed border-border rounded-card">
          <h2 className="text-2xl font-display font-black text-muted mb-4 italic">{t('article.noStories')}</h2>
          <Link to="/" className="text-accent font-bold uppercase tracking-widest hover:underline">
            {t('article.backHome')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
