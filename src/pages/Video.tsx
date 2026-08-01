import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, PlayCircle, X, Search, Youtube, Plus, Video as VideoIcon, Mic2, Baby, Music, Trash2, Upload, Link as LinkIcon, FileVideo } from 'lucide-react';
import { videoItems as initialVideoItems, VideoItem } from '../data/media';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { DeleteConfirmModal, UndoToast } from '../components/common/DeleteConfirmModal';

export default function Video() {
  const { language } = useLanguage();
  const { deleteDialog, undoToast, requestDelete, closeDialog, closeToast } = useDeleteWithUndo();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<VideoItem['category'] | 'All'>('All');
  const [userVideos, setUserVideos] = useLocalStorage<VideoItem[]>('user_video_tracks', []);
  const [deletedVideoIds, setDeletedVideoIds] = useLocalStorage<number[]>('deleted_video_ids', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMethod, setAddMethod] = useState<'link' | 'file'>('link');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [newVideo, setNewVideo] = useState({
    title: '',
    speaker: '',
    youtubeId: '',
    videoUrl: '',
    category: 'Lecture' as string
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const allVideos = useMemo(() => {
    return [...initialVideoItems, ...userVideos].filter(v => !deletedVideoIds.some(dId => String(dId) === String(v.id)));
  }, [userVideos, deletedVideoIds]);

  const categories = useMemo(() => {
    const baseKeys = ['All', 'Lecture', 'Quran', 'Kids', 'Nasheed'];
    const customKeys = Array.from(new Set(allVideos.map(v => v.category))).filter((c): c is string => typeof c === 'string' && !baseKeys.includes(c));
    
    const baseList = [
      { key: 'All', label: language === 'bn' ? 'সবগুলো' : 'All', icon: VideoIcon },
      { key: 'Lecture', label: language === 'bn' ? 'ইসলামিক বয়ান' : 'Lecture', icon: Mic2 },
      { key: 'Quran', label: language === 'bn' ? 'কুরআন তিলাওয়াত' : 'Quran', icon: PlayCircle },
      { key: 'Kids', label: language === 'bn' ? 'শিশুদের পাতা' : 'Kids', icon: Baby },
      { key: 'Nasheed', label: language === 'bn' ? 'ইসলামিক সঙ্গীত' : 'Nasheed', icon: Music },
    ];

    const customList = customKeys.map(k => ({
      key: k,
      label: k,
      icon: VideoIcon
    }));

    return [...baseList, ...customList];
  }, [allVideos, language]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewVideo(prev => ({ ...prev, videoUrl: url }));
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalType: 'youtube' | 'direct' | 'external' = 'external';
    let yid = '';
    let vurl = '';

    if (addMethod === 'link') {
      const url = newVideo.videoUrl.trim() || newVideo.youtubeId.trim();
      
      // Check if YouTube
      const ytPatterns = [
        /(?:v=|\/)([0-9A-Za-z_-]{11}).*/,
        /youtu\.be\/([0-9A-Za-z_-]{11})/,
        /embed\/([0-9A-Za-z_-]{11})/,
        /^([0-9A-Za-z_-]{11})$/
      ];

      for (const pattern of ytPatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          yid = match[1];
          finalType = 'youtube';
          break;
        }
      }

      if (finalType !== 'youtube') {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        const isDirectVideo = videoExtensions.some(ext => url.toLowerCase().includes(ext));
        vurl = url;
        finalType = isDirectVideo ? 'direct' : 'external';
      }
    } else {
      vurl = newVideo.videoUrl.trim();
      if (!vurl) {
        alert(language === 'bn' ? 'দয়া করে ভিডিও ফাইল সিলেক্ট করুন' : 'Please select a video file');
        return;
      }
      finalType = 'direct';
    }

    if (!newVideo.title.trim()) return;

    const trackTitle = newVideo.title.trim();
    const trackSpeaker = newVideo.speaker.trim();
    const finalCategory = isCustomCategory ? (customCategoryInput.trim() || (language === 'bn' ? 'সাধারণ' : 'General')) : newVideo.category;

    const track: VideoItem = {
      id: Date.now(),
      title: trackTitle,
      title_bn: trackTitle,
      speaker: trackSpeaker || 'User',
      speaker_bn: trackSpeaker || 'ব্যবহারকারী',
      youtubeId: yid || undefined,
      videoUrl: vurl || undefined,
      type: finalType,
      category: finalCategory
    };

    setUserVideos(prev => [...prev, track]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewVideo({
      title: '',
      speaker: '',
      youtubeId: '',
      videoUrl: '',
      category: 'Lecture'
    });
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setAddMethod('link');
  };

  const confirmDeleteVideo = (video: VideoItem) => {
    const videoTitle = language === 'bn' ? video.title_bn : video.title;
    const isUserVideo = userVideos.some(v => String(v.id) === String(video.id));
    requestDelete(
      videoTitle,
      () => {
        setDeletedVideoIds(prev => prev.includes(video.id) ? prev : [...prev, video.id]);
      },
      () => {
        setDeletedVideoIds(prev => prev.filter(dId => String(dId) !== String(video.id)));
        if (isUserVideo) {
          setUserVideos(prev => prev.some(v => String(v.id) === String(video.id)) ? prev : [...prev, video]);
        }
      }
    );
  };

  const filteredVideos = useMemo(() => {
    return allVideos.filter(v => {
      const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
      const titleText = language === 'bn' ? v.title_bn : v.title;
      const speakerText = language === 'bn' ? v.speaker_bn : v.speaker;
      const matchesSearch = 
        titleText.toLowerCase().includes(search.toLowerCase()) || 
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        speakerText.toLowerCase().includes(search.toLowerCase()) ||
        v.speaker.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allVideos, activeCategory, search, language]);

  return (
    <div className="space-y-8 pb-32">
      <section className="bg-rose-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-rose-600/20">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/30"
          >
            <VideoIcon size={32} className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
            {language === 'bn' ? 'ইসলামিক ভিডিও' : 'Islamic Videos'}
          </h1>
          <div className="flex flex-wrap gap-3">
             <p className="text-rose-100 font-bold text-lg opacity-90 tracking-tight leading-tight">
               {language === 'bn' ? 'সেরা বক্তাদের বয়ান ও তিলাওয়াত দেখুন' : 'Watch inspiring lectures and soulful recitations'}
             </p>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 opacity-10 rotate-12">
          <PlayCircle size={300} />
        </div>
      </section>

      <div className="flex flex-col gap-6">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none items-center">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key as any)}
              className={`
                px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border
                ${activeCategory === cat.key 
                  ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/20' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-rose-200 shadow-sm'}
              `}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="ml-auto flex items-center gap-2 px-6 py-3 bg-white text-rose-600 border border-slate-100 rounded-full shadow-sm hover:bg-rose-50 transition-all font-black text-xs uppercase tracking-widest"
          >
            <Plus size={20} />
            {language === 'bn' ? 'নতুন ভিডিও' : 'Add New'}
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={language === 'bn' ? 'ভিডিও খুঁজুন...' : 'Search videos...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode='popLayout'>
          {filteredVideos.map((video) => (
            <motion.div
              layout
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => {
                if (video.type === 'external') {
                  window.open(video.videoUrl, '_blank');
                } else {
                  setSelectedVideo(video);
                }
              }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              <div className="relative aspect-video bg-slate-900">
                {video.type === 'youtube' ? (
                  <img 
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                    alt={language === 'bn' ? video.title_bn : video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                ) : video.type === 'direct' ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                    <FileVideo size={64} className="opacity-20" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-rose-900 text-rose-200/20">
                    <LinkIcon size={64} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-center justify-center">
                  <div className="flex gap-4">
                    {video.type === 'youtube' && (
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-rose-600 transition-all duration-500">
                        <Play size={28} fill="currentColor" className="ml-1" />
                      </div>
                    )}
                    {video.type === 'direct' && (
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-500">
                        <Play size={28} fill="currentColor" className="ml-1" />
                      </div>
                    )}
                    {video.type === 'external' && (
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                        <LinkIcon size={28} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-4 py-2 bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-rose-600/20">
                    {language === 'bn' ? categories.find(c => c.key === video.category)?.label : video.category}
                  </span>
                  {video.type === 'direct' && (
                    <span className="px-4 py-2 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">
                      {language === 'bn' ? 'সরাসরি ভিডিও' : 'Direct File'}
                    </span>
                  )}
                  {video.type === 'external' && (
                    <span className="px-4 py-2 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg">
                      {language === 'bn' ? 'লিঙ্ক' : 'Link'}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteVideo(video);
                  }}
                  className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-md text-slate-800 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-lg z-10"
                  title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-rose-600 transition-colors tracking-tight leading-tight">
                  {language === 'bn' ? video.title_bn : video.title}
                </h3>
                <div className="flex items-center gap-3 text-slate-400 font-bold text-sm tracking-wide">
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-rose-600 font-black text-xs">
                      {video.speaker.charAt(0)}
                   </div>
                   <span>{language === 'bn' ? video.speaker_bn : video.speaker}</span>
                   <span className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-widest font-black">
                      {video.type === 'youtube' ? <><Youtube size={14} className="text-rose-500" /> YouTube</> : video.type === 'direct' ? <><FileVideo size={14} className="text-emerald-500" /> Direct Player</> : <><LinkIcon size={14} className="text-blue-500" /> External Link</>}
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-2xl"
            >
              {/* Atmospheric Background Gradients */}
              <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-6xl aspect-video bg-[#1a1a1e] rounded-[2rem] md:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden border border-white/5 group"
            >
              {/* Header - Floating overlay to maximize video space */}
              <div className="absolute top-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 flex items-start justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="pointer-events-auto">
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-lg">
                    {language === 'bn' ? selectedVideo.title_bn : selectedVideo.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {language === 'bn' ? selectedVideo.speaker_bn : selectedVideo.speaker}
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/60 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10">
                      {selectedVideo.type === 'youtube' ? 'YouTube' : 'Direct'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="pointer-events-auto p-4 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-rose-600 transition-all duration-300 hover:scale-110 border border-white/20 active:scale-95"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Video Content */}
              <div className="w-full h-full bg-black flex items-center justify-center relative">
                {selectedVideo.type === 'youtube' ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={language === 'bn' ? selectedVideo.title_bn : selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 border-0"
                  ></iframe>
                ) : (
                  <video 
                    src={selectedVideo.videoUrl} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay
                    playsInline
                  />
                )}

                {/* Corner Accents - Technical feel */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/20 pointer-events-none opacity-50" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/20 pointer-events-none opacity-50" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/20 pointer-events-none opacity-50" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/20 pointer-events-none opacity-50" />
              </div>

              {/* Bottom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 flex flex-col md:flex-row items-center justify-between gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="flex items-center gap-4 pointer-events-auto">
                   <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-rose-500 border border-white/10">
                      {selectedVideo.type === 'youtube' ? <Youtube size={24} /> : <FileVideo size={24} />}
                   </div>
                   <div>
                     <p className="text-[10px] text-white/40 font-black uppercase tracking-[2px]">Now Watching</p>
                     <p className="text-sm text-white/80 font-bold">
                        {language === 'bn' ? 'ইসলামিক পরিবেশ' : 'Immersive Islamic Media'}
                     </p>
                   </div>
                </div>

                <div className="flex gap-3 pointer-events-auto">
                   {selectedVideo.type === 'youtube' && (
                     <a 
                       href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-black/50"
                     >
                       <Youtube size={18} />
                       {language === 'bn' ? 'ইউটিউবে দেখুন' : 'YouTube'}
                     </a>
                   )}
                   <button 
                     onClick={() => setSelectedVideo(null)}
                     className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
                   >
                     {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Video Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
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
              className="bg-white rounded-[3rem] p-8 w-full max-w-xl relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                    {language === 'bn' ? 'নতুন ভিডিও' : 'Add New Video'}
                  </h3>
                  <p className="text-slate-500 font-bold text-sm">
                    {language === 'bn' ? 'আপনার পছন্দের ভিডিওটি এখানে যোগ করুন' : 'Add your favorite video to the library'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="p-3 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Method Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                <button 
                  onClick={() => setAddMethod('link')}
                  className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${addMethod === 'link' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <LinkIcon size={16} /> {language === 'bn' ? 'লিঙ্ক' : 'Link'}
                </button>
                <button 
                  onClick={() => setAddMethod('file')}
                  className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${addMethod === 'file' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <Upload size={16} /> {language === 'bn' ? 'ফাইল/ডাউনলোড' : 'File'}
                </button>
              </div>

              <form onSubmit={handleAddVideo} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                    {language === 'bn' ? 'শিরোনাম / টাইটেল' : 'Title'}
                  </label>
                  <input 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none font-bold text-sm"
                    value={newVideo.title}
                    onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                    placeholder={language === 'bn' ? 'যেমন: মৃত্যুর পরের জীবন' : 'e.g. Life After Death'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                    {language === 'bn' ? 'বক্তা / স্পিকার' : 'Speaker'}
                  </label>
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none font-bold text-sm"
                    value={newVideo.speaker}
                    onChange={e => setNewVideo({...newVideo, speaker: e.target.value})}
                    placeholder={language === 'bn' ? 'যেমন: মুফতি মেঙ্ক (ঐচ্ছিক)' : 'e.g. Mufti Menk (Optional)'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.filter(c => c.key !== 'All').map(cat => (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(false);
                          setNewVideo({...newVideo, category: cat.key});
                        }}
                        className={`py-3 px-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${(!isCustomCategory && newVideo.category === cat.key) ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(true)}
                      className={`py-3 px-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${isCustomCategory ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {language === 'bn' ? '+ নতুন ক্যাটাগরি' : '+ Custom Category'}
                    </button>
                  </div>

                  {isCustomCategory && (
                    <div className="pt-2">
                      <input 
                        required={isCustomCategory}
                        className="w-full px-5 py-3 bg-rose-50/50 border border-rose-200 rounded-xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none font-bold text-xs text-rose-900"
                        value={customCategoryInput}
                        onChange={e => setCustomCategoryInput(e.target.value)}
                        placeholder={language === 'bn' ? 'ক্যাটাগরির নাম লিখুন (যেমন: তাফসীর, সিরাত, গজল)' : 'Type category name (e.g., Tafseer, Seerah)'}
                      />
                    </div>
                  )}
                </div>

                {addMethod === 'link' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Video URL (YouTube or Direct)</label>
                    <div className="relative">
                      <LinkIcon size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        required
                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none font-bold text-xs text-rose-600"
                        value={newVideo.videoUrl}
                        onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})}
                        placeholder="https://youtube.com/... or https://site.com/video.mp4"
                      />
                    </div>
                  </div>
                )}

                {addMethod === 'file' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Select Video File</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-all group"
                    >
                      <input 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                      <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 group-hover:text-rose-600 group-hover:bg-white transition-all">
                        {newVideo.videoUrl ? <FileVideo size={32} /> : <Upload size={32} />}
                      </div>
                      <p className="font-bold text-slate-500 text-sm">
                        {newVideo.videoUrl ? (language === 'bn' ? 'ফাইল রেডি' : 'File Ready') : (language === 'bn' ? 'ফাইল সিলেক্ট করুন' : 'Select file')}
                      </p>
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-rose-700 shadow-2xl shadow-rose-600/30 active:scale-95 transition-all"
                >
                  {language === 'bn' ? 'ভিডিও যোগ করুন' : 'Add Video Now'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900 text-slate-400 p-12 rounded-[4rem] border border-slate-800 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-6 bg-slate-800 rounded-3xl shadow-inner mb-8 relative z-10 transition-transform group-hover:scale-110">
          <FileVideo className="text-rose-600" size={48} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase relative z-10 transition-colors group-hover:text-rose-400">
          {language === 'bn' ? 'স্মার্ট ভিডিও প্লেয়ার' : 'Smart Video Player'}
        </h2>
        <p className="max-w-md font-bold text-slate-500 text-lg leading-relaxed relative z-10 group-hover:text-slate-400">
          {language === 'bn' ? 'এখন আপনি ইউটিউবের পাশাপাশি নিজের সরাসরি ভিডিও ফাইল বা লিংক যোগ করে দেখতে পারবেন কোনো সমস্যা ছাড়াই।' : 'Now you can add direct video files or links alongside YouTube and watch them seamlessly.'}
        </p>
      </div>

      <DeleteConfirmModal
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        onClose={closeDialog}
        onConfirm={deleteDialog.onConfirm!}
        language={language}
      />

      <UndoToast
        isOpen={undoToast.isOpen}
        message={undoToast.message}
        onUndo={undoToast.onUndo!}
        onClose={closeToast}
        language={language}
      />
    </div>
  );
}

