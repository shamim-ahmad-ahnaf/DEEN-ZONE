import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, BookOpen, ChevronRight, ArrowLeft, Share2, Copy, Plus, X, Image as ImageIcon, Trash2, Edit, GraduationCap, Quote, Landmark } from 'lucide-react';
import { scholars as staticScholars, Scholar } from '../data/scholars';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { DeleteConfirmModal, UndoToast } from '../components/common/DeleteConfirmModal';

export default function Scholars() {
  const { t, language } = useLanguage();
  const { deleteDialog, undoToast, requestDelete, closeDialog, closeToast } = useDeleteWithUndo();
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localScholars, setLocalScholars] = useLocalStorage<Scholar[]>('local_scholars', []);
  const [deletedScholarIds, setDeletedScholarIds] = useLocalStorage<number[]>('deleted_scholar_ids', []);

  // New/Edit Scholar form state
  const [newScholar, setNewScholar] = useState({
    name_bn: '',
    name: '',
    title_bn: '',
    title: '',
    era_bn: '',
    era: '',
    bio_bn: '',
    bio: '',
    contribution_bn: '',
    contribution: '',
    image: ''
  });

  const allScholars = useMemo(() => {
    const staticItems = staticScholars.map(s => ({ ...s, isLocal: false }));
    const dynamicItems = localScholars.map(s => ({ ...s, isLocal: true }));
    return [...dynamicItems, ...staticItems].filter(s => !deletedScholarIds.some(dId => String(dId) === String(s.id)));
  }, [localScholars, deletedScholarIds]);

  const handleShare = (scholar: Scholar) => {
    const name = language === 'bn' ? scholar.name_bn : scholar.name;
    const bio = language === 'bn' ? scholar.bio_bn : scholar.bio;
    if (navigator.share) {
      navigator.share({
        title: name,
        text: bio,
        url: window.location.href,
      }).catch((err) => {
        if (err && err.name !== 'AbortError') {
          console.log('Share error:', err);
        }
      });
    } else {
      handleCopy(scholar);
    }
  };

  const handleCopy = (scholar: Scholar) => {
    const name = language === 'bn' ? scholar.name_bn : scholar.name;
    const content = language === 'bn' ? scholar.bio_bn : scholar.bio;
    const contribution = language === 'bn' ? scholar.contribution_bn : scholar.contribution;
    const text = `${name}\n\n${content}\n\nঅবদান: ${contribution}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewScholar({
      name_bn: '',
      name: '',
      title_bn: '',
      title: '',
      era_bn: '',
      era: '',
      bio_bn: '',
      bio: '',
      contribution_bn: '',
      contribution: '',
      image: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, scholar: Scholar) => {
    e.stopPropagation();
    setEditingId(scholar.id);
    setNewScholar({
      name_bn: scholar.name_bn,
      name: scholar.name,
      title_bn: scholar.title_bn,
      title: scholar.title,
      era_bn: scholar.era_bn,
      era: scholar.era,
      bio_bn: scholar.bio_bn,
      bio: scholar.bio,
      contribution_bn: scholar.contribution_bn,
      contribution: scholar.contribution,
      image: scholar.image
    });
    setShowAddModal(true);
  };

  const handleDeleteScholar = (e: React.MouseEvent, scholarItem: Scholar) => {
    e.stopPropagation();
    const titleText = language === 'bn' ? scholarItem.name_bn : scholarItem.name;
    requestDelete(
      titleText,
      () => {
        setLocalScholars(prev => {
          if (!Array.isArray(prev)) return [];
          const idStr = String(scholarItem.id);
          return prev.filter(s => String(s.id) !== idStr);
        });
        setDeletedScholarIds(prev => prev.includes(scholarItem.id) ? prev : [...prev, scholarItem.id]);
        if (selectedScholar && String(selectedScholar.id) === String(scholarItem.id)) {
          setSelectedScholar(null);
        }
      },
      () => {
        setDeletedScholarIds(prev => prev.filter(dId => String(dId) !== String(scholarItem.id)));
      }
    );
  };

  const handleSaveScholar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const editIdStr = String(editingId);
      setLocalScholars(prev => prev.map(s => 
        String(s.id) === editIdStr ? { ...s, ...newScholar } : s
      ));
    } else {
      const newItem: Scholar = {
        id: Date.now(),
        ...newScholar
      };
      setLocalScholars(prev => [newItem, ...prev]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-20 relative min-h-[60vh]">
      <AnimatePresence mode="wait">
        {!selectedScholar ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <section className="bg-gold-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-black uppercase tracking-tighter">{t.scholars.title}</h1>
                  <button 
                    onClick={handleOpenAddModal}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                    title="নতুন পণ্ডিত যোগ করুন"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <p className="text-gold-100 italic opacity-80">{t.scholars.subtitle}</p>
              </div>
              <Users size={120} className="absolute -right-8 -top-8 opacity-10 rotate-12" />
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              {allScholars.map((scholar, i) => {
                const name = language === 'bn' ? scholar.name_bn : scholar.name;
                const title = language === 'bn' ? scholar.title_bn : scholar.title;
                const era = language === 'bn' ? scholar.era_bn : scholar.era;
                const bio = language === 'bn' ? scholar.bio_bn : scholar.bio;
                const isLocal = (scholar as any).isLocal;

                return (
                  <motion.div
                    key={scholar.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedScholar(scholar)}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-xl hover:border-gold-200 p-8"
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner bg-slate-50 relative">
                        <img 
                          src={scholar.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80'} 
                          alt={name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        {isLocal && (
                          <div className="absolute top-0 left-0 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-br-lg uppercase tracking-widest shadow-sm">
                            যোগ করা
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] block mb-1">
                          {title}
                        </span>
                        <h3 className="text-2xl font-black text-slate-800 truncate uppercase tracking-tight group-hover:text-gold-700 transition-colors">{name}</h3>
                        <p className="text-emerald-700 font-bold text-sm">{era}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <p className="text-slate-500 font-bold text-sm leading-relaxed italic line-clamp-2">
                        {bio}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-700 rounded-xl opacity-60 group-hover:opacity-100 transition-all border border-transparent group-hover:border-gold-200">
                        <span className="text-[10px] font-black uppercase tracking-widest">{t.scholars.fullProfile}</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex gap-2">
                         {isLocal && (
                           <button 
                             onClick={(e) => handleOpenEditModal(e, scholar)}
                             className="p-2 bg-white text-emerald-600 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                             title="এডিট"
                           >
                             <Edit size={14} />
                           </button>
                         )}
                         <button 
                           onClick={(e) => {
                             handleDeleteScholar(e, scholar);
                           }}
                           className="p-2 bg-white text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-50 transition-colors"
                           title="ডিলিট"
                         >
                           <Trash2 size={14} />
                         </button>
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
                onClick={() => setSelectedScholar(null)}
                className="flex items-center gap-3 bg-white border border-slate-100 text-slate-600 px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gold-50 hover:text-gold-700 hover:border-gold-200 transition-all shadow-sm active:scale-95"
              >
                <ArrowLeft size={18} />
                ফিরে যান
              </button>
              <div className="flex items-center gap-3">
                {(selectedScholar as any).isLocal && (
                  <>
                    <button 
                      onClick={(e) => handleOpenEditModal(e, selectedScholar)}
                      className="p-3 bg-white border border-slate-100 text-emerald-600 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteScholar(e, selectedScholar)}
                      className="p-3 bg-white border border-slate-100 text-rose-600 rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleCopy(selectedScholar)}
                  className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-gold-600 hover:border-gold-200 transition-all shadow-sm"
                >
                  {copied ? <div className="text-[10px] font-black text-gold-600">কপি হয়েছে</div> : <Copy size={20} />}
                </button>
                <button 
                  onClick={() => handleShare(selectedScholar)}
                  className="p-3 bg-gold-600 text-white rounded-2xl hover:bg-gold-500 transition-all shadow-lg shadow-gold-600/20"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="h-80 md:h-auto md:w-[400px] flex-shrink-0 relative">
                  <img 
                    src={selectedScholar.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80'} 
                    alt={language === 'bn' ? selectedScholar.name_bn : selectedScholar.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 md:bg-gradient-to-r md:from-black/80 via-transparent to-transparent" />
                </div>
                <div className="p-10 md:p-16 flex-1 bg-slate-900 text-white flex flex-col justify-center">
                  <div className="flex gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-gold-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest inline-block shadow-xl">
                      {language === 'bn' ? selectedScholar.title_bn : selectedScholar.title}
                    </span>
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest inline-block shadow-xl border border-white/20">
                      {language === 'bn' ? selectedScholar.era_bn : selectedScholar.era}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter mb-4">
                    {language === 'bn' ? selectedScholar.name_bn : selectedScholar.name}
                  </h2>
                </div>
              </div>

              <div className="p-8 md:p-16 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-gold-600">
                    <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-widest">{t.scholars.biography}</h4>
                  </div>
                  <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-bold italic border-l-4 border-gold-500 pl-8">
                    {language === 'bn' ? selectedScholar.bio_bn : selectedScholar.bio}
                  </p>
                </div>

                <div className="space-y-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                      <GraduationCap size={24} />
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-widest">{t.scholars.majorContribution}</h4>
                  </div>
                  <div className="bg-emerald-50 rounded-[2rem] p-10 relative overflow-hidden">
                    <Quote className="absolute -right-6 -top-6 opacity-5 text-emerald-900 rotate-12" size={120} />
                    <p className="text-emerald-900 font-bold text-xl relative z-10 leading-relaxed">
                      {language === 'bn' ? selectedScholar.contribution_bn : selectedScholar.contribution}
                    </p>
                  </div>
                </div>

                <div className="pt-10 flex justify-center">
                  <button 
                    onClick={() => setSelectedScholar(null)}
                    className="flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-gold-600 transition-all shadow-2xl active:scale-95"
                  >
                    সব পণ্ডিতদের দেখুন
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Scholar Modal */}
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
                  {editingId ? 'পণ্ডিতের তথ্য এডিট করুন' : 'নতুন পণ্ডিত যোগ করুন'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveScholar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">উপাধি (বাংলা)</label>
                    <input 
                      required
                      value={newScholar.title_bn}
                      onChange={(e) => setNewScholar({...newScholar, title_bn: e.target.value, title: e.target.value})}
                      placeholder="যেমন: ইমাম"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold-500 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">জীবনকাল/যু্‌গ (বাংলা)</label>
                    <input 
                      required
                      value={newScholar.era_bn}
                      onChange={(e) => setNewScholar({...newScholar, era_bn: e.target.value, era: e.target.value})}
                      placeholder="যেমন: ৮১০ - ৮৭০ খ্রিষ্টাব্দ"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold-500 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">নাম (বাংলা)</label>
                  <input 
                    required
                    value={newScholar.name_bn}
                    onChange={(e) => setNewScholar({...newScholar, name_bn: e.target.value, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold-500 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">সংক্ষিপ্ত জীবনী (বাংলা)</label>
                  <textarea 
                    required
                    value={newScholar.bio_bn}
                    onChange={(e) => setNewScholar({...newScholar, bio_bn: e.target.value, bio: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold-500 font-bold min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">প্রধান অবদান (বাংলা)</label>
                  <textarea 
                    required
                    value={newScholar.contribution_bn}
                    onChange={(e) => setNewScholar({...newScholar, contribution_bn: e.target.value, contribution: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold-500 font-bold min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">ছবির ইউআরএল (Image URL)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      value={newScholar.image}
                      onChange={(e) => setNewScholar({...newScholar, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold-500 font-bold"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95"
                >
                  {editingId ? 'আপডেট করুন' : 'সেভ করুন'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900 text-slate-500 p-10 rounded-[3rem] text-center border border-slate-800 relative overflow-hidden group">
         <Landmark className="absolute -left-10 -bottom-10 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" size={150} />
         <p className="text-lg font-bold leading-relaxed max-w-md mx-auto italic relative z-10">
           "পণ্ডিতের কলমের কালি শহীদের রক্তের চেয়েও পবিত্র।"
           <span className="block mt-4 font-black text-gold-500 uppercase tracking-widest not-italic text-xs">— মহান মনীষীদের বাণী</span>
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
