import { NavLink } from 'react-router-dom';
import { Home, Clock, BookOpen, MessageSquare, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';

import { useLanguage } from '../../contexts/LanguageContext';

export const BottomNav = () => {
  const { t } = useLanguage();
  
  const mobileNavItems = [
    { path: '/', label: t.nav.home, icon: Home },
    { path: '/prayer', label: t.nav.prayer, icon: Clock },
    { path: '/quran', label: t.nav.quran, icon: BookOpen },
    { path: '/hadith', label: t.nav.hadith, icon: MessageSquare },
    { path: '/tasbih', label: t.nav.tasbih, icon: Fingerprint },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 flex justify-around items-center px-1 py-1.5 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center gap-1 py-1 px-2 transition-all relative rounded-xl flex-1
            ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'}
          `}
        >
          {({ isActive }) => (
            <>
              <motion.div
                animate={isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <item.icon size={21} strokeWidth={isActive ? 2.5 : 1.8} />
              </motion.div>
              <span className={`text-[9px] tracking-tight font-medium font-display transition-all ${isActive ? 'text-emerald-800 font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
