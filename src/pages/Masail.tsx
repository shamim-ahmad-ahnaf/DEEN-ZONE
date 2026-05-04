import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ChevronDown, ChevronUp, Filter, HelpCircle } from 'lucide-react';
import { masails, Masail as MasailType } from '../data/educational';

import { useLanguage } from '../contexts/LanguageContext';

const MasailAccordion: React.FC<{ item: MasailType }> = ({ item }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const question = language === 'bn' ? item.question_bn : item.question;
  const answer = language === 'bn' ? item.answer_bn : item.answer;
  const category = language === 'bn' ? item.category_bn : item.category;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
             <HelpCircle size={20} />
          </div>
          <h3 className="font-bold text-slate-800 leading-snug">{question}</h3>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-slate-400`}>
          <ChevronDown size={20} />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-50"
          >
            <div className="p-6 pt-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-2 py-1 rounded">
                  {category}
                </span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.masail.answerLabel}</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Masail() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'All' | MasailType['category']>('All');
  
  const filteredMasail = masails.filter(m => 
    activeFilter === 'All' || m.category === activeFilter
  );

  const filters: ('All' | MasailType['category'])[] = ['All', 'Taharah', 'Salah', 'Zakat', 'Fasting'];

  return (
    <div className="space-y-8">
      <section className="bg-emerald-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.nav.masail}</h1>
          <p className="text-emerald-100 opacity-80 italic">{t.masail.subtitle}</p>
        </div>
        <MessageSquare size={120} className="absolute -right-10 -bottom-10 opacity-10 -rotate-12" />
      </section>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
        <div className="flex-shrink-0 p-2 bg-slate-100 rounded-xl text-slate-500">
          <Filter size={18} />
        </div>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeFilter === f 
              ? 'bg-emerald-900 text-white shadow-lg' 
              : 'bg-white text-slate-500 border border-slate-100 hover:border-emerald-200'
            }`}
          >
            {f === 'All' ? t.articles.all : (language === 'bn' ? masails.find(m => m.category === f)?.category_bn || f : f)}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {filteredMasail.map((item) => (
          <MasailAccordion key={item.id} item={item} />
        ))}
        {filteredMasail.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
            {t.masail.noRulings}
          </div>
        )}
      </div>

      <div className="bg-gold-50 border border-gold-100 rounded-3xl p-6 flex flex-col items-center text-center">
         <div className="p-3 bg-gold-100 text-gold-700 rounded-2xl mb-4">
            <MessageSquare size={24} />
         </div>
         <h3 className="font-bold text-emerald-950 mb-1">{t.masail.askTitle}</h3>
         <p className="text-sm text-emerald-800/70 mb-4 px-8 leading-relaxed">
           {t.masail.askDesc}
         </p>
         <button className="bg-emerald-900 text-white font-bold px-8 py-3 rounded-2xl hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-900/10">
           {t.masail.askBtn}
         </button>
      </div>
    </div>
  );
}
