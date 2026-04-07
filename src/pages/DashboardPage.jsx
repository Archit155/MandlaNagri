import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createInvite } from '../services/api';
import { PenTool, BookOpen, User, ShieldCheck, LogOut, ChevronRight, Key, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { user, logout, hasRole } = useAuth();
  const { t } = useTranslation();
  
  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isAdmin = hasRole('admin');
  const isEmployee = hasRole('employee');
  const isAuthor = isAdmin || isEmployee;

  const roleColor = isAdmin ? 'text-red-500' : isEmployee ? 'text-accent' : 'text-green-500';
  const roleBadge = isAdmin ? t('dashboard.roles.admin') : isEmployee ? t('dashboard.roles.author') : t('dashboard.roles.reader');

  const handleGenerateInvite = async () => {
    setInviteLoading(true);
    setCopied(false);
    try {
      const res = await createInvite({ role: 'employee', expiresInDays: 7 });
      if (res.success) {
        setGeneratedInvite(res.data.code);
        toast.success(t('dashboard.inviteSuccess'));
      }
    } catch (err) {
      console.error('Failed to generate invite');
    } finally {
      setInviteLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedInvite) {
      navigator.clipboard.writeText(generatedInvite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-in fade-in duration-500 space-y-12">
      {/* Header */}
      <div className="bg-surface border border-border rounded-card p-10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className={`inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest ${roleColor} bg-current/10 px-3 py-1 rounded-full`}>
            <ShieldCheck className="h-3 w-3" />
            <span className={roleColor}>{roleBadge}</span>
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight italic">
            {t('dashboard.welcomeBack', { name: user?.name?.split(' ')[0] })}
          </h1>
          <p className="text-muted text-sm">{user?.email}</p>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-muted hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('dashboard.signOut')}</span>
        </button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Read News — Available to all */}
        <Link
          to="/"
          className="group bg-surface border-2 border-border hover:border-accent p-8 rounded-card transition-all hover:shadow-xl hover:-translate-y-1"
        >
          <BookOpen className="h-8 w-8 mb-4 text-muted group-hover:text-accent transition-colors" />
          <h2 className="text-xl font-display font-black mb-2">{t('dashboard.readStories')}</h2>
          <p className="text-muted text-sm mb-4 leading-relaxed">{t('dashboard.readStoriesDesc')}</p>
          <div className="flex items-center text-xs font-black uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform">
            {t('dashboard.browseFeed')} <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Write Article — Admin & Employee only */}
        {isAuthor && (
          <Link
            to="/create-article"
            className="group bg-surface border-2 border-border hover:border-accent p-8 rounded-card transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <PenTool className="h-8 w-8 mb-4 text-muted group-hover:text-accent transition-colors" />
            <h2 className="text-xl font-display font-black mb-2">{t('dashboard.writeArticle')}</h2>
            <p className="text-muted text-sm mb-4 leading-relaxed">{t('dashboard.writeArticleDesc')}</p>
            <div className="flex items-center text-xs font-black uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform">
              {t('dashboard.startWriting')} <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        )}

        {/* Generate Invite - Admin Only */}
        {isAdmin && (
          <div className="bg-surface border-2 border-border hover:border-red-500/50 p-8 rounded-card transition-all group">
            <Key className="h-8 w-8 mb-4 text-muted group-hover:text-red-500 transition-colors" />
            <h2 className="text-xl font-display font-black mb-2">{t('dashboard.issueInvite')}</h2>
            <p className="text-muted text-sm mb-4 leading-relaxed">{t('dashboard.issueInviteDesc')}</p>
            
            {generatedInvite ? (
              <div className="animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <span className="font-mono text-sm font-bold text-red-500 tracking-wider uppercase">{generatedInvite}</span>
                  <button onClick={copyToClipboard} className="text-red-500 hover:text-red-600 transition-colors">
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-muted mt-2 font-bold">{t('dashboard.expiresIn')}</p>
              </div>
            ) : (
              <button 
                onClick={handleGenerateInvite}
                disabled={inviteLoading}
                className="flex flex-1 w-full items-center justify-center space-x-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors disabled:opacity-50"
              >
                {inviteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>{t('dashboard.generateCode')}</span>}
              </button>
            )}
          </div>
        )}

        {/* Profile */}
        <div className="bg-surface border-2 border-border p-8 rounded-card">
          <User className="h-8 w-8 mb-4 text-muted" />
          <h2 className="text-xl font-display font-black mb-2">{t('dashboard.yourProfile')}</h2>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted font-bold uppercase tracking-widest text-[10px]">{t('dashboard.name')}</span>
              <span className="font-bold truncate ml-4">{user?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted font-bold uppercase tracking-widest text-[10px]">{t('dashboard.role')}</span>
              <span className={`font-black uppercase text-[10px] tracking-widest ${roleColor}`}>{roleBadge}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted font-bold uppercase tracking-widest text-[10px]">{t('dashboard.email')}</span>
              <span className="font-bold text-xs truncate ml-2">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          toast(t('auth.signOutVerify'), { icon: '👋' });
          logout();
        }}
        title={t('dashboard.signOut')}
        message={t('dashboard.signOutConfirm') + " " + t('dashboard.signOutMessage')}
        confirmText={t('dashboard.signOut')}
        type="danger"
      />
    </div>
  );
};

export default DashboardPage;
