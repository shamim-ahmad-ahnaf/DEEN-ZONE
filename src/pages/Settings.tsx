import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Type, 
  Bell, 
  Globe, 
  User, 
  ShieldCheck, 
  Info, 
  CheckCircle2,
  Monitor,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/common/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLanguage } from '../contexts/LanguageContext';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('deen_zone_theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage<number>('deen_zone_font_size', 16);
  
  // Notification States
  const [pNotifications, setPNotifications] = useLocalStorage<boolean>('dz_notify_prayer', true);
  const [dNotifications, setDNotifications] = useLocalStorage<boolean>('dz_notify_daily', true);
  const [rNotifications, setRNotifications] = useLocalStorage<boolean>('dz_notify_ramadan', true);

  // Profile State
  const [userName, setUserName] = useLocalStorage<string>('dz_user_name', '');
  const [userEmail, setUserEmail] = useLocalStorage<string>('dz_user_email', '');
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-10 pb-32">
      {/* Header Section */}
      <div className="bg-emerald-800 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
        <div className="relative z-10 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-4 border border-white/10 backdrop-blur-md"
          >
             <SettingsIcon size={14} className="text-emerald-300 animate-spin-slow" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.settings.title}</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-3 uppercase tracking-tighter leading-none">{t.settings.title}</h1>
          <p className="text-emerald-100 italic opacity-80 text-sm md:text-lg max-w-md">{t.settings.subtitle}</p>
        </div>
        <div className="mt-8 md:mt-0 relative z-10 w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 backdrop-blur-xl rotate-6 hover:rotate-0 transition-transform duration-500">
           <SettingsIcon size={80} className="text-white opacity-20" />
        </div>
        {/* Background blobs */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px]" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-4xl mx-auto grid gap-8">
        
        {/* Profile Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl shadow-sm">
              <User size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{t.settings.profile.title}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Personalize Identity</p>
            </div>
          </div>
          <Card className="p-8 border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)] group overflow-hidden relative">
            <form onSubmit={handleSaveProfile} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t.settings.profile.name}</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{t.settings.profile.email}</label>
                  <input 
                    type="email" 
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="example@deen.com"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {t.settings.profile.save}
                </motion.button>
              </div>
            </form>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <User size={120} />
            </div>
          </Card>
        </motion.section>

        {/* Appearance Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl shadow-sm">
              <Monitor size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{t.settings.appearance.title}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.settings.appearance.desc}</p>
            </div>
          </div>
          <Card className="p-8 border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)] space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl border border-slate-100">
                    <Monitor size={20} />
                  </div>
                  <span className="font-bold text-slate-700">{t.settings.appearance.theme}</span>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] border border-slate-200 shadow-inner">
                  {[
                    { id: 'light', icon: Sun, label: t.settings.appearance.light },
                    { id: 'dark', icon: Moon, label: t.settings.appearance.dark },
                    { id: 'system', icon: Globe, label: t.settings.appearance.system }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${theme === item.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <item.icon size={14} />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl border border-slate-100">
                    <Type size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">{t.settings.appearance.fontSize}</span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {fontSize}px - {fontSize <= 16 ? t.settings.appearance.small : fontSize <= 20 ? t.settings.appearance.medium : t.settings.appearance.large}
                    </span>
                  </div>
                </div>
                <div className="flex-1 max-w-[200px]">
                  <input 
                    type="range" 
                    min="14" 
                    max="28" 
                    step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="font-bold text-slate-800 text-center opacity-60 flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em]">{t.settings.appearance.current} Preview</span>
                  <span style={{ fontSize: `${fontSize}px` }} className="italic transition-all duration-300">
                    {language === 'bn' ? '"নিশ্চয়ই কষ্টের সাথে স্বস্তি রয়েছে"' : '"Indeed, with hardship, there is ease"'}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Notifications Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl shadow-sm">
              <Bell size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{t.settings.notifications.title}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.settings.notifications.desc}</p>
            </div>
          </div>
          <Card className="p-8 border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)] space-y-6">
            {[
              { id: 'prayer', label: t.settings.notifications.prayer, state: pNotifications, setter: setPNotifications },
              { id: 'daily', label: t.settings.notifications.daily, state: dNotifications, setter: setDNotifications },
              { id: 'ramadan', label: t.settings.notifications.ramadan, state: rNotifications, setter: setRNotifications }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <span className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors uppercase text-xs tracking-widest">{item.label}</span>
                <button 
                  onClick={() => item.setter(!item.state)}
                  className={`w-14 h-7 rounded-full transition-all relative outline-none ${item.state ? 'bg-emerald-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md flex items-center justify-center ${item.state ? 'left-8' : 'left-1'}`}>
                    {item.state && <Check size={12} className="text-emerald-600" />}
                  </div>
                </button>
              </div>
            ))}
          </Card>
        </motion.section>

        {/* General Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="p-2.5 bg-slate-100 text-slate-700 rounded-2xl shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{t.settings.general.title}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Configuration & Info</p>
            </div>
          </div>
          <Card className="p-8 border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)] space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Globe size={18} className="text-slate-400" />
                <span className="font-bold text-slate-700 text-xs uppercase tracking-widest">{t.settings.general.language}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`p-5 rounded-[1.5rem] border-2 transition-all flex items-center justify-between group ${
                    language === 'bn' 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-md' 
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black">অ</span>
                    <span className="text-xs font-bold uppercase tracking-widest">{t.settings.general.bengali}</span>
                  </div>
                  {language === 'bn' && <CheckCircle2 size={20} className="text-emerald-600" />}
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-5 rounded-[1.5rem] border-2 transition-all flex items-center justify-between group ${
                    language === 'en' 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-md' 
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black">A</span>
                    <span className="text-xs font-bold uppercase tracking-widest">{t.settings.general.english}</span>
                  </div>
                  {language === 'en' && <CheckCircle2 size={20} className="text-emerald-600" />}
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 grid gap-4">
              <button className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                <div className="flex items-center gap-4">
                  <Info size={18} className="text-slate-400" />
                  <span className="font-bold text-slate-700 text-xs uppercase tracking-widest">{t.settings.general.about}</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 opacity-60 group-hover:opacity-100 tracking-[0.2em] uppercase">{t.settings.general.version}</span>
              </button>
              <button className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                <div className="flex items-center gap-4">
                  <ShieldCheck size={18} className="text-slate-400" />
                  <span className="font-bold text-slate-700 text-xs uppercase tracking-widest">{t.settings.general.privacy}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
              </button>
            </div>
          </Card>
        </motion.section>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-900 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3 z-50 border border-white/10 backdrop-blur-xl"
          >
            <CheckCircle2 className="text-emerald-400" size={24} />
            <span className="font-black text-xs uppercase tracking-widest">{t.settings.success}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
