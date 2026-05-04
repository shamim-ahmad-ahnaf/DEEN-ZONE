import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Bookmark, BookmarkCheck } from 'lucide-react';
import { surahs } from '../data/quran';
import { useLocalStorage } from '../hooks/useLocalStorage';

import { useLanguage } from '../contexts/LanguageContext';

export default function Quran() {
  const { t } = useLanguage();
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>('quran_bookmarks', []);

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-800 rounded-[2.5rem] p-8 text-white flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">{t.quran.title}</h1>
          <p className="text-emerald-100 italic">{t.quran.subtitle}</p>
        </div>
        <BookOpen size={120} className="absolute -right-8 -top-8 opacity-10 rotate-12" />
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder={t.quran.search}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
        />
      </div>

      <div className="grid gap-3">
        {surahs.map((surah, i) => {
          const isBookmarked = bookmarks.includes(surah.number);
          return (
            <motion.div 
              key={surah.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-4 md:p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-emerald-200 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 text-emerald-700 rounded-lg md:rounded-xl flex items-center justify-center font-black rotate-45 group-hover:rotate-0 transition-transform">
                  <span className="text-xs md:text-sm -rotate-45 group-hover:rotate-0 transition-transform">{surah.number}</span>
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-800">{surah.englishName}</h3>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                    {surah.revelationType} • {surah.numberOfAyahs} {t.quran.ayahs}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-4">
                <button 
                  onClick={(e) => toggleBookmark(e, surah.number)}
                  className={`p-2 rounded-xl transition-colors ${isBookmarked ? 'bg-gold-50 text-gold-500 shadow-sm' : 'text-slate-300 hover:bg-slate-50'}`}
                >
                  {isBookmarked ? <BookmarkCheck size={18} className="md:w-5 md:h-5" /> : <Bookmark size={18} className="md:w-5 md:h-5" />}
                </button>
                <div className="text-right">
                  <span className="arabic-text text-xl md:text-2xl text-emerald-900 font-bold block mb-1">
                    {surah.name}
                  </span>
                  <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">{surah.englishNameTranslation}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
