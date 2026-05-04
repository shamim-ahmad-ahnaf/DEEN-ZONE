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
    <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[2rem] flex justify-around p-2.5 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 p-2 transition-all relative rounded-2xl
            ${isActive ? 'text-emerald-800 bg-emerald-50/50' : 'text-slate-400'}
          `}
        >
          {({ isActive }) => (
            <>
              <motion.div
                animate={isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[8px] font-black uppercase tracking-widest font-display transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
