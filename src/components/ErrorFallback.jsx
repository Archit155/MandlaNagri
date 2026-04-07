import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-12">
      <div className="max-w-md w-full bg-surface border border-border p-10 rounded-card shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/20 mb-4">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-display font-black tracking-tight uppercase italic underline decoration-red-500/30 decoration-4 underline-offset-8">
            System Error
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            Something unexpected happened. We've logged the error and our team has been notified.
          </p>
          {error && (
            <div className="p-4 bg-bg rounded-xl border border-border overflow-hidden">
              <code className="text-[10px] text-red-400 font-mono break-all line-clamp-2">
                {error.message}
              </code>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center justify-center space-x-2 bg-accent text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          
          <Link
            to="/"
            onClick={resetErrorBoundary}
            className="flex items-center justify-center space-x-2 bg-surface border border-border text-text py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-bg transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
