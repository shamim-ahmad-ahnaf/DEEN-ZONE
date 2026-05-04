import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggle = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95 border border-emerald-100/50 shadow-sm"
      title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
    >
      <Languages size={16} />
      <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
    </button>
  );
};
