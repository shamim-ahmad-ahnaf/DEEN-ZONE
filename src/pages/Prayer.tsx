import { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock as ClockIcon, MapPin, ChevronRight, Bell, RefreshCw } from 'lucide-react';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { useLanguage } from '../contexts/LanguageContext';

const PRAYER_NAMES: Record<string, { bn: string; en: string }> = {
  Fajr: { bn: 'ফজর', en: 'Fajr' },
  Sunrise: { bn: 'সূর্যোদয়', en: 'Sunrise' },
  Dhuhr: { bn: 'যোহর', en: 'Dhuhr' },
  Asr: { bn: 'আসর', en: 'Asr' },
  Maghrib: { bn: 'মাগরিব', en: 'Maghrib' },
  Isha: { bn: 'এশা', en: 'Isha' },
};

export default function Prayer() {
  const { language, t } = useLanguage();
  const now = useCurrentTime();

  const [prayerTimes, setPrayerTimes] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [location, setLocation] = useState({ city: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);

  const timeString = now.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true
  });

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
    const fetchPrayerTimes = async () => {
      setIsRefreshing(true);
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${location.city}&country=${location.country}&method=1&school=1`
        );
        const data = await res.json();
        if (data.data) {
          const timings = data.data.timings;
          const relevantPrayers = [
            { name: 'Fajr', time: timings.Fajr.split(' ')[0] },
            { name: 'Sunrise', time: timings.Sunrise.split(' ')[0] },
            { name: 'Dhuhr', time: timings.Dhuhr.split(' ')[0] },
            { name: 'Asr', time: timings.Asr.split(' ')[0] },
            { name: 'Maghrib', time: timings.Maghrib.split(' ')[0] },
            { name: 'Isha', time: timings.Isha.split(' ')[0] },
          ];
          setPrayerTimes(relevantPrayers);
        }

        // Fetch Qibla Angle
        const qiblaRes = await fetch(`https://api.aladhan.com/v1/qibla/${location.lat}/${location.lng}`);
        const qiblaData = await qiblaRes.json();
        if (qiblaData.data) {
          setQiblaAngle(qiblaData.data.direction);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchPrayerTimes();
  }, [location]);

  useEffect(() => {
    const fetchDates = async () => {
      // Gregorian
      const enDate = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      const bnGregorian = now.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
      
      // Hijri Months
      const hijriMonthsBN = ['মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'];
      const hijriMonthsEN = ['Muharram', 'Safar', 'Rabiʻ I', 'Rabiʻ II', 'Jumada I', 'Jumada II', 'Rajab', 'Shaʻban', 'Ramadan', 'Shawwal', 'Dhuʻl-Qiʻdah', 'Dhuʻl-Hijjah'];

      let hijriDate = '';
      try {
        const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
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
        }).formatToParts(now);
        const hDay = parseInt(hijriParts.find(p => p.type === 'day')?.value || '1');
        const hMonth = parseInt(hijriParts.find(p => p.type === 'month')?.value || '1');
        const hYear = parseInt(hijriParts.find(p => p.type === 'year')?.value || '1447');
        hijriDate = language === 'bn'
          ? `${hDay.toLocaleString('bn-BD')} ${hijriMonthsBN[hMonth - 1]}, ${hYear.toLocaleString('bn-BD')} হিজরি`
          : `${hDay} ${hijriMonthsEN[hMonth - 1]}, ${hYear} AH`;
      }

      // Bengali Year (Bangabdha)
      const d = now.getDate();
      const m = now.getMonth();
      const y = now.getFullYear();
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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - new Date().getTime();
    const timeout = setTimeout(fetchDates, msUntilMidnight);
    return () => clearTimeout(timeout);
  }, [language]);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // @ts-ignore
      const heading = e.webkitCompassHeading || (360 - e.alpha);
      if (heading !== undefined) setDeviceHeading(heading);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const toggleNotification = (name: string) => {
    setNotifications(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const refreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          if (data.city) {
            setLocation({ city: data.city, country: data.countryName, lat: latitude, lng: longitude });
          }
        } catch (err) {
          console.error('Reverse geocode failed:', err);
        }
      });
    }
  };

  const formatTime12h = (time24: string) => {
    if (!time24) return '--:--';
    const cleanTime = time24.split(' ')[0];
    const [hours, minutes] = cleanTime.split(':').map(Number);
    const period = hours >= 12 ? (language === 'bn' ? 'পিএম' : 'PM') : (language === 'bn' ? 'এএম' : 'AM');
    const h12 = hours % 12 || 12;
    const m = minutes.toString().padStart(2, '0');
    
    if (language === 'bn') {
      const bnNums: Record<string, string> = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
        '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
      };
      const convert = (s: string) => s.split('').map(char => bnNums[char] || char).join('');
      return `${convert(h12.toString())}:${convert(m)} ${period}`;
    }
    
    return `${h12}:${m} ${period}`;
  };

  // Calculate next prayer and countdown
  const { currentPrayer, nextPrayer, countdown } = useMemo(() => {
    if (prayerTimes.length === 0) return { currentPrayer: 'Fajr', nextPrayer: 'Fajr', countdown: '--' };

    const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    
    let currentIdx = -1;
    let nextIdx = 0;

    for (let i = 0; i < prayerTimes.length; i++) {
       const [h, m] = prayerTimes[i].time.split(':').map(Number);
       const prayerSeconds = h * 3600 + m * 60;
       if (nowSeconds >= prayerSeconds) {
         currentIdx = i;
       } else {
         nextIdx = i;
         break;
       }
    }

    if (currentIdx === -1) currentIdx = prayerTimes.length - 1;

    const nextTime = prayerTimes[nextIdx].time.split(':').map(Number);
    let diff = (nextTime[0] * 3600 + nextTime[1] * 60) - nowSeconds;
    if (diff < 0) diff += 24 * 3600;

    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    const bnNums: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    const toBn = (n: number) => n.toString().split('').map(c => bnNums[c] || c).join('');

    return {
      currentPrayer: prayerTimes[currentIdx].name,
      nextPrayer: prayerTimes[nextIdx].name,
      countdown: language === 'bn' 
        ? `${toBn(h)} ঘণ্টা ${toBn(m)} মিনিট ${toBn(s)} সেকেন্ড` 
        : `${h}h ${m}m ${s}s`
    };
  }, [now, language, prayerTimes]);

  return (
    <div className="space-y-6 pb-16">
      <section className="bg-emerald-900 rounded-[2.5rem] p-6 md:p-8 text-white text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <button 
            onClick={refreshLocation}
            className="flex items-center justify-center gap-2 text-emerald-200 font-bold mb-4 mx-auto hover:text-white transition-colors"
          >
            <MapPin size={16} className={isRefreshing ? 'animate-bounce' : ''} />
            <span className="text-sm md:text-base">
              {location.city === 'Dhaka' ? t.prayer.dhaka : `${location.city}, ${location.country}`}
            </span>
          </button>
          
          <div className="mb-8 md:mb-6">
             <div className="text-4xl md:text-6xl font-black tabular-nums tracking-tighter mb-8 transition-all hover:scale-110 cursor-default">
              {timeString}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-4 min-h-[60px]">
              {dates.isLoading ? (
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 animate-pulse">
                  <RefreshCw size={14} className="animate-spin text-emerald-300" />
                  <span className="text-[10px] font-bold text-emerald-300">Calculating Dates...</span>
                </div>
              ) : (
                <>
                  <div className="bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-2xl text-[10px] md:text-xs font-bold text-emerald-100 border border-white/10 backdrop-blur-md shadow-xl transition-all group min-w-[140px]">
                    <span className="opacity-40 block text-[8px] uppercase tracking-widest mb-1 group-hover:opacity-100 transition-opacity">Gregorian</span>
                    {language === 'bn' ? dates.bnGregorian : dates.enDate}
                  </div>
                  <div className="bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2.5 rounded-2xl text-[10px] md:text-xs font-bold text-emerald-100 border border-white/10 backdrop-blur-md shadow-xl transition-all group min-w-[140px] arabic-text">
                    <span className="opacity-40 block text-[8px] uppercase tracking-widest mb-1 group-hover:opacity-100 transition-opacity">Hijri</span>
                    {dates.hijriDate}
                  </div>
                  <div className="bg-gold-400/10 hover:bg-gold-400/20 px-4 py-2.5 rounded-2xl text-[10px] md:text-xs font-bold text-emerald-100 border border-white/10 backdrop-blur-md shadow-xl transition-all group min-w-[140px] font-bengali">
                    <span className="opacity-40 block text-[8px] uppercase tracking-widest mb-1 group-hover:opacity-100 transition-opacity">বঙ্গাব্দ</span>
                    {dates.bangabdha}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-[2rem] p-5 md:p-6 shadow-xl">
            <h2 className="text-[10px] md:text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1">{t.prayer.current}</h2>
            <div className="text-2xl md:text-3xl font-bold mb-2">
              {PRAYER_NAMES[currentPrayer] ? PRAYER_NAMES[currentPrayer][language] : '...'}
            </div>
            <div className="text-emerald-100 text-xs md:text-sm">
              {t.prayer.next}: {PRAYER_NAMES[nextPrayer] ? PRAYER_NAMES[nextPrayer][language] : '...'} {t.prayer.countdown} <span className="font-bold text-gold-400">{countdown}</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 opacity-5 rotate-12">
           <ClockIcon size={200} />
        </div>
      </section>

      <motion.div 
        layout
        className="grid gap-3"
      >
        {prayerTimes.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-bold">
            <RefreshCw size={24} className="animate-spin mx-auto mb-4" />
            Loading Prayer Times...
          </div>
        ) : prayerTimes.map((prayer, i) => {
          const isCurrent = prayer.name === currentPrayer;
          const translatedName = PRAYER_NAMES[prayer.name] ? PRAYER_NAMES[prayer.name][language] : prayer.name;
          const isNotified = notifications[prayer.name];

          return (
            <motion.div 
              key={prayer.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`
                flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-all
                ${isCurrent 
                  ? 'bg-white border-emerald-500 shadow-[0_10px_30px_rgba(5,150,105,0.1)] scale-[1.02]' 
                  : 'bg-white border-slate-100 shadow-sm opacity-80'}
              `}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`
                  p-2.5 md:p-3 rounded-xl
                  ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'}
                `}>
                  <ClockIcon size={18} className="md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className={`text-sm md:text-base font-bold ${isCurrent ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {translatedName}
                  </h3>
                  <p className="text-[10px] md:text-sm text-slate-500 font-medium">{formatTime12h(prayer.time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                {isCurrent && (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider">
                    {t.prayer.currentStatus}
                  </span>
                )}
                <button 
                  onClick={() => toggleNotification(prayer.name)}
                  className={`p-2 rounded-lg transition-colors ${isNotified ? 'bg-emerald-100 text-emerald-600' : 'text-slate-300 hover:bg-slate-50'}`}
                >
                  <Bell size={18} fill={isNotified ? "currentColor" : "none"} className="md:w-5 md:h-5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between shadow-sm">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{t.prayer.qibla}</h3>
          <p className="text-slate-500 text-sm">
            {qiblaAngle ? `${Math.round(qiblaAngle)}°` : 'Calculating...'}
            {deviceHeading !== null && ' (Compass Active)'}
          </p>
        </div>
        <div className="relative w-16 h-16 bg-slate-50 rounded-full border-2 border-slate-100 flex items-center justify-center overflow-hidden">
           {/* Compass Rose Backdrop */}
           <div className="absolute inset-0 opacity-10 flex items-center justify-center">
             <div className="w-full h-0.5 bg-slate-400 rotate-0" />
             <div className="w-full h-0.5 bg-slate-400 rotate-90" />
           </div>
           
           <motion.div 
             animate={{ rotate: (qiblaAngle || 0) - (deviceHeading || 0) }}
             transition={{ type: "spring", stiffness: 50, damping: 20 }}
             className="text-emerald-600 relative z-10"
           >
             <ChevronRight size={32} className="-rotate-90" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-600/20 rounded-full" />
           </motion.div>
        </div>
      </div>
    </div>
  );
}
