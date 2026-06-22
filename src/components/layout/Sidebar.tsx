import { NavLink } from 'react-router-dom';
import { 
  Home, Clock, BookOpen, MessageSquare, Fingerprint, Heart, 
  FileText, HelpCircle, Users, Settings, Info, Play, Book, 
  Moon, Map, Mic2, X 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageToggle } from '../common/LanguageToggle';

export const getNavItems = (t: any) => [
  { path: '/', label: t.nav.home, icon: Home },
  { path: '/prayer', label: t.nav.prayer, icon: Clock },
  { path: '/quran', label: t.nav.quran, icon: BookOpen },
  { path: '/tilawat', label: t.nav.tilawat, icon: BookOpen },
  { path: '/hadith', label: t.nav.hadith, icon: MessageSquare },
  { path: '/tasbih', label: t.nav.tasbih, icon: Fingerprint },
  { path: '/dua', label: t.nav.dua, icon: Heart },
  { path: '/articles', label: t.nav.articles, icon: FileText },
  { path: '/masail', label: t.nav.masail, icon: Book },
  { path: '/history', label: t.nav.history, icon: Info },
  { path: '/scholars', label: t.nav.scholars, icon: Users },
  { path: '/qa', label: t.nav.qa, icon: HelpCircle },
  { path: '/quiz', label: t.nav.quiz, icon: Play },
  { path: '/audio', label: t.nav.audio, icon: Mic2 },
  { path: '/video', label: t.nav.video, icon: Play },
  { path: '/ramadan', label: t.nav.ramadan, icon: Moon },
  { path: '/hajj', label: t.nav.hajj, icon: Map },
  { path: '/books', label: t.nav.books, icon: Book },
  { path: '/settings', label: t.nav.settings, icon: Settings },
  { path: '/about', label: t.nav.about, icon: Info },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useLanguage();
  const navItems = getNavItems(t);

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-[100] w-[280px] bg-emerald-950 text-emerald-50 transform transition-transform duration-500 ease-[0.23, 1, 0.32, 1]
      md:relative md:translate-x-0 flex flex-col shadow-2xl
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 flex-1 flex flex-col h-full">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-950 border border-emerald-800 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-950/50">
              <img src="/icon.jpg" alt="Deen Zone Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase font-display">Deen Zone</h2>
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-emerald-100 hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="space-y-1 overflow-y-auto flex-1 custom-scrollbar -mr-2 pr-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-emerald-800 text-gold-400 shadow-inner' 
                  : 'hover:bg-emerald-900/50 text-emerald-100 hover:text-white'}
              `}
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-4 pt-4 border-t border-emerald-900 hidden md:block">
          <LanguageToggle />
        </div>
      </div>
    </aside>
  );
};
