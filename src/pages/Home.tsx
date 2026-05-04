import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, BookOpen, Fingerprint, Heart, Book, Moon, Quote, Calendar, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hadiths } from '../data/hadiths';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dates, setDates] = useState<{
    enDate: string;
    bnGregorian: string;
    hijriDate: string;
    bangabdha: string;
    isLoading: boolean;
  }>({
    enDate: '',
    bnGregorian: '',
    hijriDate: '',
    bangabdha: '',
    isLoading: true
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDates = async () => {
      const date = new Date();
      
      // Gregorian
      const enDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      const bnGregorian = date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
      
      // Hijri Months
      const hijriMonthsBN = ['মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'];
      const hijriMonthsEN = ['Muharram', 'Safar', 'Rabiʻ I', 'Rabiʻ II', 'Jumada I', 'Jumada II', 'Rajab', 'Shaʻban', 'Ramadan', 'Shawwal', 'Dhuʻl-Qiʻdah', 'Dhuʻl-Hijjah'];

      let hijriDate = '';
      try {
        const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`);
        const data = await res.json();
        
        const hDay = parseInt(data.data.hijri.day);
        const hMonth = parseInt(data.data.hijri.month.number);
        const hYear = parseInt(data.data.hijri.year);
        
        hijriDate = language === 'bn'
          ? `${hDay.toLocaleString('bn-BD')} ${hijriMonthsBN[hMonth - 1]}, ${hYear.toLocaleString('bn-BD')} হিজরি`
          : `${hDay} ${hijriMonthsEN[hMonth - 1]}, ${hYear} AH`;
      } catch (err) {
        console.log('Hijri API failed, using fallback...', err);
        const hijriParts = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-uma-nu-latn', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        }).formatToParts(date);
        
        const hDay = parseInt(hijriParts.find(p => p.type === 'day')?.value || '1');
        const hMonth = parseInt(hijriParts.find(p => p.type === 'month')?.value || '1');
        const hYear = parseInt(hijriParts.find(p => p.type === 'year')?.value || '1447');
        
        hijriDate = language === 'bn'
          ? `${hDay.toLocaleString('bn-BD')} ${hijriMonthsBN[hMonth - 1]}, ${hYear.toLocaleString('bn-BD')} হিজরি`
          : `${hDay} ${hijriMonthsEN[hMonth - 1]}, ${hYear} AH`;
      }

      // Bengali Year (Bangabdha)
      const d = date.getDate();
      const m = date.getMonth();
      const y = date.getFullYear();
      const bnMonths = language === 'bn'
        ? ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র']
        : ['Boishakh', 'Jyaistha', 'Asharh', 'Shravan', 'Bhadra', 'Ashvin', 'Kartik', 'Agrahayan', 'Poush', 'Magh', 'Phalgun', 'Chaitra'];
      
      let bnYear = y - 593;
      let bnMonthIdx = 0;
      let bnDay = 1;

      if (m === 3) { if (d >= 14) { bnMonthIdx = 0; bnDay = d - 13; } else { bnMonthIdx = 11; bnDay = d + 15; bnYear -= 1; } }
      else if (m === 4) { if (d <= 14) { bnMonthIdx = 0; bnDay = d + 17; } else { bnMonthIdx = 1; bnDay = d - 14; } }
      else if (m === 5) { if (d <= 15) { bnMonthIdx = 1; bnDay = d + 16; } else { bnMonthIdx = 2; bnDay = d - 15; } }
      else if (m === 6) { if (d <= 16) { bnMonthIdx = 2; bnDay = d + 15; } else { bnMonthIdx = 3; bnDay = d - 16; } }
      else if (m === 7) { if (d <= 16) { bnMonthIdx = 3; bnDay = d + 15; } else { bnMonthIdx = 4; bnDay = d - 16; } }
      else if (m === 8) { if (d <= 16) { bnMonthIdx = 4; bnDay = d + 15; } else { bnMonthIdx = 5; bnDay = d - 16; } }
      else if (m === 9) { if (d <= 16) { bnMonthIdx = 5; bnDay = d + 15; } else { bnMonthIdx = 6; bnDay = d - 16; } }
      else if (m === 10) { if (d <= 15) { bnMonthIdx = 6; bnDay = d + 15; } else { bnMonthIdx = 7; bnDay = d - 15; } }
      else if (m === 11) { if (d <= 15) { bnMonthIdx = 7; bnDay = d + 15; } else { bnMonthIdx = 8; bnDay = d - 15; } }
      else if (m === 0) { if (d <= 13) { bnMonthIdx = 8; bnDay = d + 17; bnYear -= 1; } else { bnMonthIdx = 9; bnDay = d - 13; bnYear -= 1; } }
      else if (m === 1) { if (d <= 12) { bnMonthIdx = 9; bnDay = d + 18; bnYear -= 1; } else { bnMonthIdx = 10; bnDay = d - 12; bnYear -= 1; } }
      else if (m === 2) { if (d <= 14) { bnMonthIdx = 10; bnDay = d + 16; bnYear -= 1; } else { bnMonthIdx = 11; bnDay = d - 14; bnYear -= 1; } }

      const bangabdha = language === 'bn'
        ? `${bnDay.toLocaleString('bn-BD')} ${bnMonths[bnMonthIdx]}, ${bnYear.toLocaleString('bn-BD')} বঙ্গাব্দ`
        : `${bnDay} ${bnMonths[bnMonthIdx]}, ${bnYear} Bangabdha`;

      setDates({ enDate, bnGregorian, hijriDate, bangabdha, isLoading: false });
    };

    fetchDates();
    // Update dates at midnight
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timeout = setTimeout(fetchDates, msUntilMidnight);
    return () => clearTimeout(timeout);
  }, [language]);

  const timeString = currentTime.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });

  const dailyHadith = hadiths[0];
  const hadithText = language === 'bn' ? dailyHadith.text_bn : dailyHadith.text;
  const hadithNarrator = language === 'bn' ? dailyHadith.narrator_bn : dailyHadith.narrator;
  const hadithSource = language === 'bn' ? dailyHadith.source_bn : dailyHadith.source;

  const quickLinks = [
    { label: t.nav.prayer, icon: Clock, path: '/prayer', color: 'bg-emerald-100 text-emerald-700' },
    { label: t.nav.quran, icon: BookOpen, path: '/quran', color: 'bg-amber-100 text-amber-700' },
    { label: t.nav.hadith, icon: Book, path: '/hadith', color: 'bg-blue-100 text-blue-700' },
    { label: t.nav.tasbih, icon: Fingerprint, path: '/tasbih', color: 'bg-purple-100 text-purple-700' },
    { label: t.nav.dua, icon: Heart, path: '/dua', color: 'bg-rose-100 text-rose-700' },
    { label: t.nav.ramadan, icon: Moon, path: '/ramadan', color: 'bg-indigo-100 text-indigo-700' },
  ];

  return (
    <div className="space-y-10 pb-24">
      <section className="relative bg-emerald-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl shadow-emerald-900/30">
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <Moon size={24} className="text-gold-400" />
            </div>
            <div>
              <p className="text-emerald-300 text-xs font-black uppercase tracking-[0.3em] mb-1 opacity-70">{t.home.welcome}</p>
              <h1 className="text-2xl font-black tracking-tighter uppercase font-display">Deen Zone</h1>
            </div>
          </motion.div>

          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black font-display tracking-tight leading-none tabular-nums">
              {timeString}
            </h2>

            <div className="flex flex-wrap gap-3 pt-4">
              <AnimatePresence mode="wait">
                {dates.isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 animate-pulse"
                  >
                    <RefreshCw size={14} className="animate-spin text-emerald-300" />
                    <span className="text-xs font-bold text-emerald-300">Calculating Dates...</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="dates"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-wrap gap-3"
                  >
                    <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 transition-all px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl group">
                      <Calendar size={16} className="text-gold-400 group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-300 font-black opacity-60 leading-none mb-1.5">Gregorian</span>
                        <span className="text-sm font-bold leading-none">{language === 'bn' ? dates.bnGregorian : dates.enDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl group">
                      <Moon size={16} className="text-gold-400 group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-300 font-black opacity-60 leading-none mb-1.5">Hijri</span>
                        <span className="text-sm font-bold arabic-text leading-none">{dates.hijriDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gold-400/10 hover:bg-gold-400/15 transition-all px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl group">
                      <BookOpen size={16} className="text-gold-400 group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-300 font-black opacity-60 font-bengali leading-none mb-1.5">বঙ্গাব্দ</span>
                        <span className="text-sm font-bold font-bengali leading-none">{dates.bangabdha}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-emerald-100 text-xl font-medium italic opacity-80 pt-4 max-w-xl">
              "{t.home.tagline}"
            </p>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-800 rounded-full blur-[100px] opacity-40" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px] opacity-20" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Book size={240} />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-10">
          {/* Quick Links Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter font-display">{t.home.quickAccess}</h3>
              <div className="h-1 w-12 bg-gold-400 rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <motion.button
                  key={link.label}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(link.path)}
                  className="flex flex-col items-center gap-4 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
                >
                  <div className={`p-4 rounded-2xl ${link.color} transition-all group-hover:rotate-6 group-hover:scale-110 shadow-inner`}>
                    <link.icon size={28} />
                  </div>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] text-center">{link.label}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Spiritual Quote Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group h-full">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter font-display">{t.home.verseOfDay}</h2>
                </div>
                <div className="space-y-8 flex-1">
                  <p className="arabic-text text-4xl text-right leading-[1.8] text-emerald-950 font-bold">
                    فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْکُرُوا۟ لِى وَلَا تَكْفُرُونِ
                  </p>
                  <div className="pt-8 border-t border-slate-50 mt-auto">
                    <p className="text-slate-600 leading-relaxed italic text-lg opacity-80">
                      "{t.home.verseText}"
                    </p>
                    <p className="text-xs font-black text-emerald-700 mt-6 uppercase tracking-[0.3em] font-display">{t.home.verseRef}</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-40 group-hover:bg-emerald-100 transition-colors" />
            </section>

            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group h-full">
               <div className="absolute top-8 right-8 text-emerald-50/50 group-hover:text-emerald-100/70 transition-colors pointer-events-none">
                 <Quote size={120} />
               </div>
               <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="w-1.5 h-8 bg-gold-500 rounded-full" />
                   <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter font-display">{t.home.hadithOfDay}</h2>
                 </div>
                 <div className="space-y-8 flex-1">
                   <p className="text-slate-700 text-2xl leading-relaxed font-bold italic font-display">
                     "{hadithText}"
                   </p>
                   <div className="pt-8 border-t border-slate-50 mt-auto">
                     <p className="text-xs text-gold-600 font-black uppercase tracking-[0.3em] mb-2">{t.hadith.narratedBy} {hadithNarrator}</p>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{hadithSource}</p>
                   </div>
                 </div>
               </div>
             </section>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Daily Amal / Tasks */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter font-display">{t.home.dailyAmal}</h3>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">৩ {t.home.goals}</span>
            </div>
            <ul className="space-y-6">
               {t.home.tasks.map((task: string, i: number) => (
                 <li key={i} className="flex items-center gap-5 text-slate-700 group cursor-pointer">
                   <div className="relative flex items-center">
                     <input 
                       type="checkbox" 
                       className="w-7 h-7 rounded-xl border-2 border-slate-200 accent-emerald-600 cursor-pointer peer transition-all hover:border-emerald-400" 
                     />
                   </div>
                   <span className="text-lg font-bold group-hover:text-emerald-700 transition-colors">{task}</span>
                 </li>
               ))}
            </ul>
          </div>

          {/* Charity Card */}
          <div className="bg-gold-50 border border-gold-100 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="font-black text-emerald-950 text-2xl mb-6 uppercase tracking-tighter font-display">{t.home.charity}</h3>
              <p className="text-emerald-900 text-base mb-10 leading-relaxed font-medium">
                {t.home.charityQuote} <br/>
                <span className="text-[10px] m-1 font-black uppercase tracking-widest opacity-60">
                  ({language === 'bn' ? 'সহীহ মুসলিম' : 'Sahih Muslim'})
                </span>
              </p>
              <button className="mt-auto w-full bg-emerald-900 text-white font-black py-5 rounded-2xl font-display hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 uppercase tracking-[0.2em] text-xs">
                {t.home.donateNow}
              </button>
            </div>
            <Heart size={160} className="absolute -right-8 -bottom-8 text-gold-200/40 group-hover:scale-110 transition-transform duration-1000 -rotate-12 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
