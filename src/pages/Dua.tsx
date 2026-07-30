import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bookmark, BookmarkCheck, Copy, Share2, ArrowLeft, MessageCircle, BookOpen, Heart, Trash2, Plus, X } from 'lucide-react';
import { duas as staticDuas, duaCategories, Dua as DuaType } from '../data/duas';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLanguage } from '../contexts/LanguageContext';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { DeleteConfirmModal, UndoToast } from '../components/common/DeleteConfirmModal';

export default function Dua() {
  const { t, language } = useLanguage();
  const { deleteDialog, undoToast, requestDelete, closeDialog, closeToast } = useDeleteWithUndo();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDua, setSelectedDua] = useState<DuaType | null>(null);
  const [bookmarks, setBookmarks] = useLocalStorage<number[]>('dua_bookmarks', []);
  const [deletedDuaIds, setDeletedDuaIds] = useLocalStorage<number[]>('deleted_dua_ids', []);
  const [userDuas, setUserDuas] = useLocalStorage<DuaType[]>('user_duas', []);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newDua, setNewDua] = useState({
    title_bn: '',
    arabic: '',
    text_bn: '',
    pronunciation_bn: '',
    reference_bn: '',
    category: 'দৈনন্দিন'
  });

  const allDuas = useMemo(() => {
    return [...userDuas, ...staticDuas].filter(d => !deletedDuaIds.some(dId => String(dId) === String(d.id)));
  }, [userDuas, deletedDuaIds]);

  const filteredDuas = useMemo(() => {
    return allDuas.filter(d => {
      const matchesSearch = d.text_bn.includes(searchTerm) || 
                          d.title_bn.includes(searchTerm) || 
                          d.reference_bn.includes(searchTerm) ||
                          d.category.includes(searchTerm);
      const matchesCategory = !selectedCategory || d.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, allDuas]);

  const handleDeleteDua = (e: React.MouseEvent, duaItem: DuaType) => {
    e.stopPropagation();
    requestDelete(
      duaItem.title_bn,
      () => {
        setUserDuas(prev => prev.filter(d => d.id !== duaItem.id));
        setDeletedDuaIds(prev => prev.includes(duaItem.id) ? prev : [...prev, duaItem.id]);
        if (selectedDua?.id === duaItem.id) setSelectedDua(null);
      },
      () => {
        setDeletedDuaIds(prev => prev.filter(dId => String(dId) !== String(duaItem.id)));
      }
    );
  };

  const handleAddDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDua.title_bn || !newDua.text_bn) return;

    const item: DuaType = {
      id: Date.now(),
      title_bn: newDua.title_bn,
      arabic: newDua.arabic || newDua.title_bn,
      text_bn: newDua.text_bn,
      pronunciation_bn: newDua.pronunciation_bn || '',
      reference_bn: newDua.reference_bn || 'ব্যক্তিগত সংগ্রহ',
      category: newDua.category
    };

    setUserDuas(prev => [item, ...prev]);
    setIsAddModalOpen(false);
    setNewDua({
      title_bn: '',
      arabic: '',
      text_bn: '',
      pronunciation_bn: '',
      reference_bn: '',
      category: 'দৈনন্দিন'
    });
  };

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleCopy = (e: React.MouseEvent, dua: DuaType) => {
    e.stopPropagation();
    const text = `${dua.title_bn}\n\n${dua.arabic}\n\n${dua.text_bn}\n\n— (${dua.reference_bn})`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (e: React.MouseEvent, dua: DuaType) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: 'একটি দোয়া শেয়ার করুন',
        text: `${dua.title_bn}\n\n${dua.text_bn}\n\n— (${dua.reference_bn})`,
        url: window.location.href,
      }).catch((err) => {
        if (err && err.name !== 'AbortError') {
          console.log('Share error:', err);
        }
      });
    } else {
      handleCopy(e, dua);
    }
  };

  if (selectedDua) {
    return (
      <div className="space-y-6 pb-24">
        <div className="bg-emerald-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <button 
            onClick={() => setSelectedDua(null)}
            className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors z-20"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="text-center pt-8 relative z-10">
            <span className="bg-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 inline-block backdrop-blur-sm">
              {selectedDua.category}
            </span>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart size={24} className="text-emerald-400 opacity-50" />
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{selectedDua.title_bn}</h1>
              <Heart size={24} className="text-emerald-400 opacity-50" />
            </div>
            <p className="text-emerald-200 font-bold opacity-80">রেফারেন্স: {selectedDua.reference_bn}</p>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} 
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none"
          >
             <BookOpen size={240} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-10"
        >
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
               <span className="w-8 h-px bg-emerald-200" />
               আরবি দোয়া
             </div>
             <p className="arabic-text text-3xl md:text-5xl text-right leading-[1.8] text-slate-800 font-medium">
               {selectedDua.arabic}
             </p>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
               <span className="w-8 h-px bg-emerald-200" />
               বাংলা অর্থ
             </div>
             <p className="text-lg md:text-2xl font-bold text-slate-700 leading-relaxed italic border-l-4 border-emerald-100 pl-6 py-2">
               "{selectedDua.text_bn}"
             </p>
          </div>

          {selectedDua.significance_bn && (
            <div className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-100 relative">
              <div className="absolute top-6 right-8 text-emerald-200/50 pointer-events-none">
                <MessageCircle size={48} />
              </div>
              <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-4">দোয়ার গুরুত্ব ও ফজিলত</h4>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed italic font-medium">
                {selectedDua.significance_bn}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-4">
            <button 
              onClick={(e) => handleCopy(e, selectedDua)}
              className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all active:scale-95"
            >
              <Copy size={18} />
              <span className="text-xs uppercase tracking-widest font-black">{copiedId === selectedDua.id ? 'কপি হয়েছে' : 'কপি করুন'}</span>
            </button>
            <button 
              onClick={(e) => handleShare(e, selectedDua)}
              className="flex items-center gap-2 bg-emerald-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg active:scale-95"
            >
              <Share2 size={18} />
              <span className="text-xs uppercase tracking-widest font-black">শেয়ার করুন</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-emerald-800 rounded-[2.5rem] p-8 text-white flex items-center justify-between relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">{t.dua.title}</h1>
            <p className="text-emerald-100 italic opacity-80">{t.dua.subtitle}</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg"
          >
            <Plus size={18} />
            নতুন দোয়া
          </button>
        </div>
        <Heart size={120} className="absolute -right-8 -top-8 opacity-10 rotate-12 pointer-events-none" />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="দোয়া খুঁজুন (বিষয় বা শিরোনাম)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${!selectedCategory ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'}`}
        >
          সব দোয়া
        </button>
        {duaCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredDuas.map((dua, i) => {
            const isBookmarked = bookmarks.includes(dua.id);
            return (
              <motion.div 
                key={dua.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelectedDua(dua)}
                className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-emerald-200 cursor-pointer transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-sm">
                      {dua.id}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {dua.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleCopy(e, dua)}
                      className={`p-2.5 rounded-xl transition-all ${copiedId === dua.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-300 hover:bg-slate-50 hover:text-slate-600'}`}
                      title="কপি করুন"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={(e) => toggleBookmark(e, dua.id)}
                      className={`p-2.5 rounded-xl transition-all ${isBookmarked ? 'bg-amber-50 text-amber-500' : 'text-slate-300 hover:bg-slate-50 hover:text-amber-500'}`}
                      title="বুকমার্ক করুন"
                    >
                      {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                    <button
                      onClick={(e) => {
                        handleDeleteDua(e, dua);
                      }}
                      className="p-2.5 rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-all"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight group-hover:text-emerald-700 transition-colors">
                  {dua.title_bn}
                </h3>
                <p className="text-slate-600 font-bold text-base mb-4 line-clamp-2 italic opacity-80">
                  "{dua.text_bn}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-80">রেফারেন্স</span>
                    <span className="text-xs text-emerald-800/60 font-black uppercase tracking-tight">{dua.reference_bn}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl opacity-60 group-hover:opacity-100 transition-all border border-transparent group-hover:border-emerald-200">
                    <span className="text-[10px] font-black uppercase tracking-widest">বিস্তারিত পড়ুন</span>
                    <ArrowLeft className="rotate-180" size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {filteredDuas.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 font-bold italic">দুঃখিত, এই বিষয়ে কোনো দোয়া পাওয়া যায়নি।</p>
        </div>
      )}

      {/* Add Dua Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-slate-800 mb-6">
                নতুন দোয়া যোগ করুন
              </h2>

              <form onSubmit={handleAddDua} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    দোয়ার নাম / বিষয়
                  </label>
                  <input
                    type="text"
                    required
                    value={newDua.title_bn}
                    onChange={(e) => setNewDua({ ...newDua, title_bn: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    আরবি টেক্সট (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    value={newDua.arabic}
                    onChange={(e) => setNewDua({ ...newDua, arabic: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500 font-arabic text-right text-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    বাংলা অর্থ / উচ্চারণ
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newDua.text_bn}
                    onChange={(e) => setNewDua({ ...newDua, text_bn: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                      রেফারেন্স
                    </label>
                    <input
                      type="text"
                      value={newDua.reference_bn}
                      onChange={(e) => setNewDua({ ...newDua, reference_bn: e.target.value })}
                      placeholder="যেমন: বুখারী"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                      ক্যাটাগরি
                    </label>
                    <select
                      value={newDua.category}
                      onChange={(e) => setNewDua({ ...newDua, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      {duaCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all mt-4"
                >
                  দোয়া সংরক্ষণ করুন
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
