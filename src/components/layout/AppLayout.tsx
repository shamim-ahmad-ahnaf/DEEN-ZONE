import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { LanguageToggle } from '../common/LanguageToggle';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fontSize] = useLocalStorage<number>('deen_zone_font_size', 16);

  return (
    <div 
      className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-emerald-100 selection:text-emerald-900"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Mobile Header */}
      <header className="md:hidden glass backdrop-blur-xl p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-950 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-950/20">
            <img src="/icon.jpg" alt="Deen Zone Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase font-display text-slate-800">Deen Zone</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-3 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-95 transition-all"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop & Mobile Overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden pt-2 md:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="p-4 md:p-10 max-w-6xl mx-auto pb-24 md:pb-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
