import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronRight, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { hadiths } from '../data/hadiths';
import { useLocalStorage } from '../hooks/useLocalStorage';

import { useLanguage } from '../contexts/LanguageContext';

export default function Hadith() {
  const { t, language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>('hadith_bookmarks', []);

  const nextHadith = () => {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * hadiths.length);
    } while (nextIdx === index && hadiths.length > 1);
    setIndex(nextIdx);
  };

  const currentHadith = hadiths[index];
  const isBookmarked = bookmarks.includes(currentHadith.id);

  const toggleBookmark = () => {
    setBookmarks(prev => 
      prev.includes(currentHadith.id) 
        ? prev.filter(b => b !== currentHadith.id) 
        : [...prev, currentHadith.id]
    );
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-emerald-900 uppercase tracking-tighter">{t.hadith.title}</h1>
        <p className="text-slate-500 font-medium italic">{t.hadith.subtitle}</p>
      </div>

      <div className="w-full max-w-2xl relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHadith.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden"
          >
            {/* Decorative background icon */}
            <div className="absolute -top-6 -right-6 text-emerald-50">
              <Quote size={120} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <Quote className="text-gold-500" size={32} />
                <button 
                  onClick={toggleBookmark}
                  className={`p-3 rounded-2xl transition-all active:scale-95 ${isBookmarked ? 'bg-gold-50 text-gold-500 shadow-inner' : 'bg-slate-50 text-slate-300 hover:text-slate-400'}`}
                >
                  {isBookmarked ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
                </button>
              </div>
              
              <blockquote className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed italic">
                "{language === 'bn' ? currentHadith.text_bn : currentHadith.text}"
              </blockquote>

              <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-emerald-700 font-black uppercase tracking-tight">
                    {t.hadith.narratedBy} {language === 'bn' ? currentHadith.narrator_bn : currentHadith.narrator}
                  </p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {language === 'bn' ? currentHadith.source_bn : currentHadith.source}
                  </p>
                </div>
                
                <button 
                  onClick={nextHadith}
                  className="flex items-center gap-2 bg-emerald-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                >
                  <RefreshCw size={18} className="animate-spin-slow" />
                  <span className="uppercase tracking-widest text-xs">{t.hadith.next}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Small Progress Dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {hadiths.map((_, i) => (
            <div 
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-gold-500' : 'w-1.5 bg-slate-200'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
