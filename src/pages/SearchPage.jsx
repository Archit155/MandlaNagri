import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchArticles } from '../services/api';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import { Search, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState([]);
  
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    setSearchTerm(query);
    setPage(initialPage);
  }, [query, initialPage]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchArticles({ q: searchTerm, page, limit });
        if (res.success) {
          setResults(res.data);
          setTotalPages(res.pages);
          setSearchParams({ q: searchTerm, page: String(page) }, { replace: true });
        }
      } catch (err) {
        setError(err.message || 'Error occurred while searching');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm, page, setSearchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500 min-h-screen flex flex-col">
      {/* Search Header */}
      <div className="bg-surface border border-border rounded-card p-10 mb-12 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-muted">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-accent">Search Results</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter">
          Global <span className="text-accent italic">Search</span>
        </h1>
        
        <div className="max-w-2xl relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
               setSearchTerm(e.target.value);
               setPage(1);
            }}
            placeholder="Search keywords, categories, or authors..."
            className="w-full bg-bg border-2 border-border/60 hover:border-accent focus:border-accent rounded-input py-4 pl-12 pr-4 text-lg font-medium transition-all focus:outline-none focus:ring-4 focus:ring-accent/10"
          />
          <Search className="absolute left-4 top-5 h-6 w-6 text-muted" />
          {loading && <Loader2 className="absolute right-4 top-5 h-6 w-6 text-accent animate-spin" />}
        </div>
        
        <p className="text-sm font-bold uppercase tracking-widest text-muted">
          {error ? 'Search failed' : loading ? 'Searching...' : `Found results for "${searchTerm || 'everything'}"`}
        </p>
      </div>

      {error ? (
        <div className="text-center py-24 bg-surface border border-dashed border-red-500/30 rounded-card">
          <h2 className="text-2xl font-display font-black text-red-500 mb-4 italic">Error</h2>
          <p className="text-muted">{error}</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 flex-grow">
            {loading 
              ? Array(limit).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : results.map(a => <NewsCard key={a._id || a.id} article={{...a, id: a._id || a.id, imageUrl: a.image}} />)
            }
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-8 border-t border-border mt-auto">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-accent hover:text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <span className="text-sm font-black text-muted">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-accent hover:text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : !loading ? (
        <div className="text-center py-24 bg-surface/50 border-2 border-dashed border-border rounded-card">
          <div className="p-6 rounded-full bg-accent/10 inline-block mb-6">
            <Search className="h-12 w-12 text-accent" />
          </div>
          <h2 className="text-3xl font-display font-black mb-2 italic">Null Results.</h2>
          <p className="text-muted text-lg max-w-sm mx-auto">We couldn't find anything matching your query. Try broadening your terms or checking different categories.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setPage(1);
            }} 
            className="mt-8 px-8 py-3 bg-accent text-white font-black uppercase tracking-widest rounded-input shadow-lg shadow-accent/20 hover:-translate-y-1 transition-all"
          >
            Clear Search
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SearchPage;
