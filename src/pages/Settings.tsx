import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Type, Bell, Globe } from 'lucide-react';
import { Card } from '../components/common/Card';
import { SectionTitle } from '../components/common/SectionTitle';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLanguage } from '../contexts/LanguageContext';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('deen_zone_theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage<number>('deen_zone_font_size', 16);
  const [notifications, setNotifications] = useLocalStorage<boolean>('deen_zone_notifications', true);

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">{t.settings.title}</h1>
          <p className="text-emerald-100 italic">{t.settings.customizeDesc}</p>
        </div>
        <SettingsIcon size={120} className="absolute -right-8 -top-8 opacity-10 rotate-12" />
      </div>

      <div className="grid gap-6">
        <Card>
          <SectionTitle 
            title={t.settings.appearance} 
            subtitle={t.settings.appearanceDesc} 
            className="mb-8"
          />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-700">
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{t.settings.theme}</p>
                  <p className="text-xs text-slate-400 font-medium">{t.settings.themeDesc}</p>
                </div>
              </div>
              <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                <button 
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-400'}`}
                >
                  {t.settings.light}
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-400'}`}
                >
                  {t.settings.dark}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-700">
                  <Type size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{t.settings.fontSize}</p>
                  <p className="text-xs text-slate-400 font-medium italic">{t.settings.current}: {fontSize}px</p>
                </div>
              </div>
              <input 
                type="range" 
                min="14" 
                max="24" 
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-32 accent-emerald-700"
              />
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle 
            title={t.settings.preferences} 
            subtitle={t.settings.prefDesc} 
            className="mb-8"
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Bell size={20} />
                </div>
                <span className="font-bold text-slate-700">{t.settings.notifications}</span>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-emerald-700' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gold-50 text-gold-600 rounded-xl">
                  <Globe size={20} />
                </div>
                <span className="font-bold text-slate-700">{t.settings.language}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    language === 'bn' 
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-md' 
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <span className="text-2xl font-black">অ</span>
                  <span className="text-xs font-bold uppercase tracking-widest">{t.settings.bengali}</span>
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    language === 'en' 
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-md' 
                      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <span className="text-2xl font-black">A</span>
                  <span className="text-xs font-bold uppercase tracking-widest">{t.settings.english}</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
