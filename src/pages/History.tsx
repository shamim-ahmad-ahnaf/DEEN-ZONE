import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, Calendar, ChevronRight, X } from 'lucide-react';
import { historyEvents, HistoryEvent } from '../data/history';

import { useLanguage } from '../contexts/LanguageContext';

export default function History() {
  const { t } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);

  return (
    <div className="space-y-8 pb-20">
      <section className="bg-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.history.title}</h1>
          <p className="text-emerald-200">{t.history.subtitle}</p>
        </div>
        <Landmark size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </section>

      <div className="grid gap-6">
        {historyEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 4 }}
            onClick={() => setSelectedEvent(event)}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row cursor-pointer group"
          >
            <div className="h-48 md:h-auto md:w-56 flex-shrink-0 relative">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-emerald-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {event.type}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center gap-2">
              <div className="flex items-center gap-2 text-gold-600 font-bold text-xs uppercase tracking-[0.2em]">
                <Calendar size={14} />
                <span>{event.period}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 italic">{event.summary}</p>
              <div className="pt-2 flex items-center gap-1 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                {t.history.readFullStory} <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-white rounded-[2.5rem] shadow-2xl z-[110] overflow-y-auto custom-scrollbar"
            >
              <div className="sticky top-0 right-0 p-6 flex justify-end z-20 pointer-events-none">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 bgl-slate-100 rounded-full text-slate-500 pointer-events-auto hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 md:p-12 space-y-6 -mt-12">
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg mb-8">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                      {selectedEvent.type}
                    </span>
                    <span className="px-3 py-1 bg-gold-50 text-gold-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                      {selectedEvent.period}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-800">{selectedEvent.title}</h2>
                </div>

                <div className="space-y-6">
                  <p className="text-slate-600 text-lg leading-loose">
                    {selectedEvent.content}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Islamic history is filled with moments of divine intervention, human resilience, and a commitment to justice. This event serves as a reminder of the values that define our deen and the legacy we carry forward today.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
