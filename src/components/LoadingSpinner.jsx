import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullPage = false, message = 'Loading stories...' }) => {
  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full scale-150 animate-pulse" />
          <Loader2 className="h-12 w-12 text-accent animate-spin relative" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted animate-pulse">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 text-accent animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
