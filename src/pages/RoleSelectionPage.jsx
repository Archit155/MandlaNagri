import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, PenTool, ShieldCheck, ChevronRight } from 'lucide-react';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter italic">
          Join the <span className="text-accent underline decoration-4 underline-offset-8">Network.</span>
        </h1>
        <p className="text-muted text-lg max-w-lg mx-auto">
          Choose your path. Whether you're here to read or here to write, we have a place for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Path */}
        <button 
          onClick={() => navigate('/signup')}
          className="group relative bg-surface border-2 border-border hover:border-accent p-10 rounded-card text-left transition-all hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="p-4 bg-accent/10 rounded-full inline-block mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
            <User className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-display font-black mb-2">Continue as Reader</h2>
          <p className="text-muted leading-relaxed mb-8 text-sm">
            Access hyper-local stories, follow your favorite categories, and stay informed on community highlights.
          </p>
          <div className="flex items-center text-xs font-black uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform">
            Get Started <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </button>

        {/* Employee Path */}
        <button 
          onClick={() => navigate('/signup?mode=employee')}
          className="group relative bg-surface border-2 border-border hover:border-accent p-10 rounded-card text-left transition-all hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="p-4 bg-accent/10 rounded-full inline-block mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
            <PenTool className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-display font-black mb-2">Continue as Author</h2>
          <p className="text-muted leading-relaxed mb-8 text-sm">
            Publish stories, manage your articles, and contribute to the local narrative. Requires invite code.
          </p>
          <div className="flex items-center text-xs font-black uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform">
            Apply Now <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </button>

        {/* Admin Path */}
        <button 
          onClick={() => navigate('/login')}
          className="group relative bg-surface border-2 border-border hover:border-red-500/50 p-10 rounded-card text-left transition-all hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="p-4 bg-red-500/10 rounded-full inline-block mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-display font-black mb-2">Administrator</h2>
          <p className="text-muted leading-relaxed mb-8 text-sm">
            Control platform operations, manage all content, and issue employee invitations. Requires existing credentials.
          </p>
          <div className="flex items-center text-xs font-black uppercase tracking-widest text-red-500 group-hover:translate-x-2 transition-transform">
            Secure Login <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
