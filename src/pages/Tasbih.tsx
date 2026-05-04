import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion } from 'motion/react';
import { Fingerprint, RotateCcw } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

export default function Tasbih() {
  const { t } = useLanguage();
  const [count, setCount] = useLocalStorage<number>('tasbih_count', 0);
  const [target, setTarget] = useLocalStorage<number>('tasbih_target', 33);

  const increment = () => {
    setCount(prev => prev + 1);
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const reset = () => {
    if (count > 0) {
      setCount(0);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 md:space-y-8 flex flex-col items-center justify-center py-4 md:py-12">
      <div className="text-center px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-1">{t.tasbih.title}</h1>
        <p className="text-sm md:text-base text-slate-500">{t.tasbih.subtitle}</p>
      </div>

      <div className="flex gap-2 md:gap-4 overflow-x-auto w-full justify-center px-4 pb-2">
        {[33, 99, 100, 1000].map(t_val => (
          <button
            key={t_val}
            onClick={() => setTarget(t_val)}
            className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all flex-shrink-0 ${
              target === t_val ? 'bg-emerald-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {t_val}
          </button>
        ))}
      </div>

      <motion.div 
        onClick={increment}
        whileTap={{ scale: 0.95 }}
        className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 md:border-8 border-emerald-50 cursor-pointer active:bg-emerald-50/30 transition-colors"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-center">
          <motion.span 
            key={count}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="block text-6xl md:text-7xl font-black text-emerald-900 tabular-nums"
          >
            {count}
          </motion.span>
          <span className="text-[10px] md:text-sm text-slate-400 font-black uppercase tracking-widest">{t.tasbih.goal}: {target}</span>
        </div>
        
        {/* Progress Circle Visual */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="50%"
            cy="50%"
            r="46%"
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="46%"
            fill="transparent"
            stroke="#10b981"
            strokeWidth="8"
            strokeDasharray="290%"
            strokeDashoffset={`${290 - (290 * Math.min(count, target)) / target}%`}
            strokeLinecap="round"
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
        </svg>
      </motion.div>

      <div className="flex gap-4 w-full px-4">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 p-4 md:p-5 bg-white border border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-colors text-sm md:text-base"
        >
          <RotateCcw size={18} />
          {t.tasbih.reset}
        </button>
        <button
          onClick={increment}
          className="flex-[2] flex items-center justify-center gap-2 p-4 md:p-5 bg-emerald-900 text-white rounded-2xl font-bold hover:bg-emerald-800 shadow-xl transition-all active:scale-[0.98] border-b-4 border-emerald-950 text-sm md:text-base"
        >
          <Fingerprint size={20} />
          {t.tasbih.count}
        </button>
      </div>

      <div className="px-4 w-full">
        <div className="bg-emerald-50 border border-emerald-100 p-5 md:p-6 rounded-3xl w-full">
          <h3 className="font-bold text-emerald-900 mb-1 md:mb-2 text-sm md:text-base">{t.tasbih.benefit}</h3>
          <p className="text-xs md:text-sm text-emerald-800 italic leading-relaxed">
            {t.tasbih.benefitText}
            <span className="block mt-1 font-bold">{t.tasbih.benefitRef}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
