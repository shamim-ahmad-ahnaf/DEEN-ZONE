import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { language } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-inner z-50"
      >
        <WifiOff size={14} className="shrink-0 animate-pulse" />
        <span>
          {language === 'bn'
            ? 'অফলাইন মোড সক্রিয় — আল কুরআন ও হাদিস অফলাইনে পড়ুন'
            : 'Offline Mode Active — Read Quran & Hadith offline'}
        </span>
        <CheckCircle2 size={13} className="shrink-0 opacity-80" />
      </motion.div>
    </AnimatePresence>
  );
};
