import React from 'react';
import { Link } from 'react-router-dom';

import { useDynamicTranslate } from '../hooks/useDynamicTranslate';

const TrendingItem = ({ article, index }) => {
  const { translatedText: title } = useDynamicTranslate(article.title);
  const { translatedText: categoryName } = useDynamicTranslate(article.category);

  return (
    <Link 
      to={`/article/${article.id}`} 
      className="group flex items-start space-x-4 py-4 border-b border-border last:border-0 hover:bg-surface/50 px-2 rounded-lg transition-colors"
    >
      <span className="text-4xl font-display font-black text-accent/20 group-hover:text-accent/40 transition-colors tabular-nums leading-none pt-1">
        {(index + 1).toString().padStart(2, '0')}
      </span>
      
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent/80">
          {categoryName}
        </span>
        <h4 className="text-sm font-bold font-display leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h4>
        <span className="text-[10px] font-medium text-muted uppercase tracking-wider">
          {article.date} • {article.readTime}
        </span>
      </div>

    </Link>
  );
};

export default TrendingItem;
