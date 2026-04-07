import React, { useState, useEffect } from 'react';
import { fetchArticles, fetchCategories } from '../services/api';
import FeaturedBanner from '../components/FeaturedBanner';
import NewsCard from '../components/NewsCard';
import TrendingItem from '../components/TrendingItem';
import CategoryCard from '../components/CategoryCard';
import SkeletonCard from '../components/SkeletonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronRight, Zap, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslate } from '../hooks/useDynamicTranslate';

const TickerItem = ({ article }) => {
  const { translatedText } = useDynamicTranslate(article?.title);
  return (
    <Link to={`/article/${article?._id || article?.id}`} className="text-sm font-bold hover:underline underline-offset-4 whitespace-nowrap mr-12">
      {translatedText || '...'} •
    </Link>
  );
};

const HeroSideItem = ({ article }) => {
  const { translatedText: title } = useDynamicTranslate(article?.title);
  const { translatedText: category } = useDynamicTranslate(article?.category);
  return (
    <Link 
      to={`/article/${article?._id || article?.id}`} 
      className="group relative flex-1 bg-surface border border-border rounded-card overflow-hidden shadow-sm hover:shadow-lg transition-all"
    >
      <div className="absolute inset-0 z-0">
        <img src={article?.image} alt={article?.title} className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500" />
      </div>
      <div className="relative z-10 p-6 flex flex-col justify-end h-full">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent mb-2">{category}</span>
        <h3 className="text-xl font-display font-bold leading-tight group-hover:text-accent transition-colors">{title}</h3>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Simple local cache
  const [cache, setCache] = useState({});

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const [newsRes, catRes] = await Promise.all([
          fetchArticles({ limit: 12, page: 1 }),
          fetchCategories()
        ]);
        if (newsRes.success) {
          setArticles(newsRes.data);
          setHasNextPage(newsRes.page < newsRes.pages);
          setCache(prev => ({ ...prev, 1: newsRes.data }));
        }
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        setError(err.message || 'Failed to load home page data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadMore = async () => {
    const nextPage = page + 1;
    if (cache[nextPage]) {
      setArticles(prev => [...prev, ...cache[nextPage]]);
      setPage(nextPage);
      return;
    }

    setLoadingMore(true);
    try {
      const res = await fetchArticles({ limit: 12, page: nextPage });
      if (res.success) {
        setArticles(prev => {
          const existingIds = new Set(prev.map(a => a?._id || a?.id));
          const newArticles = res.data.filter(a => !existingIds.has(a?._id || a?.id));
          return [...prev, ...newArticles];
        });
        setHasNextPage(nextPage < res.pages);
        setPage(nextPage);
        setCache(prev => ({ ...prev, [nextPage]: res.data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center animate-in fade-in">
        <div className="p-6 rounded-full bg-red-500/10 inline-block mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-display font-black mb-2 italic underline decoration-red-500/20 underline-offset-8">
          Feed Unavailable
        </h2>
        <p className="text-muted text-sm max-w-sm mx-auto">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-8 text-xs font-black uppercase tracking-widest text-accent hover:underline"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  const featuredArticle = articles.find(a => a?.isFeatured) || articles[0];
  const latestArticles = articles.filter(a => !a?.isFeatured).slice(0, 6);
  const trendingArticles = [...articles].sort((a, b) => (b?.views || 0) - (a?.views || 0)).slice(0, 5);
  const moreArticles = articles.slice(6, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-in fade-in duration-700">
      {/* Breaking News Ticker */}
      <div className="relative flex items-center bg-accent text-white overflow-hidden rounded-full py-2 shadow-lg group">
        <div className="absolute left-0 z-10 bg-accent px-6 py-2 flex items-center space-x-2 border-r border-white/20 shadow-xl">
          <Zap className="h-4 w-4 fill-white animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">Breaking News</span>
        </div>
        <div className="ticker-marquee flex items-center pl-4">
          {[...articles.slice(0, 5), ...articles.slice(0, 5)].map((a, i) => (
            <TickerItem key={i} article={a} />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {featuredArticle && <FeaturedBanner article={{...featuredArticle, id: featuredArticle?._id || featuredArticle?.id, imageUrl: featuredArticle?.image}} />}
        </div>
        <div className="flex flex-col space-y-8">
          {articles.slice(1, 3).map((a) => (
             <HeroSideItem key={a?._id || a?.id} article={a} />
          ))}
        </div>
      </section>

      {/* Latest News & Trending Sidebar */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between border-b-2 border-accent/20 pb-4">
            <h2 className="text-3xl font-display font-black tracking-tight">{t('home.latestNews', 'Latest Stories')}</h2>
            <Link to="/category/all" className="flex items-center text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">
              {t('home.exploreMore', 'View All')} <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((a) => <NewsCard key={a?._id || a?.id} article={{...a, id: a?._id || a?.id, imageUrl: a?.image}} />)}
          </div>
        </div>

        {/* Trending Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="border-b-2 border-accent/20 pb-4">
            <h2 className="text-2xl font-display font-black tracking-tight">{t('home.trending', 'Trending Now')}</h2>
          </div>
          <div className="flex flex-col">
            {trendingArticles.map((a, i) => (
              <TrendingItem key={a?._id || a?.id} article={{...a, id: a?._id || a?.id}} index={i} />
            ))}
          </div>
          
          <div className="bg-surface border border-border rounded-card p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-display font-black mb-4">{t('home.stayRegular', 'Stay Regular')}</h3>
            <p className="text-sm text-muted mb-4 leading-relaxed">{t('home.subscribeDesc', "Don't miss out on community highlights. Subscribe for weekly exclusives.")}</p>
            <button className="w-full bg-accent text-white py-3 rounded-input font-bold uppercase tracking-widest hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
              {t('home.joinNewsletter', 'Join Newsletter')}
            </button>
          </div>
        </aside>
      </section>

      {/* Browse Topics */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-black tracking-tight">{t('home.exploreTopics', 'Explore Topics')}</h2>
          <p className="text-muted text-sm max-w-md mx-auto">{t('home.exploreTopicsDesc', 'Deep dive into specific categories that matter to your lifestyle and locality.')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat} 
              category={cat} 
              count={articles.filter(a => a?.category?.toLowerCase() === cat.toLowerCase()).length} 
            />
          ))}
        </div>
      </section>

      {/* More Stories */}
      {moreArticles.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="h-[2px] bg-accent/20 flex-1" />
            <h2 className="text-2xl font-display font-black tracking-tight whitespace-nowrap uppercase italic tracking-widest">{t('home.moreFromWire', 'More From The Wire')}</h2>
            <div className="h-[2px] bg-accent/20 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moreArticles.map((a) => (
              <NewsCard key={a?._id || a?.id} article={{...a, id: a?._id || a?.id, imageUrl: a?.image}} />
            ))}
          </div>
          
          {hasNextPage && (
            <div className="flex justify-center mt-12">
              <button 
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-surface border-2 border-border text-muted hover:border-accent hover:text-accent font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {loadingMore && <LoadingSpinner />}
                <span>{loadingMore ? 'Fetching...' : t('home.loadMore', 'Load More Articles')}</span>
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default HomePage;
