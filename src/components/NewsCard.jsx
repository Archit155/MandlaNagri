import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { useDynamicTranslate } from '../hooks/useDynamicTranslate';
import { useTranslation } from 'react-i18next';

const NewsCard = ({ article }) => {
  const { t } = useTranslation();
  const { translatedText: title } = useDynamicTranslate(article.title);
  const { translatedText: description } = useDynamicTranslate(article.description);
  const { translatedText: categoryName } = useDynamicTranslate(article.category);
  return (
    <Link 
      to={`/article/${article.id}`} 
      className="group flex flex-col bg-surface border border-border rounded-card overflow-hidden news-card-hover"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={article.images && article.images.length > 0 ? `http://localhost:5000${article.images[0]}` : undefined}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover image-zoom-hover"
        />
        <span className="absolute top-3 left-3 bg-accent text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-badge shadow-lg">
          {categoryName}
        </span>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-xl font-display font-bold leading-tight group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {title}
        </h3>
        <p className="text-muted text-sm line-clamp-2 mb-4 flex-1">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-[11px] font-medium text-muted uppercase tracking-wider pt-4 border-t border-border/50">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{typeof article.author === 'object' ? article.author?.name : (article.author || 'Unknown')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
