import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic2, Play, Pause, Headphones, ListMusic, Search, Music, Mic, Book, Plus, X, Trash2 } from 'lucide-react';
import { audioItems as initialAudioItems, AudioItem } from '../data/media';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Audio() {
  const { t, language } = useLanguage();
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<AudioItem['category']>('Quran');
  const [searchTerm, setSearchTerm] = useState('');
  const [pausedId, setPausedId] = useState<number | null>(null);
  const [userTracks, setUserTracks] = useLocalStorage<AudioItem[]>('user_audio_tracks', []);
  const [deletedAudioIds, setDeletedAudioIds] = useLocalStorage<number[]>('deleted_audio_ids', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [newTrack, setNewTrack] = useState({
    title: '',
    title_bn: '',
    artist: '',
    artist_bn: '',
    url: '',
    category: 'Nasheed' as AudioItem['category']
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const allAudioItems = useMemo(() => {
    return [...initialAudioItems, ...userTracks].filter(a => !deletedAudioIds.some(dId => String(dId) === String(a.id)));
  }, [userTracks, deletedAudioIds]);

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrack.title || !newTrack.url) return;

    const track: AudioItem = {
      id: Date.now(), // Unique ID
      title: newTrack.title,
      title_bn: newTrack.title_bn || newTrack.title,
      artist: newTrack.artist || 'Unknown',
      artist_bn: newTrack.artist_bn || newTrack.artist || 'অজানা',
      url: newTrack.url,
      category: newTrack.category
    };

    setUserTracks(prev => [...prev, track]);
    setIsAddModalOpen(false);
    setNewTrack({
      title: '',
      title_bn: '',
      artist: '',
      artist_bn: '',
      url: '',
      category: 'Nasheed'
    });
  };

  const handleDeleteTrack = (id: number) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
    setUserTracks(prev => prev.filter(t => t.id !== id));
    setDeletedAudioIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const togglePlay = (item: AudioItem) => {
    if (!audioRef.current) return;

    if (playingId === item.id) {
      audioRef.current.pause();
      setPlayingId(null);
      setPausedId(item.id);
    } else {
      try {
        const isResuming = pausedId === item.id;
        
        if (!isResuming) {
          audioRef.current.pause();
          audioRef.current.src = item.url;
          audioRef.current.load();
        }
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayingId(item.id);
              setPausedId(null);

              if ('mediaSession' in navigator) {
                try {
                  const trackTitle = language === 'bn' ? item.title_bn : item.title;
                  const trackArtist = language === 'bn' ? item.artist_bn : item.artist;
                  navigator.mediaSession.metadata = new MediaMetadata({
                    title: trackTitle,
                    artist: trackArtist,
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
            })
            .catch((error) => {
              if (error.name !== 'AbortError') {
                console.error("Playback failed:", error.name);
                setPlayingId(null);
              }
            });
        }
      } catch (e) {
        console.error("Audio trigger failed:", e);
        setPlayingId(null);
      }
    }
  };

  const categories: { key: AudioItem['category']; label: string; icon: any }[] = [
    { key: 'Quran', label: language === 'bn' ? 'কুরআন তিলাওয়াত' : 'Quran', icon: Book },
    { key: 'Nasheed', label: language === 'bn' ? 'ইসলামিক সঙ্গীত' : 'Nasheed', icon: Music },
    { key: 'Bayan', label: language === 'bn' ? 'ইসলাহি বয়ান' : 'Bayan', icon: Mic },
  ];

  const filteredItems = useMemo(() => {
    return allAudioItems.filter(item => {
      if (!item || !item.id || !item.title_bn) return false;
      const matchesCategory = item.category === activeCategory;
      const titleText = language === 'bn' ? item.title_bn : item.title;
      const artistText = language === 'bn' ? item.artist_bn : item.artist;
      const matchesSearch = titleText.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          artistText.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allAudioItems, activeCategory, searchTerm, language]);

  const currentlyLoadedItem = useMemo(() => {
    return allAudioItems.find(i => i.id === (playingId || pausedId));
  }, [allAudioItems, playingId, pausedId]);

  return (
    <div className="space-y-8 pb-32">
      <section className="bg-emerald-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2 text-white uppercase tracking-tighter text-balance">
            {language === 'bn' ? 'অডিও লাইব্রেরি' : t.audio.title}
          </h1>
          <p className="text-emerald-200 opacity-80 font-bold italic">{t.audio.subtitle}</p>
        </div>
        <Headphones size={180} className="absolute -right-10 -top-10 opacity-5 rotate-12" />
      </section>

      <audio 
        ref={audioRef} 
        onEnded={() => {
          setPlayingId(null);
          setPausedId(null);
        }}
        preload="auto"
        onError={(e) => {
          const error = (e.target as HTMLAudioElement).error;
          console.error("Audio Load Error:", error?.code, error?.message);
          setPlayingId(null);
        }}
        className="hidden"
      />

        <div className="flex flex-col gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none items-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`
                  px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border
                  ${activeCategory === cat.key 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 shadow-sm'}
                `}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="ml-auto p-3 bg-white text-emerald-600 border border-slate-100 rounded-full shadow-sm hover:bg-emerald-50 transition-all active:scale-90"
              title={language === 'bn' ? 'অডিও যোগ করুন' : 'Add Audio'}
            >
              <Plus size={24} />
            </button>
          </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={language === 'bn' ? 'আপনার অডিও খুঁজুন...' : 'Search your audio...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800"
          />
        </div>
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className={`
                p-6 rounded-[2.5rem] border flex items-center justify-between transition-all group
                ${playingId === item.id 
                  ? 'bg-emerald-50 border-emerald-300 shadow-xl ring-4 ring-emerald-500/10' 
                  : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-emerald-200'}
              `}
            >
              <div className="flex items-center gap-5">
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
                  ${playingId === item.id ? 'bg-emerald-600 text-white shadow-xl rotate-0 scale-110' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'}
                `}>
                  {playingId === item.id ? (
                    <div className="flex gap-1.5 items-end h-7">
                      <motion.div animate={{ height: [8, 24, 12, 28, 8] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                      <motion.div animate={{ height: [14, 8, 28, 18, 14] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                      <motion.div animate={{ height: [24, 18, 8, 14, 24] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                  ) : (
                    item.category === 'Quran' ? <Book size={28} /> : 
                    item.category === 'Nasheed' ? <Music size={28} /> : 
                    <Mic size={28} />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className={`text-xl font-black tracking-tight ${playingId === item.id ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {language === 'bn' ? item.title_bn : item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                      {language === 'bn' ? item.artist_bn : item.artist}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTrack(item.id);
                  }}
                  className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                  title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => togglePlay(item)}
                  className={`
                    w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-95
                    ${playingId === item.id ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse' : 'bg-slate-900 text-white hover:bg-emerald-900'}
                    ${pausedId === item.id ? 'bg-emerald-600 ring-4 ring-emerald-500/20' : ''}
                  `}
                >
                  {playingId === item.id ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400 font-bold italic">
            {language === 'bn' ? 'কোনো অডিও পাওয়া যায়নি।' : 'No audio found.'}
          </div>
        )}
      </div>

      {/* Floating Player Control */}
      <AnimatePresence>
        {(playingId || pausedId) && currentlyLoadedItem && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 bg-slate-900 border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-2xl p-3.5 flex items-center justify-between z-50 overflow-hidden"
          >
             <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-700
                ${playingId ? 'bg-emerald-600 shadow-emerald-500/20 rotate-0' : 'bg-slate-700 rotate-12 opacity-50'}
              `}>
                <Music size={20} className={playingId ? 'animate-pulse' : ''} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-black text-white truncate max-w-[140px] text-sm tracking-tight">
                  {language === 'bn' ? currentlyLoadedItem.title_bn : currentlyLoadedItem.title}
                </h4>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest truncate">
                  {language === 'bn' ? currentlyLoadedItem.artist_bn : currentlyLoadedItem.artist}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <button 
                onClick={() => togglePlay(currentlyLoadedItem)}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all duration-300
                  ${playingId ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'}
                `}
              >
                {playingId ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Audio Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] p-8 w-full max-w-lg relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="sticky top-0 right-0 flex justify-end -mr-4 -mt-4 mb-4 z-20">
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="p-3 bg-slate-100/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                  {language === 'bn' ? 'অডিও যোগ করুন' : 'Add New Audio'}
                </h3>
                <p className="text-slate-500 font-bold text-sm">
                  {language === 'bn' ? 'আপনার পছন্দের অডিও লিঙ্কটি এখানে দিন' : 'Enter details and audio URL'}
                </p>
              </div>

              <form onSubmit={handleAddTrack} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Title (EN)</label>
                    <input 
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-sm"
                      value={newTrack.title}
                      onChange={e => setNewTrack({...newTrack, title: e.target.value})}
                      placeholder="e.g. Hasbi Rabbi"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Title (BN)</label>
                    <input 
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-sm"
                      value={newTrack.title_bn}
                      onChange={e => setNewTrack({...newTrack, title_bn: e.target.value})}
                      placeholder="উদা: হাসবি রাব্বি"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Artist (EN)</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-sm"
                      value={newTrack.artist}
                      onChange={e => setNewTrack({...newTrack, artist: e.target.value})}
                      placeholder="Sami Yusuf"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Artist (BN)</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-sm"
                      value={newTrack.artist_bn}
                      onChange={e => setNewTrack({...newTrack, artist_bn: e.target.value})}
                      placeholder="সামি ইউসুফ"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Category</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold appearance-none cursor-pointer text-sm"
                    value={newTrack.category}
                    onChange={e => setNewTrack({...newTrack, category: e.target.value as any})}
                  >
                    <option value="Quran">{language === 'bn' ? 'কুরআন তিলাওয়াত' : 'Quran'}</option>
                    <option value="Nasheed">{language === 'bn' ? 'ইসলামিক সঙ্গীত' : 'Nasheed'}</option>
                    <option value="Bayan">{language === 'bn' ? 'ইসলাহি বয়ান' : 'Bayan'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Direct MP3 URL</label>
                  <input 
                    required
                    type="url"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold font-mono text-xs text-emerald-600"
                    value={newTrack.url}
                    onChange={e => setNewTrack({...newTrack, url: e.target.value})}
                    placeholder="https://example.com/audio.mp3"
                  />
                  <p className="text-[10px] text-slate-400 ml-4 italic mt-1">
                    {language === 'bn' ? '* একটি সরাসরি অডিও লিংকের প্রয়োজন (উদা: .mp3 এ শেষ হওয়া ফাইল)' : '* Must be a direct link ending in .mp3'}
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all mt-2"
                >
                  {language === 'bn' ? 'অডিও যোগ করুন' : 'Add Track'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900 text-slate-400 p-10 rounded-[3rem] border border-slate-800 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-5 bg-slate-800 rounded-3xl shadow-inner mb-6 relative z-10 transition-transform group-hover:scale-110">
          <ListMusic className="text-emerald-500" size={40} />
        </div>
        <h3 className="font-black text-2xl text-white mb-2 relative z-10 uppercase tracking-tighter">
          {language === 'bn' ? 'নতুন প্লেলিস্ট' : t.audio.playlistTitle}
        </h3>
        <p className="text-slate-500 font-bold text-sm mb-8 max-w-sm leading-relaxed relative z-10 opacity-80">
          {t.audio.playlistDesc}
        </p>
        <button className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 relative z-10 border-b-4 border-slate-200 active:border-b-0">
          {t.common.comingSoon}
        </button>
      </div>
    </div>
  );
}
