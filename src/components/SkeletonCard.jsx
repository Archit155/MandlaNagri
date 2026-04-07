import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="flex flex-col bg-surface border border-border rounded-card overflow-hidden h-full">
      <div className="aspect-[16/9] bg-muted/20 animate-pulse relative">
        <div className="absolute top-3 left-3 h-6 w-16 bg-muted/30 rounded-badge" />
      </div>
      
      <div className="p-4 flex flex-col flex-1 space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-full bg-muted/20 animate-pulse rounded" />
          <div className="h-6 w-2/3 bg-muted/20 animate-pulse rounded" />
        </div>
        
        <div className="space-y-2 flex-1">
          <div className="h-4 w-full bg-muted/10 animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted/10 animate-pulse rounded" />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="h-3 w-20 bg-muted/10 animate-pulse rounded" />
          <div className="h-3 w-16 bg-muted/10 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
