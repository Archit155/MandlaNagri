import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Users, Eye, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Shield className="h-6 w-6 text-accent" />,
      title: t('about.values.integrity'),
      desc: t('about.values.integrityDesc')
    },
    {
      icon: <Users className="h-6 w-6 text-accent" />,
      title: t('about.values.community'),
      desc: t('about.values.communityDesc')
    },
    {
      icon: <Eye className="h-6 w-6 text-accent" />,
      title: t('about.values.accessibility'),
      desc: t('about.values.accessibilityDesc')
    }
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative py-24 bg-surface border-b border-border overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-accent blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-accent blur-[120px]" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-accent mb-4 block">
             Est. 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter italic mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted font-medium max-w-2xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-24 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-accent" /> {t('about.mission')}
              </h2>
              <p className="text-3xl font-display font-bold leading-tight">
                {t('about.missionDesc')}
              </p>
            </div>
            
            <div className="p-8 bg-surface border border-border rounded-card shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
               <h3 className="text-xl font-display font-black italic mb-4">{t('about.story')}</h3>
               <p className="text-muted leading-relaxed">
                 {t('about.storyContent')}
               </p>
            </div>
          </div>

          <div className="relative aspect-square rounded-card overflow-hidden shadow-2xl border border-border group">
            <img 
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop" 
              alt="Journalism" 
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
               <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-2 italic">Hyper-Local Narrative</p>
               <div className="h-1 w-12 bg-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-bg border-y border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <div key={i} className="space-y-4 group">
                <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center shadow-lg group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                  {v.icon}
                </div>
                <h4 className="text-lg font-display font-bold">{v.title}</h4>
                <p className="text-sm text-muted leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <div className="p-12 rounded-card bg-surface border border-border relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield className="h-48 w-48 text-accent" />
           </div>
           <h2 className="text-3xl font-display font-black italic mb-8 relative z-10">
              {t('home.heroTitleSmall')}
           </h2>
           <button className="bg-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-accent/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto relative z-10">
               Get Involved <ArrowRight className="h-4 w-4" />
           </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
