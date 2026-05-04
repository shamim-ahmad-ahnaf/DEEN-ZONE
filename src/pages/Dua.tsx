import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { duas, Dua as DuaType } from '../data/duas';

import { useLanguage } from '../contexts/LanguageContext';

const DuaCard: React.FC<{ dua: DuaType }> = ({ dua }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div 
        className="p-6 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="space-y-1">
          <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full uppercase tracking-widest">
            {dua.category}
          </span>
          <h3 className="text-xl font-bold text-slate-800">{dua.title}</h3>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-300 hover:text-rose-500 transition-colors">
            <Heart size={20} />
          </button>
          <div className="p-2 bg-slate-50 rounded-full text-slate-400">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 space-y-6"
          >
            <p className="arabic-text text-3xl text-right leading-loose text-emerald-950 font-medium">
              {dua.arabic}
            </p>
            
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.dua.translation}</span>
                <p className="text-slate-600 text-sm leading-relaxed italic italic">
                  {dua.translation}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">বঙ্গানুবাদ</span>
                <p className="text-slate-800 text-base leading-relaxed font-medium">
                  {dua.bangla}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Dua() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDuas = duas.filter(dua => 
    dua.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dua.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-rose-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.dua.title}</h1>
          <p className="text-rose-100 opacity-80">{t.dua.subtitle}</p>
        </div>
        <Heart size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder={t.dua.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
        />
      </div>

      <div className="grid gap-4">
        {filteredDuas.map((dua) => (
          <DuaCard key={dua.id} dua={dua} />
        ))}
        {filteredDuas.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No duas found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
