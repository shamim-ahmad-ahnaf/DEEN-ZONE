import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { useToggle } from '../hooks/useToggle';
import { qaItems, QAItem } from '../data/qa';

import { useLanguage } from '../contexts/LanguageContext';

const QAAccordion: React.FC<{ item: QAItem }> = ({ item }) => {
  const { t } = useLanguage();
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4">
      <div 
        onClick={toggleOpen}
        className="p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
             <HelpCircle size={20} />
          </div>
          <h3 className="font-bold text-slate-800 leading-snug">{item.question}</h3>
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
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.qa.answerLabel}</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function QA() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <section className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.qa.title}</h1>
          <p className="text-blue-100 opacity-80">{t.qa.subtitle}</p>
        </div>
        <MessageCircle size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </section>

      <div className="grid gap-2">
        {qaItems.map((item) => (
          <QAAccordion key={item.id} item={item} />
        ))}
      </div>
      
      <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <p className="text-slate-500 font-medium italic">{t.qa.moreBeingAnswered}</p>
      </div>
    </div>
  );
}
