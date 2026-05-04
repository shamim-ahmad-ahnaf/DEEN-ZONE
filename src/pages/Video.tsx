import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, PlayCircle, X, Search, Youtube } from 'lucide-react';
import { videoItems, VideoItem } from '../data/media';

import { useLanguage } from '../contexts/LanguageContext';

export default function Video() {
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [search, setSearch] = useState('');

  const filteredVideos = videoItems.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase()) || 
    v.speaker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <section className="bg-rose-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 text-white">{t.video.title}</h1>
          <p className="text-rose-100 opacity-80">{t.video.subtitle}</p>
        </div>
        <PlayCircle size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </section>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder={t.video.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-video bg-slate-100">
              <img 
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-md">
                  {video.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-rose-600 transition-colors line-clamp-1">
                {video.title}
              </h3>
              <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                 <span>By {video.speaker}</span>
                 <span className="opacity-50 text-emerald-950">•</span>
                 <span className="flex items-center gap-1"><Youtube size={14} className="text-rose-500" /> YouTube</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl bg-white rounded-[2.5rem] shadow-2xl z-[110] overflow-hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{selectedVideo.title}</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.video.speaker}: {selectedVideo.speaker}</p>
                </div>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6 bg-slate-50/50 flex justify-center">
                 <p className="text-xs text-slate-400 font-medium italic italic italic">Deen Zone Academy Player v1.0 • Knowledge is Light</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
