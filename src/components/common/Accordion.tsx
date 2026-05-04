import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useToggle } from '../../hooks/useToggle';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, id }) => {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div id={id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4">
      <button
        onClick={toggle}
        className="w-full p-6 cursor-pointer flex items-center justify-between gap-4 select-none hover:bg-slate-50 transition-colors"
      >
        <span className="text-left font-bold text-slate-800">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-slate-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-slate-50">
              <div className="text-slate-600 leading-relaxed">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
