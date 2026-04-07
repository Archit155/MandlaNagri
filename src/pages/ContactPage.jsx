import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Instagram, Facebook } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(t('contact.form.success'));
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section className="py-24 bg-surface border-b border-border relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter italic mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-muted font-medium max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.02]">
           <MessageSquare className="w-full h-full" />
        </div>
      </section>

      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-12">
            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center shadow-lg group-hover:border-accent transition-all">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted mb-2">{t('contact.office.title')}</h4>
                  <p className="text-sm font-bold text-text leading-relaxed">
                    {t('contact.office.address')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center shadow-lg group-hover:border-accent transition-all">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-muted mb-2">Technical Support</h4>
                   <p className="text-sm font-bold text-text">{t('contact.office.phone')}</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center shadow-lg group-hover:border-accent transition-all">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-muted mb-2">Email Address</h4>
                   <p className="text-sm font-bold text-text">newsroom@localnewz.com</p>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-border">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted mb-6">{t('contact.social')}</h4>
              <div className="flex gap-4">
                {[Twitter, Instagram, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all shadow-md">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-surface border border-border p-10 rounded-card shadow-2xl space-y-6 relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 italic">{t('contact.form.name')}</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-bg border border-border rounded-input py-4 px-5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold"
                    placeholder="Archit..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 italic">{t('contact.form.email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-bg border border-border rounded-input py-4 px-5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 italic">{t('contact.form.subject')}</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border rounded-input py-4 px-5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold"
                  placeholder="Inquiry about..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3 italic">{t('contact.form.message')}</label>
                <textarea 
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-bg border border-border rounded-input py-4 px-5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-bold resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-accent text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{t('contact.form.send')} <Send className="h-4 w-4" /></>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
