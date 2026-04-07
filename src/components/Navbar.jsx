import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X, LogOut, PlusCircle, LayoutDashboard, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ConfirmModal from './ConfirmModal';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const { t, i18n } = useTranslation();
  const isAuthor = hasRole(['admin', 'employee']);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(['All']);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCategories()
      .then(res => {
        if (res.success) {
          setCategories(['All', ...res.data]);
        }
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    toast('Signed out safely. See you soon!', { icon: '👋' });
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg border-b border-border transition-colors duration-300">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={(e) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // If already on homepage, fetch fresh layout
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.location.reload();
              }
            }}
            className="flex items-center transition-transform hover:scale-105"
          >
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-accent italic">
              LOCAL<span className="text-text not-italic">NEWZ</span>
            </h1>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-input py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 mr-6">
            <Link to="/" className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
              {t('about.title')}
            </Link>
            <Link to="/contact" className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
              {t('contact.title')}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
              className="px-3 py-1.5 rounded-full hover:bg-surface text-xs font-black tracking-widest transition-colors flex items-center space-x-1"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              <span>{i18n.language === 'en' ? 'EN' : 'HI'}</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full hover:bg-surface transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                {/* Author-only: Write Article */}
                {isAuthor && (
                  <Link to="/create-article" className="flex items-center space-x-1 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
                    <PlusCircle className="h-4 w-4" />
                    <span>{t('nav.create')}</span>
                  </Link>
                )}

                {/* Dashboard link */}
                <Link to="/dashboard" className="flex items-center space-x-1 text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>

                {/* Avatar + Logout */}
                <div className="relative group p-1 ring-2 ring-accent/20 rounded-full cursor-pointer overflow-hidden h-9 w-9 bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" onClick={() => setShowLogoutModal(true)}>
                    <LogOut className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-black uppercase tracking-widest px-4 py-2 hover:text-accent transition-colors"
                >
                  {t('auth.signIn')}
                </Link>
                <Link
                  to="/join"
                  className="bg-accent text-white text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {t('nav.join')}
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-surface transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Bar (Desktop) */}
      <div className="hidden md:block border-t border-border bg-surface/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 h-10 items-center overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={cat === 'All' ? '/category/all' : `/category/${cat.toLowerCase()}`}
                className="text-xs font-bold text-muted hover:text-accent uppercase tracking-widest whitespace-nowrap transition-colors py-2"
              >
                {t(`nav.categories.${cat.toLowerCase()}`, cat)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-bg border-t border-border absolute w-full shadow-xl animate-in slide-in-from-top duration-300 pb-8">
          <div className="px-4 pt-2 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-input py-3 pl-10 pr-4 focus:outline-none"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted" />
            </form>

            {isAuthenticated ? (
              <div className="mb-6 pb-6 border-b border-border space-y-3">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-muted uppercase tracking-widest font-black">{user?.role}</p>
                  </div>
                </div>

                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 py-3 bg-surface border border-border text-muted rounded-xl font-bold uppercase tracking-widest text-xs">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {isAuthor && (
                  <Link to="/create-article" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 py-3 bg-accent/10 text-accent rounded-xl font-bold uppercase tracking-widest text-xs">
                    <PlusCircle className="h-4 w-4" />
                    <span>{t('nav.create')}</span>
                  </Link>
                )}

                <button onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-border rounded-xl font-bold uppercase tracking-widest text-xs hover:border-red-500 hover:text-red-500 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>{t('auth.signOut')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center py-4 border border-border rounded-xl font-bold uppercase tracking-widest text-xs hover:border-accent transition-colors">
                  {t('auth.signIn')}
                </Link>
                <Link to="/join" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs">
                  {t('nav.join')}
                </Link>
              </div>
            )}

            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={cat === 'All' ? '/category/all' : `/category/${cat.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-surface hover:text-accent transition-colors"
                >
                  {t(`nav.categories.${cat.toLowerCase()}`, cat)}
                </Link>
              ))}
              
              <div className="pt-6 mt-6 border-t border-border space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-sm font-black uppercase tracking-widest text-accent hover:bg-surface transition-colors"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-sm font-black uppercase tracking-widest text-accent hover:bg-surface transition-colors"
                >
                  {t('about.title')}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-sm font-black uppercase tracking-widest text-accent hover:bg-surface transition-colors"
                >
                  {t('contact.title')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title={t('auth.signOut')}
        message={t('dashboard.signOutConfirm')}
        confirmText={t('auth.signOut')}
        type="danger"
      />
    </nav>
  );
};

export default Navbar;
