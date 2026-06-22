import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, ArrowLeft, Loader2, Plus, Minus, 
  Sparkles, AlignRight, LayoutGrid, CheckCircle2,
  Bookmark, BookmarkCheck, Sliders, Play, RotateCcw,
  Sun, Moon, ZoomIn, ZoomOut, ChevronLeft, ChevronRight,
  Maximize2, Volume2, HelpCircle, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number; // Global number
  numberInSurah: number;
  text: string;
  surah?: {
    number: number;
    name: string;
    englishName: string;
  };
}

interface CDNConfig {
  id: string;
  name: string;
  nameBN: string;
  url: (paddedPage: string, pageNo: number) => string;
}

const REAL_PAGE_CDNS: CDNConfig[] = [
  { 
    id: 'emdadia_hafezi', 
    name: 'Emdadia Hafezi Quran', 
    nameBN: 'এমদাদিয়া হাফেজী কুরআন (হুবহু)',
    url: (p, n) => `https://archive.org/download/EmdadiaHafeziQuran/page/n${n}.jpg` 
  },
  { 
    id: 'hasan_sayyed', 
    name: 'Hafizi 15-Line Classic', 
    nameBN: 'হাফেজী ১৫-লাইন মদনী',
    url: (p, n) => `https://raw.githubusercontent.com/hasan-sayyed/Quran-images/master/images/page${p}.png` 
  },
  { 
    id: 'sajid_s', 
    name: 'Medina Standard Scan', 
    nameBN: 'মদিনা স্ট্যান্ডার্ড স্ক্যান',
    url: (p, n) => `https://raw.githubusercontent.com/Sajid-S/quran-images/master/images/page${p}.png` 
  }
];

// 611 Indo-Pak / Bengal Aligned Surah Start Pages (standard 15-line Hafezi representation)
const SURAH_START_PAGES: Record<number, number> = {
  1: 1, 2: 2, 3: 50, 4: 78, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
  11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
  31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
  71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
  81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
  91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
  101: 600, 102: 601, 103: 602, 104: 603, 105: 604, 106: 605, 107: 606, 108: 607, 109: 608, 110: 609,
  111: 610, 112: 611, 113: 611, 114: 611
};

// Start Pages of all 30 Juz - Mathematically aligned with Hafezi layout (20 pages per para, juz 1 starts on page 1)
const JUZ_START_PAGES: Record<number, number> = {
  1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 122, 8: 142, 9: 162, 10: 182,
  11: 202, 12: 222, 13: 242, 14: 262, 15: 282, 16: 302, 17: 322, 18: 342, 19: 362, 20: 382,
  21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582
};

const BN_SURAH_NAMES: Record<number, string> = {
  1: 'ফাতিহা', 2: 'বাকারাহ', 3: 'আল ইমরান', 4: 'নিসা', 5: 'মায়িদাহ', 6: 'আন\'আম', 7: 'আ\'রাফ', 8: 'আনফাল', 9: 'তাওবাহ', 10: 'ইউনুস',
  11: 'হুদ', 12: 'ইউসুফ', 13: 'রা\'দ', 14: 'ইব্রাহিম', 15: 'হিজর', 16: 'নাহল', 17: 'ইসরা', 18: 'কাহফ', 19: 'মারইয়াম', 20: 'ত্বোয়া-হা',
  21: 'আম্বিয়া', 22: 'হাজ্জ', 23: 'মু\'মিনুন', 24: 'নূর', 25: 'ফুরকান', 26: 'শুআরা', 27: 'নামল', 28: 'কাসাস', 29: 'আনকাবুত', 30: 'রুম',
  31: 'লোকমান', 32: 'সাজদাহ', 33: 'আহযাব', 34: 'সাবা', 35: 'ফাতির', 36: 'ইয়াসীন', 37: 'সাফফাত', 38: 'সাদ', 39: 'যুমার', 40: 'গাফির',
  41: 'ফুসসিলাত', 42: 'শূরা', 43: 'যুখরুফ', 44: 'দুখান', 45: 'জাসিয়াহ', 46: 'আহকাফ', 47: 'মুহাম্মদ', 48: 'ফাতহ', 49: 'হুজুরাত', 50: 'ক্বাফ',
  51: 'যারিয়াত', 52: 'তুর', 53: 'নাজম', 54: 'ক্বামার', 55: 'আর-রাহমান', 56: 'ওয়াকিয়াহ', 57: 'হাদিদ', 58: 'মুজাদালাহ', 59: 'হাশর', 60: 'مুমতাহিনাহ',
  61: 'সাফফ', 62: 'জুমুআহ', 63: 'মুনাফিকুন', 64: 'তাগাবুন', 65: 'তালাক', 66: 'তাহরীম', 67: 'মুলক', 68: 'কলাম', 69: 'হাক্কাহ', 70: 'মাআরিজ',
  71: 'নূহ', 72: 'জিন', 73: 'মুযযামমিল', 74: 'মুদ্দাসসির', 75: 'কিয়ামাহ', 76: 'ইনসান', 77: 'মুরসালাত', 78: 'নাবা', 79: 'নাযিয়াত', 80: 'আবাসা',
  81: 'তাকভীর', 82: 'ইনফিতার', 83: 'মুতাফফিফীন', 84: 'ইনশিকাক', 85: 'বুরুজ', 86: 'তারিক', 87: 'আ\'লা', 88: 'গাশিয়াহ', 89: 'ফজর', 90: 'বালাদ',
  91: 'শামস', 92: 'লাইল', 93: 'দুহা', 94: 'ইনশিরাহ', 95: 'তীন', 96: 'আলাক', 97: 'কদর', 98: 'বাইয়্যিনাহ', 99: 'যিলযাল', 100: 'আদিয়াত',
  101: 'কারিয়াহ', 102: 'তাকাসুর', 103: 'আসর', 104: 'হুমাযাহ', 105: 'ফীল', 106: 'কুরাইশ', 107: 'মাউন', 108: 'কাউসার', 109: 'কাফিরুন', 110: 'নাসর',
  111: 'মাসাদ', 112: 'ইখলাস', 113: 'ফালাক', 114: 'নাস'
};

const BN_JUZ_NAMES: Record<number, string> = {
  1: 'আলিফ লাম মীম', 2: 'সায়াকুল', 3: 'তিলকার রুসুল', 4: 'লান তানালু', 5: 'ওয়াল মুহসানাত', 6: 'লা ইয়ুহিব্বুল্লাহ',
  7: 'ওয়া ইযা সামিউ', 8: 'ওয়া লাও আন্নানা', 9: 'ক্বালাল মালায়ু', 10: 'ওয়ালামু', 11: 'ইয়াতাজি রুন', 12: 'ওয়া মা মিন দাব্বাতিন',
  13: 'ওয়া মা উবাররিউ', 14: 'আলিফ লাম রা (রূবামা)', 15: 'সুবহানাল্লাযী', 16: 'ক্বালা আলাম', 17: 'ইক্বতারা বা', 18: 'ক্বাদ আফলাহা',
  19: 'ওয়া ক্বালাল্লাযীনা', 20: 'আম্মান খালাক্ব', 21: 'উত্লু মা ঊহিয়া', 22: 'ওয়া মান ইয়াক্ব্নুত', 23: 'ওয়া মালি', 24: 'ফামান আযলামু',
  25: 'ইলাইহি ইউরাদ্দু', 26: 'হামীম (আহক্বাফ)', 27: 'ক্বালা ফামা খাত্ববুকুম', 28: 'ক্বাদ সামিয়াল্লাহ', 29: 'তাবা রকাল্লাযী', 30: 'আম্মা ইয়াতাসাআলুন'
};

const toBNNumber = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => bnDigits[parseInt(d)]);
};

const toARNumber = (num: number | string): string => {
  const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, d => arDigits[parseInt(d)]);
};

const getJuzFromPage = (page: number): number => {
  for (let juz = 30; juz >= 1; juz--) {
    if (page >= JUZ_START_PAGES[juz]) return juz;
  }
  return 1;
};

const EN_SURAH_NAMES: Record<number, string> = {
  1: 'Al-Fatihah', 2: 'Al-Baqarah', 3: 'Al-Imran', 4: 'An-Nisa', 5: 'Al-Ma\'idah', 6: 'Al-An\'am', 7: 'Al-A\'raf', 8: 'Al-Anfal', 9: 'At-Tawbah', 10: 'Yunus',
  11: 'Hud', 12: 'Yusuf', 13: 'Ar-Ra\'d', 14: 'Ibrahim', 15: 'Al-Hijr', 16: 'An-Nahl', 17: 'Al-Isra', 18: 'Al-Kahf', 19: 'Maryam', 20: 'Taha',
  21: 'Al-Anbiya', 22: 'Al-Hajj', 23: 'Al-Mu\'minun', 24: 'An-Nur', 25: 'Al-Furqan', 26: 'Ash-Shu\'ara', 27: 'An-Naml', 28: 'Al-Qasas', 29: 'Al-Ankabut', 30: 'Ar-Rum',
  31: 'Luqman', 32: 'As-Sajdah', 33: 'Al-Ahzab', 34: 'Saba', 35: 'Fatir', 36: 'Yasin', 37: 'As-Saffat', 38: 'Sad', 39: 'Az-Zumar', 40: 'Ghafir',
  41: 'Fussilat', 42: 'Ash-Shura', 43: 'Az-Zukhruf', 44: 'Ad-Dukhan', 45: 'Al-Jathiyah', 46: 'Al-Ahqaf', 47: 'Muhammad', 48: 'Al-Fath', 49: 'Al-Hujurat', 50: 'Qaf',
  51: 'Adh-Dhariyat', 52: 'At-Tur', 53: 'An-Najm', 54: 'Al-Qamar', 55: 'Ar-Rahman', 56: 'Al-Waqi\'ah', 57: 'Al-Hadid', 58: 'Al-Mujadilah', 59: 'Al-Hashr', 60: 'Al-Mumtahanah',
  61: 'As-Saff', 62: 'Al-Jumu\'ah', 63: 'Al-Munafiqun', 64: 'At-Taghabun', 65: 'At-Talaq', 66: 'At-Tahrim', 67: 'Al-Mulk', 68: 'Al-Qalam', 69: 'Al-Haqqah', 70: 'Al-Ma\'arij',
  71: 'Nuh', 72: 'Al-Jinn', 73: 'Al-Muzzammil', 74: 'Al-Muddaththir', 75: 'Al-Qiyamah', 76: 'Al-Insan', 77: 'Al-Mursalat', 78: 'An-Naba', 79: 'An-Naziat', 80: 'Abasa',
  81: 'At-Takwir', 82: 'Al-Infitar', 83: 'Al-Mutaffifin', 84: 'Al-Inshiqaq', 85: 'Al-Buruj', 86: 'At-Tariq', 87: 'Al-A\'la', 88: 'Al-Ghashiyah', 89: 'Al-Fajr', 90: 'Al-Balad',
  91: 'Ash-Shams', 92: 'Al-Lail', 93: 'Ad-Duha', 94: 'Ash-Sharh', 95: 'At-Tin', 96: 'Al-Alaq', 97: 'Al-Qadr', 98: 'Al-Bayyinah', 99: 'Az-Zilzal', 100: 'Al-Adiyat',
  101: 'Al-Qari\'ah', 102: 'At-Takathur', 103: 'Al-Asr', 104: 'Al-Humazah', 105: 'Al-Fil', 106: 'Quraysh', 107: 'Al-Ma\'un', 108: 'Al-Kauthar', 109: 'Al-Kafirun', 110: 'An-Nasr',
  111: 'Al-Masad', 112: 'Al-Ikhlas', 113: 'Al-Falaq', 114: 'An-Nas'
};

const getSurahFromPage = (page: number): number => {
  let activeSurahNum = 1;
  for (let sNum = 1; sNum <= 114; sNum++) {
    const startPage = SURAH_START_PAGES[sNum];
    if (startPage !== undefined && page >= startPage) {
      activeSurahNum = sNum;
    }
  }
  return activeSurahNum;
};

import { STATIC_SURAH_LIST } from '../data/surahStaticData';

export default function Tilawat() {
  const { language } = useLanguage();
  const [surahList, setSurahList] = useState<Surah[]>(STATIC_SURAH_LIST);
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Controls (Trimmed down unused parameters to optimize rendering)
  const [selectedCDN, setSelectedCDN] = useState<string>('emdadia_hafezi');
  const [fallbackIndex, setFallbackIndex] = useState<number>(0);
  const [isImgRenderLoading, setIsImgRenderLoading] = useState<boolean>(true);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [pageTurnDirection, setPageTurnDirection] = useState<'next' | 'prev' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  // Swipe Gestures for Mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minDistance = 50; // swipe threshold
    if (diff > minDistance) {
      handleNextPage();
    } else if (diff < -minDistance) {
      handlePrevPage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Drag Swiping for Desktop Mice
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    mouseStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current || mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    const minDistance = 50; // swipe/drag threshold
    if (diff > minDistance) {
      handleNextPage();
    } else if (diff < -minDistance) {
      handlePrevPage();
    }
    mouseStartX.current = null;
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    mouseStartX.current = null;
    isDragging.current = false;
  };

  // Prevent background scrolling when in full screen immersive reading mode
  useEffect(() => {
    if (isFullScreen && currentPage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen, currentPage]);

  // Load Saved Bookmark
  useEffect(() => {
    const savedPage = localStorage.getItem('quran_last_read_page');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
  }, []);

  // Save last read page when current page changes
  useEffect(() => {
    if (currentPage) {
      localStorage.setItem('quran_last_read_page', currentPage.toString());
    }
  }, [currentPage]);

  // Reset image rendering load state and fallback index on page or server change
  useEffect(() => {
    setFallbackIndex(0);
    setIsImgRenderLoading(true);
  }, [currentPage, selectedCDN]);

  // Keyboard Navigation for flipping pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentPage === null) return;
      if (e.key === 'ArrowLeft') {
        handleNextPage();
      } else if (e.key === 'ArrowRight') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  // Aggressively preload next pages in the background
  useEffect(() => {
    if (!currentPage) return;
    // Preload next 2 pages and previous 1 page
    const pagesToPreload = [currentPage + 1, currentPage + 2, currentPage - 1];
    pagesToPreload.forEach(p => {
      if (p >= 1 && p <= 611) {
        const img = new Image();
        img.src = getPageImageUrl(p);
      }
    });
  }, [currentPage, selectedCDN]);

  const handleNextPage = () => {
    if (currentPage && currentPage < 611) {
      setPageTurnDirection('next');
      setCurrentPage(prev => prev! + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage && currentPage > 1) {
      setPageTurnDirection('prev');
      setCurrentPage(prev => prev! - 1);
    }
  };

  const bookmarkCurrentPage = () => {
    if (!currentPage) return;
    localStorage.setItem('quran_bookmarked_page', currentPage.toString());
    setAlertMsg(language === 'bn' ? `পৃষ্ঠা নং ${toBNNumber(currentPage)} বুকমার্ক করা হয়েছে!` : `Page ${currentPage} has been bookmarked!`);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleSurahClick = (surah: Surah) => {
    const startPage = SURAH_START_PAGES[surah.number] || 1;
    setCurrentPage(startPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJuzClick = (juzNumber: number) => {
    const startPage = JUZ_START_PAGES[juzNumber] || 1;
    setCurrentPage(startPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSurahs = useMemo(() => {
    return surahList.filter(s => 
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.includes(searchTerm) ||
      BN_SURAH_NAMES[s.number]?.includes(searchTerm) ||
      (language === 'bn' && s.englishNameTranslation.includes(searchTerm))
    );
  }, [surahList, searchTerm, language]);

  // Dynamic Image URLs (Riyadh/Medina Aligned Prints with multi-CDN backup fallback)
  const getPageImageUrl = (pageNo: number) => {
    const paddedPage = String(pageNo).padStart(3, '0');
    // Align CDNs based on preference and fallback sequence
    const selected = REAL_PAGE_CDNS.find(c => c.id === selectedCDN) || REAL_PAGE_CDNS[0];
    const sequence = [selected, ...REAL_PAGE_CDNS.filter(c => c.id !== selectedCDN)];
    
    const activeIndex = Math.min(fallbackIndex, sequence.length - 1);
    const activeCDN = sequence[activeIndex];
    
    return activeCDN.url(paddedPage, pageNo);
  };

  // Get active Surah meta for current page - computed offline for instant loading
  const pageMeta = useMemo(() => {
    const sNum = getSurahFromPage(currentPage || 1);
    const juzNum = getJuzFromPage(currentPage || 1);
    const bnName = BN_SURAH_NAMES[sNum] || '';
    const enName = EN_SURAH_NAMES[sNum] || '';
    return {
      surahName: language === 'bn' ? bnName : enName,
      englishName: enName,
      revelation: sNum <= 86 ? 'Meccan' : 'Medinan',
      juzNum
    };
  }, [currentPage, language]);

  if (currentPage !== null) {
    // IMMERSIVE FULL SCREEN (ZEN) MODE OVERLAY
    if (isFullScreen) {
      return createPortal(
        <div className="fixed inset-0 z-[100] bg-[#0d0904] text-amber-100 flex flex-col justify-between overflow-hidden select-none">
          {/* Top Panel */}
          <div className="bg-[#1c140a] border-b border-amber-950/40 p-4 px-6 flex items-center justify-between z-50 shadow-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFullScreen(false)}
                className="flex items-center gap-1 px-3 py-2 bg-[#2d1f0f] hover:bg-[#3d2c18] text-amber-200 rounded-xl font-bold text-xs transition-transform active:scale-95"
              >
                <ArrowLeft size={16} />
                <span>{language === 'bn' ? 'বন্ধ করুন' : 'Exit'}</span>
              </button>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] text-amber-500/70 font-black uppercase tracking-widest leading-none mb-1">
                  {pageMeta.englishName || 'Holy Quran'}
                </span>
                <span className="text-xs font-black text-amber-100 whitespace-nowrap leading-none">
                  {language === 'bn' ? `পারা ${toBNNumber(pageMeta.juzNum)}: ${BN_JUZ_NAMES[pageMeta.juzNum]}` : `Juz ${pageMeta.juzNum}`}
                </span>
              </div>
            </div>

            {/* Current Page visual display banner */}
            <div className="text-center">
              <span className="bg-amber-950/80 text-amber-300 font-bold px-4 py-1.5 rounded-full text-xs tracking-widest border border-amber-500/20 shadow-inner font-mono">
                {language === 'bn' ? `পৃষ্ঠা: ${toBNNumber(currentPage)} / ৬১১` : `Page: ${currentPage} / 611`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={bookmarkCurrentPage}
                className="p-2 bg-[#2d1f0f] hover:bg-[#3d2c18] text-amber-400 rounded-xl transition-all active:scale-95 shadow"
                title={language === 'bn' ? 'এই পৃষ্ঠা বুকমার্ক করুন' : 'Bookmark this page'}
              >
                <Bookmark size={15} className="fill-current text-amber-500" />
              </button>
            </div>
          </div>

          {/* Central Active Stage */}
          <div className="flex-1 relative flex items-center justify-center p-2 md:p-6 bg-[#040301]">
            {/* LEFT RTL Hotzone overlay - Turns to next numerical page */}
            <div 
              onClick={handleNextPage}
              className="absolute left-0 top-0 bottom-0 w-[20%] md:w-[25%] cursor-w-resize z-20 flex items-center justify-start pl-4 group opacity-0 hover:opacity-100 transition-opacity"
              title={language === 'bn' ? 'পরবর্তী পৃষ্ঠা (বামে ট্যাপ করুন)' : 'Next Page (Tap Left)'}
            >
              <div className="bg-amber-950/60 text-amber-400/80 p-3.5 rounded-full border border-amber-800/10 group-hover:scale-105 transition-transform shadow-lg">
                <ChevronLeft size={24} strokeWidth={3} />
              </div>
            </div>

            {/* RIGHT RTL Hotzone overlay - Turns to previous numerical page */}
            <div 
              onClick={handlePrevPage}
              className="absolute right-0 top-0 bottom-0 w-[20%] md:w-[25%] cursor-e-resize z-20 flex items-center justify-end pr-4 group opacity-0 hover:opacity-100 transition-opacity"
              title={language === 'bn' ? 'পূর্ববর্তী পৃষ্ঠা (ডানে ট্যাপ করুন)' : 'Prev Page (Tap Right)'}
            >
              <div className="bg-amber-950/60 text-amber-400/80 p-3.5 rounded-full border border-amber-800/10 group-hover:scale-105 transition-transform shadow-lg">
                <ChevronRight size={24} strokeWidth={3} />
              </div>
            </div>

            {/* Pages Image container with spring RTL slide-out effects and Swipe/Drag Navigation */}
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full max-w-2xl flex items-center justify-center relative touch-pan-y"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={`fs-page-render-${currentPage}`}
                  initial={{ 
                    opacity: 0, 
                    x: pageTurnDirection === 'next' ? -120 : pageTurnDirection === 'prev' ? 120 : 0,
                    scale: 0.98 
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ 
                    opacity: 0, 
                    x: pageTurnDirection === 'next' ? 120 : pageTurnDirection === 'prev' ? -120 : 0,
                    scale: 0.98 
                  }}
                  transition={{ type: "spring", damping: 28, stiffness: 190 }}
                  className="w-full h-full flex items-center justify-center p-3 rounded-[2.5rem] bg-[#FCFAF2] border-[4px] border-[#221606] shadow-2xl relative overflow-hidden"
                >
                  {isImgRenderLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FCFAF2]/95 z-20 gap-3">
                      <Loader2 size={36} className="animate-spin text-amber-800" />
                      <span className="text-amber-950/60 text-xs font-black tracking-widest uppercase">
                        {language === 'bn' ? 'হাফেজী পৃষ্ঠা সাজানো হচ্ছে...' : 'Formatting page...'}
                      </span>
                    </div>
                  )}

                  <img
                    src={getPageImageUrl(currentPage)}
                    alt={`Emdadia Hafezi Page ${currentPage}`}
                    className={`max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-300 ${isImgRenderLoading ? 'opacity-0' : 'opacity-100'}`}
                    referrerPolicy="no-referrer"
                    onLoad={() => setIsImgRenderLoading(false)}
                    onError={() => {
                      if (fallbackIndex < REAL_PAGE_CDNS.length - 1) {
                        setFallbackIndex(prev => prev + 1);
                      } else {
                        setIsImgRenderLoading(false);
                      }
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Simple Bottom HUD controls */}
          <div className="bg-[#1c140a] border-t border-amber-950/40 p-4 px-6 flex items-center justify-between z-40 text-amber-400 font-bold text-xs select-none">
            <button 
              onClick={handleNextPage}
              disabled={currentPage >= 611}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#2a1e0f] rounded-xl hover:bg-[#3d2c18] disabled:opacity-20 active:scale-95 leading-none transition-colors duration-200"
            >
              <ChevronLeft size={16} />
              <span>{language === 'bn' ? 'পরবর্তী পৃষ্ঠা (বামে)' : 'Next (Left)'}</span>
            </button>

            <span className="text-[10px] text-amber-500/50 uppercase tracking-widest hidden md:inline">
              {language === 'bn' ? 'পৃষ্ঠা ফ্লিপ করতে কী-বোর্ডের Arrow বা মাউস ড্র্যাগ ব্যবহার করুন' : 'Use Arrow Keys or Mouse Drag to turn pages'}
            </span>

            <button 
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#2a1e0f] rounded-xl hover:bg-[#3d2c18] disabled:opacity-20 active:scale-95 leading-none transition-colors duration-200"
            >
              <span>{language === 'bn' ? 'পূর্ববর্তী পৃষ্ঠা (ডানে)' : 'Prev (Right)'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>,
        document.body
      );
    }

    // NORMAL INLINE PAGE READER VIEW
    return (
      <div className="space-y-6 pb-24 max-w-5xl mx-auto">
        {/* Floating alerts */}
        <AnimatePresence>
          {alertMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-xl z-50 flex items-center gap-2 border border-emerald-500 text-xs backdrop-blur-md"
            >
              <CheckCircle2 size={16} />
              <span>{alertMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Reader Sticky Bar */}
        <div className="glass border border-slate-100 rounded-[2rem] p-4 flex flex-wrap items-center justify-between gap-4 sticky top-[72px] z-40 shadow-lg">
          
          <button 
            onClick={() => setCurrentPage(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 shrink-0"
          >
            <ArrowLeft size={16} />
            <span>{language === 'bn' ? 'সূচীপত্র' : 'Index'}</span>
          </button>

          {/* Jump select dropdown with standard 611 pages limit */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 select-none hidden md:inline">
              {language === 'bn' ? 'পৃষ্ঠা নির্ধারণ:' : 'Select Page:'}
            </span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-[#065f46] font-bold text-xs max-w-[130px] shadow-sm text-stone-700 select-all"
            >
              {Array.from({ length: 611 }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  {language === 'bn' ? `${toBNNumber(p)} নং পৃষ্ঠা` : `Page ${p}`}
                </option>
              ))}
            </select>
          </div>

          {/* Core Controls: Fullscreen Trigger & Bookmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsFullScreen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-black text-xs transition-colors shadow-sm active:scale-95"
              title={language === 'bn' ? 'ফুল স্ক্রিন করুন' : 'Full Screen Reading Mode'}
            >
              <Maximize2 size={14} />
              <span>{language === 'bn' ? 'ফুল স্ক্রিন' : 'Fullscreen'}</span>
            </button>

            <button
              onClick={bookmarkCurrentPage}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors active:scale-95 shadow-sm"
              title={language === 'bn' ? 'এই পৃষ্ঠা বুকমার্ক করুন' : 'Bookmark page'}
            >
              <Bookmark size={15} className="fill-current text-amber-500" />
            </button>
          </div>
        </div>

        {/* MAIN STAGE BLOCK with touch gestures and mouse drag/swiping */}
        <div 
          ref={containerRef} 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="relative select-text touch-pan-y"
        >
          <AnimatePresence mode="wait">
            {/* REAL PHYSICAL IMAGE REPRESENTATION */}
            <motion.div
              key={`page-img-inline-${currentPage}`}
              initial={{ 
                opacity: 0, 
                x: pageTurnDirection === 'next' ? -80 : pageTurnDirection === 'prev' ? 80 : 0, 
                scale: 0.98 
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                x: pageTurnDirection === 'next' ? 80 : pageTurnDirection === 'prev' ? -80 : 0, 
                scale: 0.98 
              }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center w-full"
            >
              <div 
                className="bg-[#FCFAF2] p-4 md:p-[20px] rounded-[2rem] border-4 border-[#1c1404] shadow-2xl relative w-full overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-2 md:inset-4 border border-[#cfab61]/40 rounded-3.5xl pointer-events-none z-10" />
                <div className="absolute inset-3 md:inset-5 border-2 border-[#1c1404]/80 rounded-3xl pointer-events-none z-10" />
                
                {/* Visual meta headers */}
                <div className="flex justify-between items-center text-[11px] md:text-sm font-black text-[#56421c] border-b border-[#e9dcbe] pb-2 mb-4 px-4 select-none z-10 relative">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Sparkles size={12} className="text-[#cfab61]" />
                    <span>{pageMeta.surahName || (language === 'bn' ? 'পবিত্র কুরআন' : 'The Holy Quran')}</span>
                  </div>
                  
                  <div className="text-center">
                    <span className="bg-emerald-900/10 text-emerald-950 font-black px-3 py-1 rounded-full text-[10px] tracking-widest border border-emerald-950/[0.05] shadow-inner font-mono">
                      {language === 'bn' ? `পৃষ্ঠা: ${toBNNumber(currentPage)}` : `Page: ${currentPage}`}
                    </span>
                  </div>

                  <div className="text-right text-[#56421c] text-emerald-800">
                    <span>{language === 'bn' ? `পারা ${toBNNumber(pageMeta.juzNum)}: ${BN_JUZ_NAMES[pageMeta.juzNum]}` : `Juz ${pageMeta.juzNum}`}</span>
                  </div>
                </div>

                {/* Holy Quran Scan display */}
                <div className="w-full flex justify-center items-center overflow-auto py-2 z-10 relative bg-[#fdfdfb] rounded-2xl shadow-inner border border-stone-200 min-h-[40vh]">
                  {isImgRenderLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdfdfb]/90 z-20 gap-3">
                      <Loader2 size={36} className="animate-spin text-amber-600" />
                      <span className="text-stone-500 text-xs font-bold tracking-wider">
                        {language === 'bn' ? 'এমদাদিয়া হাফেজী পৃষ্ঠা লোড হচ্ছে...' : 'Loading Emdadia Hafezi Quran scan...'}
                      </span>
                    </div>
                  )}
                  <motion.img
                    src={getPageImageUrl(currentPage)}
                    alt={`Holy Quran Page ${currentPage}`}
                    className={`max-h-[75vh] md:max-h-[82vh] object-contain select-none pointer-events-none transition-transform duration-300 ${isImgRenderLoading ? 'opacity-0' : 'opacity-100'}`}
                    referrerPolicy="no-referrer"
                    onLoad={() => setIsImgRenderLoading(false)}
                    onError={() => {
                      if (fallbackIndex < REAL_PAGE_CDNS.length - 1) {
                        setFallbackIndex(prev => prev + 1);
                      } else {
                        setIsImgRenderLoading(false);
                      }
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isImgRenderLoading ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Footnotes referencing Emdadia and the correct page boundaries */}
                <div className="flex justify-between items-center text-[10px] md:text-xs font-black text-[#876e41] border-t border-[#e9dcbe]/80 pt-3 mt-4 px-4 select-none">
                  <span>
                    {language === 'bn' ? 'এমদাদিয়া লাইব্রেরি সংস্করণ' : 'Emdadia Library Print'}
                  </span>
                  <span className="font-mono bg-[#dfd2b1]/40 px-2.5 py-1 rounded-md">
                    {currentPage} / 611
                  </span>
                  <span>
                    {language === 'bn' ? '১৫-লাইন হাফেজী স্ক্রিপ্ট' : '15-Line Hafezi Script'}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM PAGINATION NAV BAR - Aligned symmetrically for RTL Flow */}
        <div className="flex justify-between items-center mt-6 bg-white border border-slate-100 rounded-3xl p-4 shadow-sm select-none gap-4">
          <button
            onClick={handleNextPage}
            disabled={currentPage >= 611}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-40 font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:scale-100 shadow-md"
          >
            <ChevronLeft size={16} strokeWidth={3} />
            <span>{language === 'bn' ? 'পরবর্তী পৃষ্ঠা (বামে)' : 'Next Page (Left)'}</span>
          </button>

          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 hidden lg:inline-block">
            {language === 'bn' ? 'কী-বোর্ড শর্টকাট: ডানে-বামে ফ্লিপ করতে Arrow Keys চাপুন' : 'Tip: Use Left/Right Arrow keys to flip pages'}
          </span>

          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-850 rounded-xl disabled:opacity-40 font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:scale-100 shadow-sm"
          >
            <span>{language === 'bn' ? 'পূর্ববর্তী পৃষ্ঠা (ডানে)' : 'Prev Page (Right)'}</span>
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT MAIN SCREEN: Beautiful Surah list and selection block with view filter (Surah Tab vs. Juz Tab)
  return (
    <div className="space-y-6 pb-20">
      
      {/* Title Header Section with custom visual theme */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl gap-6">
        <div className="relative z-10 text-center md:text-left">
          
          {/* Saved Reading Session Resumer alert */}
          {localStorage.getItem('quran_last_read_page') && (
            <button
              onClick={() => {
                const saved = localStorage.getItem('quran_last_read_page');
                if (saved) setCurrentPage(parseInt(saved));
              }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full mb-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-md animate-bounce"
            >
              <BookmarkCheck size={12} className="fill-current" />
              <span>{language === 'bn' ? 'সর্বশেষ পড়া পৃষ্ঠা থেকে শুরু করুন' : 'Resume last reading'}</span>
            </button>
          )}

          <div className="block mt-2">
            <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter">
              {language === 'bn' ? 'কুরআন তিলাওয়াত' : 'Quran Recitation'}
            </h1>
            <p className="text-emerald-100 italic opacity-85 text-sm md:text-base max-w-lg mt-1">
              {language === 'bn' ? 'বাস্তব কুরআনের পৃষ্ঠা ও ছাপা পাতার অনুকরণে কুরআন পাঠের সর্বোত্তম মাধ্যম' : 'Divine interface mirroring physical pages and printed publications of the Holy Quran'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher tabs */}
        <div className="relative z-10 flex bg-emerald-950/50 p-1.5 rounded-[1.5rem] border border-white/10 backdrop-blur-md shrink-0">
          <button 
            onClick={() => {
              setViewMode('surah');
              setSearchTerm('');
            }}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'surah' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-emerald-100 hover:bg-white/5'}`}
          >
            {language === 'bn' ? 'সূরা তালিকা' : 'Surah List'}
          </button>
          <button 
            onClick={() => {
              setViewMode('juz');
              setSearchTerm('');
            }}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'juz' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-emerald-100 hover:bg-white/5'}`}
          >
            {language === 'bn' ? 'পারা (জুজ)' : 'Para (Juz)'}
          </button>
        </div>
        <BookOpen size={160} className="absolute -right-8 -top-8 opacity-[0.03] rotate-12 pointer-events-none" />
      </div>

      {/* Search Input bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder={
            viewMode === 'surah' 
              ? (language === 'bn' ? 'সূরা খুঁজুন (যেমন: ফাতিহা বা ১৮)...' : 'Search Surah (e.g. Fatihah or 18)...')
              : (language === 'bn' ? 'পারা বা জুজ নম্বর খুঁজুন (১ থেকে ৩০)...' : 'Search Juz Number (1 to 30)...')
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={40} className="animate-spin text-emerald-600" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            {language === 'bn' ? 'সূরাসমূহ প্রস্তুত হচ্ছে...' : 'Loading Surah Database...'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {viewMode === 'surah' ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredSurahs.map((surah, i) => {
                const startPageNum = SURAH_START_PAGES[surah.number] || 1;
                
                return (
                  <motion.div 
                    key={surah.number}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.005, 0.2) }}
                    whileHover={{ x: 4 }}
                    onClick={() => handleSurahClick(surah)}
                    className="flex items-center justify-between p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Numbering banner */}
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-700/80 rounded-2xl flex items-center justify-center font-black rotate-45 group-hover:rotate-0 transition-all shadow-inner">
                        <span className="text-xs -rotate-44 group-hover:rotate-0 transition-all font-mono">
                          {language === 'bn' ? toBNNumber(surah.number) : surah.number}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-800 tracking-tight">
                          {BN_SURAH_NAMES[surah.number] || surah.englishName}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-0.5">
                          {surah.revelationType === 'Meccan' ? (language === 'bn' ? 'মক্কী' : 'Meccan') : (language === 'bn' ? 'মাদানী' : 'Medinan')} • {language === 'bn' ? `${toBNNumber(surah.numberOfAyahs)} আয়াত` : `${surah.numberOfAyahs} Ayahs`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="arabic-text text-xl text-emerald-950 font-black block select-none">
                        {surah.name}
                      </span>
                      <span className="text-[9px] font-black text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider block mt-1 select-none">
                        {language === 'bn' ? `পৃষ্ঠা ${toBNNumber(startPageNum)}` : `Page ${startPageNum}`}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {juzList
                .filter(j => searchTerm === '' || j.toString().includes(searchTerm) || (language === 'bn' && toBNNumber(j).includes(searchTerm)))
                .map((juz, i) => {
                  const juzStartPageVal = JUZ_START_PAGES[juz] || 1;
                  
                  return (
                    <motion.div
                      key={juz}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.01 }}
                      whileHover={{ y: -3 }}
                      onClick={() => handleJuzClick(juz)}
                      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 cursor-pointer transition-all text-center group"
                    >
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center font-black mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors rotate-45 group-hover:rotate-0 shadow-inner">
                        <span className="text-lg -rotate-45 group-hover:rotate-0 transition-transform font-mono">
                          {language === 'bn' ? toBNNumber(juz) : juz}
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-black text-slate-800 tracking-tight">
                        {language === 'bn' ? `${toBNNumber(juz)} নং পারা` : `Juz ${juz}`}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold block mt-1 tracking-tight italic">
                        {BN_JUZ_NAMES[juz]}
                      </p>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest mt-3.5 inline-block select-none">
                        {language === 'bn' ? `পৃষ্ঠা ${toBNNumber(juzStartPageVal)}` : `Page ${juzStartPageVal}`}
                      </span>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
