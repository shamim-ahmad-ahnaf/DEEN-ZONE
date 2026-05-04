import { motion } from 'motion/react';
import { Users, Mail, Globe, BookOpen } from 'lucide-react';
import { scholars } from '../data/scholars';

import { useLanguage } from '../contexts/LanguageContext';

export default function Scholars() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <section className="bg-gold-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.scholars.title}</h1>
          <p className="text-gold-50 opacity-90">{t.scholars.subtitle}</p>
        </div>
        <Users size={120} className="absolute -right-10 -bottom-10 opacity-10 -rotate-12" />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {scholars.map((scholar) => (
          <motion.div
            key={scholar.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner bg-slate-50">
                <img src={scholar.image} alt={scholar.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em]">
                  {scholar.title}
                </span>
                <h3 className="text-2xl font-bold text-slate-800 truncate">{scholar.name}</h3>
                <p className="text-emerald-700 font-bold text-sm">{scholar.era}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <BookOpen size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.scholars.biography}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic line-clamp-3">
                  {scholar.bio}
                </p>
              </div>

              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block mb-2">{t.scholars.majorContribution}</span>
                <p className="text-emerald-900 text-sm font-medium leading-relaxed">
                  {scholar.contribution}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 px-4 py-3 bg-emerald-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors">
                {t.scholars.fullProfile}
              </button>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                <Globe size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 text-slate-500 p-8 rounded-3xl text-center border border-slate-800">
         <p className="text-sm font-medium leading-relaxed max-w-md mx-auto">
           "The ink of the scholar is more holy than the blood of the martyr."
           <span className="block mt-2 font-black text-gold-500 uppercase tracking-widest">— Classical Wisdom</span>
         </p>
      </div>
    </div>
  );
}
