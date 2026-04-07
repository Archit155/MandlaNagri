import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { useDynamicTranslate } from '../hooks/useDynamicTranslate';
import { useTranslation } from 'react-i18next';

const FeaturedBanner = ({ article }) => {
  const { t } = useTranslation();
  
  if (!article) return null;

  const { translatedText: title } = useDynamicTranslate(article.title);
  const { translatedText: description } = useDynamicTranslate(article.description);
  const { translatedText: categoryName } = useDynamicTranslate(article.category);
  
  return (
    <Link 
      to={`/article/${article.id}`} 
      className="group relative block w-full aspect-[21/9] md:aspect-[24/10] bg-surface border border-border rounded-card overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-accent/10"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={article.imageUrl || undefined} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-10 text-white max-w-4xl">
        <div className="flex items-center space-x-3 mb-4">
          <span className="bg-accent px-3 py-1 rounded-badge text-[11px] uppercase font-black tracking-widest">
            {categoryName}
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-white/80 font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>{t('article.readTime', { count: article.readTime })}</span>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight mb-4 group-hover:underline decoration-accent underline-offset-8">
          {title}
        </h2>

        <div className="flex items-center justify-between">
          <p className="text-base md:text-lg text-white/90 line-clamp-2 pr-10">
            {description}
          </p>
          <div className="hidden md:flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 transition-all group-hover:bg-accent group-hover:border-transparent group-hover:px-6">
            <span className="text-sm font-bold uppercase tracking-wider">{t('article.readStory')}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedBanner;
