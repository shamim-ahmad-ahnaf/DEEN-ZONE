import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Mic2, Play, Pause, Headphones, ListMusic } from 'lucide-react';
import { audioItems, AudioItem } from '../data/media';

import { useLanguage } from '../contexts/LanguageContext';

export default function Audio() {
  const { t } = useLanguage();
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (item: AudioItem) => {
    if (playingId === item.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = item.url;
        audioRef.current.play();
        setPlayingId(item.id);
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-white">{t.audio.title}</h1>
          <p className="text-emerald-100 opacity-80">{t.audio.subtitle}</p>
        </div>
        <Headphones size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </section>

      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingId(null)}
        className="hidden"
      />

      <div className="grid gap-4">
        {audioItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
              p-6 rounded-3xl border flex items-center justify-between transition-all
              ${playingId === item.id 
                ? 'bg-emerald-50 border-emerald-300 shadow-md ring-2 ring-emerald-500/20' 
                : 'bg-white border-slate-100 shadow-sm'}
            `}
          >
            <div className="flex items-center gap-5">
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
                ${playingId === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}
              `}>
                {playingId === item.id ? (
                  <div className="flex gap-1 items-end h-6">
                    <motion.div animate={{ height: [8, 20, 12, 24, 8] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-white rounded-full" />
                    <motion.div animate={{ height: [12, 8, 24, 16, 12] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white rounded-full" />
                    <motion.div animate={{ height: [20, 16, 8, 12, 20] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-white rounded-full" />
                  </div>
                ) : (
                  <Mic2 size={24} />
                )}
              </div>
              <div>
                <h3 className={`font-bold ${playingId === item.id ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">By {item.reciter}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.duration}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => togglePlay(item)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90
                ${playingId === item.id ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-emerald-900 text-white hover:bg-emerald-800'}
              `}
            >
              {playingId === item.id ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center">
        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
          <ListMusic className="text-emerald-600" size={32} />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">{t.audio.playlistTitle}</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-xs leading-relaxed">
          {t.audio.playlistDesc}
        </p>
        <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-white hover:shadow-md transition-all active:scale-95">
          {t.common.comingSoon}
        </button>
      </div>
    </div>
  );
}
