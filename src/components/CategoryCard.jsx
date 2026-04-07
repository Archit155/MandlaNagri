import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Landmark, Trophy, GraduationCap, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const icons = {
  Local: MapPin,
  Politics: Landmark,
  Sports: Trophy,
  Education: GraduationCap,
  Jobs: Briefcase,
};

const CategoryCard = ({ category, count }) => {
  const { t } = useTranslation();
  const Icon = icons[category] || MapPin;

  return (
    <Link 
      to={`/category/${category.toLowerCase()}`}
      className="group flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-card hover:bg-accent/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 shadow-sm"
    >
      <div className="p-4 rounded-full bg-accent/10 mb-4 group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-12">
        <Icon className="h-6 w-6 transition-transform" />
      </div>
      <h3 className="text-lg font-display font-black mb-1 group-hover:text-accent">
        {t(`nav.categories.${category.toLowerCase()}`, category)}
      </h3>
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
        {count} {t('home.loadMore').split(' ')[1] === 'Stories' ? 'Stories' : t('home.loadMore').split(' ')[1] || 'कहानियाँ'}
      </span>
    </Link>
  );
};

export default CategoryCard;
