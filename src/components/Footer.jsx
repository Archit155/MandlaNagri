import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { fetchCategories } from '../services/api';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    fetchCategories()
      .then(res => {
        if (res.success) setCategories(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h2 className="text-2xl font-black tracking-tighter text-accent italic">
                LOCAL<span className="text-text not-italic">NEWZ</span>
              </h2>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.brandDesc')}
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-bg border border-border hover:bg-accent hover:text-white transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">{t('footer.categories')}</h3>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link to={`/category/${cat.toLowerCase()}`} className="text-muted hover:text-accent text-sm transition-colors">
                    {t(`nav.categories.${cat.toLowerCase()}`, cat)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">{t('footer.company')}</h3>
            <ul className="space-y-4">
              {[
                { name: t('footer.links.about'), path: '/about' },
                { name: t('footer.links.contact'), path: '/contact' },
                { name: t('footer.links.advertising'), path: '#' },
                { name: t('footer.links.privacy'), path: '#' },
                { name: t('footer.links.terms'), path: '#' }
              ].map((link) => (
                <li key={link.name}>
                  {link.path === '#' ? (
                    <a href={link.path} className="text-muted hover:text-accent text-sm transition-colors">
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.path} className="text-muted hover:text-accent text-sm transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">{t('footer.subscribe')}</h3>
            <p className="text-muted text-sm mb-4">{t('footer.subscribeDesc')}</p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t('footer.subscribePlaceholder')}
                  className="w-full bg-bg border border-border rounded-input py-2.5 pl-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
                <button className="absolute right-2 top-1.5 p-1 rounded-md bg-accent text-white hover:bg-accent/90 transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted italic">{t('footer.subscribeDisclaimer')}</p>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[11px] font-bold uppercase tracking-widest text-muted">
          <span>{t('footer.copyright')}</span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-accent transition-colors">{t('footer.links.accessibility')}</a>
            <a href="#" className="hover:text-accent transition-colors">{t('footer.links.ethics')}</a>
            <a href="#" className="hover:text-accent transition-colors">{t('footer.links.corrections')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
