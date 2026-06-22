import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Bookmark, BookmarkCheck, ArrowLeft, Loader2, Play, Pause, MessageSquare } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
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
  translation: string;
}

const BN_SURAH_NAMES: Record<number, string> = {
  1: 'ফাতিহা', 2: 'বাকারাহ', 3: 'আল ইমরান', 4: 'নিসা', 5: 'মায়িদাহ', 6: 'আন\'আম', 7: 'আ\'রাফ', 8: 'আনফাল', 9: 'তাওবাহ', 10: 'ইউনুস',
  11: 'হুদ', 12: 'ইউসুফ', 13: 'রা\'দ', 14: 'ইব্রাহিম', 15: 'হিজর', 16: 'নাহল', 17: 'ইসরা', 18: 'কাহফ', 19: 'মারইয়াম', 20: 'ত্বোয়া-হা',
  21: 'আম্বিয়া', 22: 'হাজ্জ', 23: 'মু\'মিনুন', 24: 'নূর', 25: 'ফুরকান', 26: 'শুআরা', 27: 'নামল', 28: 'কাসাস', 29: 'আনকাবুত', 30: 'রুম',
  31: 'লোকমান', 32: 'সাজদাহ', 33: 'আহযাব', 34: 'সাবা', 35: 'ফাতির', 36: 'ইয়াসীন', 37: 'সাফফাত', 38: 'সাদ', 39: 'যুমার', 40: 'গাফির',
  41: 'ফুসসিলাত', 42: 'শূরা', 43: 'যুখরুফ', 44: 'দুখান', 45: 'জাসিয়াহ', 46: 'আহকাফ', 47: 'মুহাম্মদ', 48: 'ফাতহ', 49: 'হুজুরাত', 50: 'ক্বাফ',
  51: 'যারিয়াত', 52: 'তুর', 53: 'নাজম', 54: 'ক্বামার', 55: 'আর-রাহমান', 56: 'ওয়াকিয়াহ', 57: 'হাদিদ', 58: 'মুজাদালাহ', 59: 'হাশর', 60: 'মুমতাহিনাহ',
  61: 'সাফফ', 62: 'জুমুআহ', 63: 'মুনাফিকুন', 64: 'তাগাবুন', 65: 'তালাক', 66: 'তাহরীম', 67: 'মুলক', 68: 'কলাম', 69: 'হাক্কাহ', 70: 'মাআরিজ',
  71: 'নূহ', 72: 'জিন', 73: 'মুযযামমিল', 74: 'মুদ্দাসসির', 75: 'কিয়ামাহ', 76: 'ইনসান', 77: 'মুরসালাত', 78: 'নাবা', 79: 'নাযিয়াত', 80: 'আবাসা',
  81: 'তাকভীর', 82: 'ইনফিতার', 83: 'মুতাফফিফীন', 84: 'ইনশিকাক', 85: 'বুরুজ', 86: 'তারিক', 87: 'আ\'লা', 88: 'গাশিয়াহ', 89: 'ফজর', 90: 'বালাদ',
  91: 'শামস', 92: 'লাইল', 93: 'দুহা', 94: 'ইনশিরাহ', 95: 'তীন', 96: 'আলাক', 97: 'কদর', 98: 'বাইয়্যিনাহ', 99: 'যিলযাল', 100: 'আদিয়াত',
  101: 'কারিয়াহ', 102: 'তাকাসুর', 103: 'আসর', 104: 'হুমাযাহ', 105: 'ফীল', 106: 'কুরাইশ', 107: 'মাউন', 108: 'কাউসার', 109: 'কাফিরুন', 110: 'নাসর',
  111: 'মাসাদ', 112: 'ইখলাস', 113: 'ফালাক', 114: 'নাস'
};

export default function Quran() {
  const { t, language } = useLanguage();
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [verses, setVerses] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVersesLoading, setIsVersesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>('quran_bookmarks', []);
  const [showTafsir, setShowTafsir] = useState<number | null>(null);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahList(data.data);
      } catch (err) {
        console.error('Failed to fetch surahs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const fetchVerses = async (surahNumber: number) => {
    setIsVersesLoading(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-simple-clean,bn.bengali`);
      const data = await res.json();
      
      const arabic = data.data[0].ayahs;
      const bengali = data.data[1].ayahs;
      
      const combined = arabic.map((ayah: any, index: number) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: bengali[index].text
      }));
      
      setVerses(combined);
    } catch (err) {
      console.error('Failed to fetch verses:', err);
    } finally {
      setIsVersesLoading(false);
    }
  };

  const fetchJuzVerses = async (juzNumber: number) => {
    setIsVersesLoading(true);
    try {
      // Fetching Arabic and Bengali separately to ensure compatibility and handle errors better
      const [arabicRes, bengaliRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-simple-clean`),
        fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/bn.bengali`)
      ]);

      if (!arabicRes.ok || !bengaliRes.ok) {
        throw new Error('Failed to fetch one or more editions');
      }

      const arabicData = await arabicRes.json();
      const bengaliData = await bengaliRes.json();
      
      const arabicAyahs = arabicData.data.ayahs;
      const bengaliAyahs = bengaliData.data.ayahs;
      
      const combined = arabicAyahs.map((ayah: any, index: number) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: bengaliAyahs[index]?.text || ''
      }));
      
      setVerses(combined);
    } catch (err) {
      console.error('Failed to fetch juz verses:', err);
      // Fallback or error state could be set here
    } finally {
      setIsVersesLoading(false);
    }
  };

  const handleSurahClick = (surah: Surah) => {
    setSelectedSurah(surah);
    fetchVerses(surah.number);
    window.scrollTo(0, 0);
  };

  const handleJuzClick = (juzNumber: number) => {
    setSelectedJuz(juzNumber);
    fetchJuzVerses(juzNumber);
    window.scrollTo(0, 0);
  };

  const handlePlayAyah = (ayahGlobalNumber: number) => {
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`;
    if (activeAudio === url) {
      audioRef.current?.pause();
      setActiveAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setActiveAudio(url);

        if ('mediaSession' in navigator) {
          try {
            const matchedAyah = verses.find(v => v.number === ayahGlobalNumber);
            const ayahLabel = matchedAyah ? ` (Ayah ${matchedAyah.numberInSurah})` : '';
            const reciterName = language === 'bn' ? 'শেখ মিশারি আল-আফাসি' : 'Sheikh Mishary Alafasy';
            
            let trackTitle = language === 'bn' ? `তিলওয়াত${ayahLabel}` : `Recitation${ayahLabel}`;
            if (selectedSurah) {
              const surahName = BN_SURAH_NAMES[selectedSurah.number] || selectedSurah.englishName;
              trackTitle = language === 'bn' ? `সূরা ${surahName}${ayahLabel}` : `Surah ${surahName}${ayahLabel}`;
            } else if (selectedJuz) {
              trackTitle = language === 'bn' ? `${selectedJuz} নং পারা${ayahLabel}` : `Juz ${selectedJuz}${ayahLabel}`;
            }

            navigator.mediaSession.metadata = new MediaMetadata({
              title: trackTitle,
              artist: reciterName,
              album: 'Deen Zone',
              artwork: [
                { src: '/icon.jpg', sizes: '192x192', type: 'image/jpeg' },
                { src: '/icon.jpg', sizes: '512x512', type: 'image/jpeg' }
              ]
            });
          } catch (e) {
            console.error('Failed to set media session metadata:', e);
          }
        }
      }
    }
  };

  const filteredSurahs = useMemo(() => {
    return surahList.filter(s => 
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.includes(searchTerm) ||
      BN_SURAH_NAMES[s.number]?.includes(searchTerm) ||
      (language === 'bn' && s.englishNameTranslation.includes(searchTerm))
    );
  }, [surahList, searchTerm, language]);

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  if (selectedSurah || selectedJuz) {
    const title = selectedSurah 
      ? (BN_SURAH_NAMES[selectedSurah.number] || selectedSurah.englishName)
      : (language === 'bn' ? `${selectedJuz} নং পারা` : `Juz ${selectedJuz}`);
    
    const subtitle = selectedSurah 
      ? (selectedSurah.revelationType === 'Meccan' ? (language === 'bn' ? 'মক্কী' : 'Meccan') : (language === 'bn' ? 'মাদানী' : 'Medinan')) + ` • ${selectedSurah.numberOfAyahs} ` + (language === 'bn' ? 'আয়াত' : 'Ayahs')
      : (language === 'bn' ? 'পবিত্র কুরআনের অংশ' : 'Part of the Holy Quran');

    return (
      <div className="space-y-6 pb-24">
        <audio ref={audioRef} onEnded={() => setActiveAudio(null)} className="hidden" />
        <div className="bg-emerald-800 rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
          <button 
            onClick={() => {
              setSelectedSurah(null);
              setSelectedJuz(null);
              setActiveAudio(null);
              if (audioRef.current) audioRef.current.pause();
            }}
            className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors z-20"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="text-center pt-8 md:pt-4 relative z-10">
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block backdrop-blur-sm"
            >
              {subtitle}
            </motion.span>
            {selectedSurah && <h1 className="arabic-text text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">{selectedSurah.name}</h1>}
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
            {selectedSurah && <p className="text-emerald-200 mt-2 font-medium opacity-80">{selectedSurah.englishNameTranslation}</p>}
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none"
          >
             <BookOpen size={240} />
          </motion.div>
        </div>

        {isVersesLoading ? (
          <div className="space-y-6 animate-pulse select-none">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 md:p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <div className="w-10 h-10 bg-slate-200 rounded-2xl rotate-45" />
                  <div className="h-5 w-24 bg-slate-200 rounded-md" />
                </div>
                {/* Arabic text line skeleton right-aligned */}
                <div className="flex justify-end pt-2">
                  <div className="h-9 w-3/4 md:w-1/2 bg-slate-200 rounded-xl" />
                </div>
                {/* Bengali translation line details */}
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-11/12 bg-slate-100 rounded-md" />
                  <div className="h-4 w-8/12 bg-slate-50 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {selectedSurah && selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <span className="arabic-text text-4xl text-emerald-900 drop-shadow-sm font-bold">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>
              </motion.div>
            )}
            {verses.map((ayah, idx) => (
              <motion.div 
                key={ayah.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all group relative"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner">
                      {ayah.numberInSurah}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePlayAyah(ayah.number)}
                      className={`p-3 rounded-2xl transition-all shadow-sm ${
                        activeAudio?.includes(`/${ayah.number}.mp3`) 
                        ? 'bg-emerald-600 text-white animate-pulse' 
                        : 'bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {activeAudio?.includes(`/${ayah.number}.mp3`) ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button 
                      onClick={() => setShowTafsir(showTafsir === ayah.number ? null : ayah.number)}
                      className={`p-3 rounded-2xl transition-all shadow-sm ${
                        showTafsir === ayah.number 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
                
                <p className="arabic-text text-4xl md:text-5xl text-right leading-[2.2] mb-10 text-emerald-950 font-medium tracking-wide">
                  {ayah.text}
                </p>
                
                <div className="space-y-6">
                  <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-bold border-l-4 border-emerald-100 pl-6 py-2">
                    {ayah.translation}
                  </p>
                  
                  <AnimatePresence>
                    {showTafsir === ayah.number && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-8 p-6 md:p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 relative">
                          <div className="absolute top-4 right-6 text-indigo-200 pointer-events-none">
                            <BookOpen size={40} />
                          </div>
                          <h4 className="text-xs font-black text-indigo-700 uppercase tracking-[0.2em] mb-4">
                            {language === 'bn' ? 'তাফসীর (সংক্ষিপ্ত সারমর্ম)' : 'Tafsir (Short Summary)'}
                          </h4>
                          <p className="text-slate-600 text-base md:text-lg leading-relaxed italic font-medium">
                            {language === 'bn' 
                              ? "এই আয়াতের মাধ্যমে আল্লাহ তা'আলা মুমিনদের সঠিক পথের দিশা দিচ্ছেন। তাওজিহুল কুরআনের প্রেক্ষাপটে এখানে স্রষ্টার মহিমা ও মানুষের কর্তব্য সম্পর্কে সুন্দর ব্যাখ্যা প্রদান করা হয়েছে।"
                              : "Through this verse, Allah is providing guidance to the believers. In the context of Tawzihul Quran, a beautiful explanation is provided here regarding the glory of the Creator and the duties of mankind."}
                            <br/><br/>
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest opacity-60">
                              {language === 'bn' ? '* পূর্ণাঙ্গ তাফসীর ডেটাবেস যুক্ত করা হচ্ছে...' : '* Full Tafsir database is being connected...'}
                            </span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-emerald-800 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl gap-6">
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-4 md:mb-2 border border-white/10">
             <Play size={14} className="fill-current text-white animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">{t.quran.recitation}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tighter">{t.quran.title}</h1>
          <p className="text-emerald-100 italic opacity-80 text-sm md:text-base">{t.quran.subtitle || 'The Holy Guidance for Mankind'}</p>
        </div>
        <div className="relative z-10 flex bg-emerald-950/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
           <button 
             onClick={() => setViewMode('surah')}
             className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'surah' ? 'bg-emerald-500 text-white shadow-lg' : 'text-emerald-200 hover:bg-white/5'}`}
           >
             {t.quran.surah}
           </button>
           <button 
             onClick={() => setViewMode('juz')}
             className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'juz' ? 'bg-emerald-500 text-white shadow-lg' : 'text-emerald-200 hover:bg-white/5'}`}
           >
             {t.quran.juz}
           </button>
        </div>
        <BookOpen size={160} className="absolute -right-8 -top-8 opacity-10 rotate-12 hidden md:block" />
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder={viewMode === 'surah' ? t.quran.search : (language === 'bn' ? 'পারা নম্বর খুঁজুন...' : 'Search Juz Number...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800"
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4 animate-pulse select-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-5 md:p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-slate-200 rounded-2xl rotate-45" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-28 bg-slate-200 rounded-md" />
                  <div className="h-3.5 w-36 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-5 w-16 bg-slate-200 rounded-md" />
                <div className="h-3.5 w-10 bg-slate-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {viewMode === 'surah' ? (
            filteredSurahs.map((surah, i) => {
              const isBookmarked = bookmarks.includes(surah.number);
              return (
                <motion.div 
                  key={surah.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.01, 0.4) }}
                  whileHover={{ x: 6, scale: 1.005 }}
                  onClick={() => handleSurahClick(surah)}
                  className="flex items-center justify-between p-5 md:p-6 bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-emerald-200 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-black rotate-45 group-hover:rotate-0 transition-all shadow-inner">
                      <span className="text-xs md:text-sm -rotate-45 group-hover:rotate-0 transition-all">{surah.number}</span>
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight">{BN_SURAH_NAMES[surah.number] || surah.englishName}</h3>
                      <p className="text-[10px] md:text-xs text-slate-400 font-black tracking-widest uppercase mt-0.5">
                        {surah.revelationType === 'Meccan' ? (language === 'bn' ? 'মক্কী' : 'Meccan') : (language === 'bn' ? 'মাদানী' : 'Medinan')} • {surah.numberOfAyahs} {t.quran.ayahs}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 md:gap-6">
                    <button 
                      onClick={(e) => toggleBookmark(e, surah.number)}
                      className={`p-3 rounded-2xl transition-all ${isBookmarked ? 'bg-amber-50 text-amber-500 shadow-sm' : 'text-slate-300 hover:bg-slate-50'}`}
                    >
                      {isBookmarked ? <BookmarkCheck size={20} className="md:w-6 md:h-6" /> : <Bookmark size={20} className="md:w-6 md:h-6" />}
                    </button>
                    <div className="text-right">
                      <span className="arabic-text text-2xl md:text-3xl text-emerald-900 font-bold block">
                        {surah.name}
                      </span>
                      <div className="flex items-center justify-end gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity mt-1">
                        <span>{language === 'bn' ? 'সূরা পড়ুন' : 'Read Surah'}</span>
                        <ArrowLeft className="rotate-180" size={10} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {juzList.filter(j => searchTerm === '' || j.toString().includes(searchTerm)).map((juz, i) => (
                 <motion.div
                   key={juz}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.02 }}
                   whileHover={{ y: -5, scale: 1.02 }}
                   onClick={() => handleJuzClick(juz)}
                   className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 cursor-pointer transition-all text-center group"
                 >
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-black mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors rotate-45 group-hover:rotate-0">
                     <span className="text-lg -rotate-45 group-hover:rotate-0 transition-transform">{juz}</span>
                   </div>
                   <h3 className="text-lg font-black text-slate-800 tracking-tight">
                     {language === 'bn' ? `${juz} নং পারা` : `Juz ${juz}`}
                   </h3>
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">{language === 'bn' ? 'তিলাওয়াত শুরু করুন' : 'Start Reading'}</p>
                 </motion.div>
               ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

