import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, Calendar, ChevronRight, ArrowLeft, Share2, Copy, BookOpen, Quote, Plus, X, Image as ImageIcon, Trash2, Edit } from 'lucide-react';
import { historyEvents, HistoryEvent } from '../data/history';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function History() {
  const { t, language } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localHistory, setLocalHistory] = useLocalStorage<HistoryEvent[]>('local_history', []);

  // New/Edit History form state
  const [newEvent, setNewEvent] = useState({
    title_bn: '',
    title: '',
    type: 'Event' as HistoryEvent['type'],
    type_bn: 'ঐতিহাসিক ঘটনা',
    summary_bn: '',
    summary: '',
    content_bn: '',
    content: '',
    period_bn: '',
    period: '',
    image: ''
  });

  const allHistory = useMemo(() => {
    const staticItems = historyEvents.map(h => ({ ...h, isLocal: false }));
    const dynamicItems = localHistory.map(h => ({ ...h, isLocal: true }));
    return [...dynamicItems, ...staticItems];
  }, [localHistory]);

  const handleShare = (event: HistoryEvent) => {
    const title = language === 'bn' ? event.title_bn : event.title;
    const summary = language === 'bn' ? event.summary_bn : event.summary;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: summary,
        url: window.location.href,
      });
    }
  };

  const handleCopy = (event: HistoryEvent) => {
    const title = language === 'bn' ? event.title_bn : event.title;
    const content = language === 'bn' ? event.content_bn : event.content;
    const text = `${title}\n\n${content}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewEvent({
      title_bn: '',
      title: '',
      type: 'Event',
      type_bn: 'ঐতিহাসিক ঘটনা',
      summary_bn: '',
      summary: '',
      content_bn: '',
      content: '',
      period_bn: '',
      period: '',
      image: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, event: HistoryEvent) => {
    e.stopPropagation();
    setEditingId(event.id);
    setNewEvent({
      title_bn: event.title_bn,
      title: event.title,
      type: event.type,
      type_bn: event.type_bn,
      summary_bn: event.summary_bn,
      summary: event.summary,
      content_bn: event.content_bn,
      content: event.content,
      period_bn: event.period_bn,
      period: event.period,
      image: event.image
    });
    setShowAddModal(true);
  };

  const handleDeleteHistory = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    // Simplified delete logic to ensure it works
    const idToMatch = Number(id);
    setLocalHistory(prev => prev.filter(h => Number(h.id) !== idToMatch));
    
    if (selectedEvent && Number(selectedEvent.id) === idToMatch) {
      setSelectedEvent(null);
    }
  };

  const handleSaveHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setLocalHistory(prev => prev.map(h => 
        h.id === editingId ? { ...h, ...newEvent } : h
      ));
    } else {
      const newItem: HistoryEvent = {
        id: Date.now(),
        ...newEvent
      };
      setLocalHistory(prev => [newItem, ...prev]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-20 relative min-h-[60vh]">
      <AnimatePresence mode="wait">
        {!selectedEvent ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <section className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-black uppercase tracking-tighter">{t.history.title}</h1>
                  <button 
                    onClick={handleOpenAddModal}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                    title="নতুন ইতিহাস যোগ করুন"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <p className="text-emerald-100 italic opacity-80">{t.history.subtitle}</p>
              </div>
              <Landmark size={120} className="absolute -right-8 -top-8 opacity-10 rotate-12" />
            </section>

            <div className="grid gap-6">
              {allHistory.map((event, i) => {
                const title = language === 'bn' ? event.title_bn : event.title;
                const summary = language === 'bn' ? event.summary_bn : event.summary;
                const type = language === 'bn' ? event.type_bn : event.type;
                const period = language === 'bn' ? event.period_bn : event.period;
                const isLocal = (event as any).isLocal;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedEvent(event)}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col md:flex-row cursor-pointer transition-all hover:shadow-xl hover:border-emerald-200"
                  >
                    <div className="h-56 md:h-auto md:w-72 flex-shrink-0 relative overflow-hidden">
                      <img 
                        src={event.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80'} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute top-6 left-6 flex flex-col gap-2 scale-90 origin-top-left">
                        <div className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/30">
                          {type}
                        </div>
                        {isLocal && (
                          <div className="bg-amber-500/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-amber-400/50">
                            যোগ করা
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                          <Calendar size={14} />
                          <span>{period}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 leading-tight mb-3 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{title}</h3>
                        <p className="text-slate-500 font-bold line-clamp-2 italic leading-relaxed">{summary}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl opacity-60 group-hover:opacity-100 transition-all border border-transparent group-hover:border-emerald-200">
                          <span className="text-[10px] font-black uppercase tracking-widest">{t.history.readFullStory}</span>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        {isLocal && (
                          <div className="flex gap-2">
                             <button 
                               onClick={(e) => handleOpenEditModal(e, event)}
                               className="p-2 bg-white text-emerald-600 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                             >
                               <Edit size={14} />
                             </button>
                             <button 
                               onClick={(e) => handleDeleteHistory(e, event.id)}
                               className="p-2 bg-white text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-50 transition-colors"
                             >
                               <Trash2 size={14} />
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="flex items-center gap-3 bg-white border border-slate-100 text-slate-600 px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm active:scale-95"
              >
                <ArrowLeft size={18} />
                ফিরে যান
              </button>
              <div className="flex items-center gap-3">
                {(selectedEvent as any).isLocal && (
                  <>
                    <button 
                      onClick={(e) => handleOpenEditModal(e, selectedEvent)}
                      className="p-3 bg-white border border-slate-100 text-emerald-600 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteHistory(e, selectedEvent.id)}
                      className="p-3 bg-white border border-slate-100 text-rose-600 rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleCopy(selectedEvent)}
                  className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                >
                  {copied ? <div className="text-[10px] font-black text-emerald-600">কপি হয়েছে</div> : <Copy size={20} />}
                </button>
                <button 
                  onClick={() => handleShare(selectedEvent)}
                  className="p-3 bg-emerald-900 text-white rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="h-64 md:h-[450px] w-full overflow-hidden relative">
                <img 
                  src={selectedEvent.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80'} 
                  alt={language === 'bn' ? selectedEvent.title_bn : selectedEvent.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest inline-block shadow-xl">
                      {language === 'bn' ? selectedEvent.type_bn : selectedEvent.type}
                    </span>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest inline-block shadow-xl">
                      {language === 'bn' ? selectedEvent.period_bn : selectedEvent.period}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                    {language === 'bn' ? selectedEvent.title_bn : selectedEvent.title}
                  </h2>
                </div>
              </div>

              <div className="p-8 md:p-16 space-y-12">
                <div className="relative">
                  <div className="absolute -left-8 md:-left-12 top-0 bottom-0 w-2 bg-emerald-500 rounded-full opacity-20" />
                  <p className="text-2xl md:text-3xl text-slate-800 leading-relaxed font-black italic pl-6 md:pl-10">
                    "{language === 'bn' ? selectedEvent.content_bn : selectedEvent.content}"
                  </p>
                </div>

                <div className="space-y-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-widest">ঐতিহাসিক পর্যালোচনা</h4>
                  </div>
                  <p className="text-slate-600 leading-loose text-xl font-medium first-letter:text-5xl first-letter:font-black first-letter:text-emerald-600 first-letter:mr-3 first-letter:float-left">
                    ইসলামী ইতিহাস কেবল অতীতের কাহিনী নয়, বরং এটি আমাদের আদর্শ ও প্রেরণার উৎস। প্রতিটি ঘটনা আমাদের শিখিয়ে দেয় কীভাবে ন্যায়ের পথে অবিচল থাকতে হয় এবং মহান আল্লাহর ওপর ভরসা করতে হয়।
                  </p>
                  
                  <div className="bg-emerald-50 rounded-[2rem] p-10 relative overflow-hidden">
                    <Quote className="absolute -right-6 -top-6 opacity-5 text-emerald-900 rotate-12" size={120} />
                    <p className="text-emerald-900 font-bold text-xl italic relative z-10 leading-relaxed">
                      ইতিহাস থেকে শিক্ষা গ্রহণ করা মুমিনের অন্যতম বৈশিষ্ট্য। আমরা যেন আমাদের পূর্বসূরীদের আদর্শ নিজেদের জীবনে বাস্তবায়ন করতে পারি।
                    </p>
                  </div>
                </div>

                <div className="pt-10 flex justify-center">
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-emerald-800 transition-all shadow-2xl active:scale-95"
                  >
                    সব ইতিহাস দেখুন
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit History Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                  {editingId ? 'ইতিহাস এডিট করুন' : 'নতুন ইতিহাস যোগ করুন'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveHistory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">টাইপ (বাংলা)</label>
                    <select 
                      value={newEvent.type_bn}
                      onChange={(e) => setNewEvent({...newEvent, type_bn: e.target.value, type: e.target.value === 'নবী-রাসূল' ? 'Prophet' : 'Event'})}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      <option value="ঐতিহাসিক ঘটনা">ঐতিহাসিক ঘটনা</option>
                      <option value="নবী-রাসূল">নবী-রাসূল</option>
                      <option value="যুগ">যুগ</option>
                      <option value="খিলাফত">খিলাফত</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">সময়কাল/পিরিয়ড (বাংলা)</label>
                    <input 
                      required
                      value={newEvent.period_bn}
                      onChange={(e) => setNewEvent({...newEvent, period_bn: e.target.value, period: e.target.value})}
                      placeholder="যেমন: ২ হিজরী"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">শিরোনাম (বাংলা)</label>
                  <input 
                    required
                    value={newEvent.title_bn}
                    onChange={(e) => setNewEvent({...newEvent, title_bn: e.target.value, title: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">সংক্ষিপ্ত সারমর্ম (বাংলা)</label>
                  <textarea 
                    required
                    value={newEvent.summary_bn}
                    onChange={(e) => setNewEvent({...newEvent, summary_bn: e.target.value, summary: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">বিস্তারিত আলোচনা (বাংলা)</label>
                  <textarea 
                    required
                    value={newEvent.content_bn}
                    onChange={(e) => setNewEvent({...newEvent, content_bn: e.target.value, content: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">ছবির ইউআরএল (Image URL)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      value={newEvent.image}
                      onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95"
                >
                  {editingId ? 'আপডেট করুন' : 'সেভ করুন'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

