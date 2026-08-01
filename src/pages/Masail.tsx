import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ChevronDown, Filter, HelpCircle, Search, BookOpen, MessageCircle, Share2, Copy, Plus, X, Send } from 'lucide-react';
import { masailItems, masailCategories, Masail as MasailType } from '../data/qa';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { DeleteConfirmModal, UndoToast } from '../components/common/DeleteConfirmModal';

const MasailCard: React.FC<{ 
  item: MasailType; 
  isLocal?: boolean;
  onEdit?: (item: MasailType) => void;
  onDelete?: (item: MasailType) => void;
}> = ({ item, isLocal, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `প্রশ্ন: ${item.question_bn}\n\nউত্তর: ${item.answer_bn}\n\nসূত্র: ${item.reference_bn}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.question_bn,
        text: `প্রশ্ন: ${item.question_bn}\n\nউত্তর: ${item.answer_bn}\n\nসূত্র: ${item.reference_bn}`,
        url: window.location.href,
      }).catch((err) => {
        if (err && err.name !== 'AbortError') {
          console.log('Share error:', err);
        }
      });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div 
      layout
      className="group bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mb-4 hover:shadow-xl hover:border-emerald-200 transition-all"
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 md:p-8 cursor-pointer flex items-center justify-between gap-6 select-none"
      >
        <div className="flex items-center gap-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-emerald-50 text-emerald-600'}`}>
             <HelpCircle size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg">
                {item.category_bn}
              </span>
              {isLocal && (
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                  আপনার যোগ করা
                </span>
              )}
            </div>
            <h3 className="font-black text-lg md:text-xl text-slate-800 leading-tight group-hover:text-emerald-700">{item.question_bn}</h3>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
          <ChevronDown size={20} />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-50"
          >
            <div className="p-8 md:p-10 space-y-6 bg-slate-50/30">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                   <MessageCircle size={14} />
                   শরীয়তের সমাধান
                 </div>
                 <p className="text-lg md:text-xl font-bold text-slate-700 leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2">
                   "{item.answer_bn}"
                 </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-80">দলিল ও নির্ভরযোগ্য সূত্র</span>
                  <div className="flex items-center gap-2 text-emerald-800/60 font-black text-xs uppercase tracking-tight">
                    <BookOpen size={14} />
                    {item.reference_bn}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isLocal && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
                      className="flex items-center gap-2 bg-white text-emerald-600 px-5 py-3 rounded-xl font-bold border border-emerald-100 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
                    >
                      <span className="text-[10px] uppercase tracking-widest font-black">এডিট</span>
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(item);
                    }}
                    className="flex items-center gap-2 bg-white text-rose-600 px-5 py-3 rounded-xl font-bold border border-rose-100 hover:bg-rose-50 transition-all active:scale-95 shadow-sm"
                    title="ডিলিট"
                  >
                    <span className="text-[10px] uppercase tracking-widest font-black">ডিলিট</span>
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-white text-slate-600 px-5 py-3 rounded-xl font-bold border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all active:scale-95 shadow-sm"
                  >
                    <Copy size={16} />
                    <span className="text-[10px] uppercase tracking-widest font-black">{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-emerald-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg active:scale-95"
                  >
                    <Share2 size={16} />
                    <span className="text-[10px] uppercase tracking-widest font-black">শেয়ার</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Masail() {
  const { t, language } = useLanguage();
  const { deleteDialog, undoToast, requestDelete, closeDialog, closeToast } = useDeleteWithUndo();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localMasails, setLocalMasails] = useLocalStorage<MasailType[]>('local_masails', []);
  const [deletedMasailIds, setDeletedMasailIds] = useLocalStorage<number[]>('deleted_masail_ids', []);
  
  // Submit state for user question
  const [userQuestion, setUserQuestion] = useState('');
  
  // New/Edit Masail form state
  const [newMasail, setNewMasail] = useState({
    question_bn: '',
    answer_bn: '',
    category_bn: masailCategories[0],
    reference_bn: ''
  });

  const allMasails = useMemo(() => {
    const staticItems = masailItems.map(m => ({ ...m, isLocal: false }));
    const dynamicItems = localMasails.map(m => ({ ...m, isLocal: true }));
    return [...dynamicItems, ...staticItems].filter(m => !deletedMasailIds.some(dId => String(dId) === String(m.id)));
  }, [localMasails, deletedMasailIds]);

  const filteredMasail = useMemo(() => {
    return allMasails.filter(m => {
      const matchesSearch = m.question_bn.includes(searchTerm) || m.answer_bn.includes(searchTerm);
      const matchesCategory = !activeCategory || m.category_bn === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, allMasails]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('নতুন মাসআলা প্রশ্ন');
    const body = encodeURIComponent(`আমার প্রশ্ন: ${userQuestion}`);
    window.location.href = `mailto:shamimahmadahnaf@gmail.com?subject=${subject}&body=${body}`;
    setShowAskModal(false);
    setUserQuestion('');
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewMasail({
      question_bn: '',
      answer_bn: '',
      category_bn: masailCategories[0],
      reference_bn: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item: MasailType) => {
    setEditingId(item.id);
    setNewMasail({
      question_bn: item.question_bn,
      answer_bn: item.answer_bn,
      category_bn: item.category_bn,
      reference_bn: item.reference_bn
    });
    setShowAddModal(true);
  };

  const handleDeleteMasail = (item: MasailType) => {
    const idToMatch = Number(item.id);
    const isLocal = localMasails.some(m => Number(m.id) === idToMatch);
    requestDelete(
      item.question_bn,
      () => {
        setDeletedMasailIds(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
      },
      () => {
        setDeletedMasailIds(prev => prev.filter(dId => Number(dId) !== idToMatch));
        if (isLocal) {
          setLocalMasails(prev => prev.some(m => Number(m.id) === idToMatch) ? prev : [...prev, item]);
        }
      }
    );
  };

  const handleSaveMasail = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setLocalMasails(prev => prev.map(m => 
        m.id === editingId ? { ...m, ...newMasail } : m
      ));
    } else {
      const newItem: MasailType = {
        id: Date.now(),
        ...newMasail
      };
      setLocalMasails(prev => [newItem, ...prev]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <section className="bg-emerald-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{t.nav.masail}</h1>
            <button 
              onClick={handleOpenAddModal}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
              title="নতুন মাসায়েল যোগ করুন"
            >
              <Plus size={20} />
            </button>
          </div>
          <p className="text-emerald-100 opacity-80 italic">যাপিত জীবনের সমস্যাবলীর শরয়ী সমাধান ও নির্ভরযোগ্য ফতোয়া</p>
        </div>
        <MessageSquare size={120} className="absolute -right-8 -top-8 opacity-10 rotate-12" />
      </section>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="আপনার মাসআলা বা প্রশ্ন খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${!activeCategory ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'}`}
        >
          সব মাসায়েল
        </button>
        {masailCategories.map((f) => (
          <button
            key={f}
            onClick={() => setActiveCategory(f)}
            className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeCategory === f 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' 
              : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        <AnimatePresence mode="popLayout">
          {filteredMasail.map((item) => (
            <MasailCard 
              key={item.id} 
              item={item} 
              isLocal={(item as any).isLocal} 
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteMasail}
            />
          ))}
        </AnimatePresence>
        
        {filteredMasail.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400 font-bold italic">
            দুঃখিত, এই বিষয়ে কোনো নির্ভরযোগ্য মাসআলা পাওয়া যায়নি।
          </div>
        )}
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-lg">
            <HelpCircle size={40} />
         </div>
         <div className="flex-1 text-center md:text-left">
           <h3 className="text-xl font-black text-emerald-950 mb-2">আপনার কি কোনো প্রশ্ন আছে?</h3>
           <p className="text-slate-600 font-bold leading-relaxed opacity-80">
             আপনার জীবনের কোনো নির্দিষ্ট সমস্যার শরয়ী সমাধান জানতে আমাদের বিজ্ঞ মুফতিগণের প্যানেলে প্রশ্ন পাঠাতে পারেন।
           </p>
         </div>
         <button 
           onClick={() => setShowAskModal(true)}
           className="whitespace-nowrap bg-emerald-950 text-white font-black px-10 py-5 rounded-2xl hover:bg-emerald-800 transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-widest"
         >
           প্রশ্ন করুন
         </button>
      </div>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {showAskModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAskModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">প্রশ্ন করুন</h3>
                <button onClick={() => setShowAskModal(false)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAskQuestion} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">আপনার প্রশ্ন লিখুন</label>
                  <textarea 
                    required
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="এখানে আপনার প্রশ্নটি বিস্তারিত লিখুন..."
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 min-h-[150px]"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-emerald-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-emerald-800 transition-all active:scale-95"
                >
                  <Send size={18} />
                  প্রশ্ন পাঠান
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Masail Modal */}
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
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                  {editingId ? 'মাসআলা এডিট করুন' : 'নতুন মাসআলা যোগ করুন'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveMasail} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">ক্যাটাগরি</label>
                  <select 
                    value={newMasail.category_bn}
                    onChange={(e) => setNewMasail({...newMasail, category_bn: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    {masailCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">প্রশ্ন (বাংলা)</label>
                  <input 
                    required
                    value={newMasail.question_bn}
                    onChange={(e) => setNewMasail({...newMasail, question_bn: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">উত্তর (বাংলা)</label>
                  <textarea 
                    required
                    value={newMasail.answer_bn}
                    onChange={(e) => setNewMasail({...newMasail, answer_bn: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">রেফারেন্স বা দলিল</label>
                  <input 
                    required
                    value={newMasail.reference_bn}
                    onChange={(e) => setNewMasail({...newMasail, reference_bn: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
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
