import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, MessageCircle, Search, Plus, X, Edit, Trash2, Share2, Copy, Send, BookOpen } from 'lucide-react';
import { qaItems as staticQA, QAItem, qaCategoriesBn, qaCategories } from '../data/qa';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const QAAccordion: React.FC<{ 
  item: QAItem;
  isLocal?: boolean;
  onEdit?: (item: QAItem) => void;
  onDelete?: (id: number) => void;
}> = ({ item, isLocal, onEdit, onDelete }) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const question = language === 'bn' ? item.question_bn : item.question;
  const answer = language === 'bn' ? item.answer_bn : item.answer;
  const category = language === 'bn' ? item.category_bn : item.category;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `প্রশ্ন: ${question}\n\nউত্তর: ${answer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: question,
        text: `প্রশ্ন: ${question}\n\nউত্তর: ${answer}`,
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
      className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden mb-4 hover:shadow-xl hover:border-indigo-200 transition-all"
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 md:p-8 cursor-pointer flex items-center justify-between gap-6 select-none"
      >
        <div className="flex items-center gap-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-indigo-50 text-indigo-600'}`}>
             <HelpCircle size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg">
                {category}
              </span>
              {isLocal && (
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                  {language === 'bn' ? 'আপনার যোগ করা' : 'User Added'}
                </span>
              )}
            </div>
            <h3 className="font-black text-lg md:text-xl text-slate-800 leading-tight">{question}</h3>
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
                 <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                   <MessageCircle size={14} />
                   {t.qa.answerLabel}
                 </div>
                 <p className="text-lg md:text-xl font-bold text-slate-700 leading-relaxed italic border-l-4 border-indigo-500 pl-6 py-2">
                   "{answer}"
                 </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                {isLocal && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
                    className="p-3 bg-white text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    <Edit size={18} />
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(item.id);
                  }}
                  className="p-3 bg-white text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-50 transition-colors shadow-sm"
                  title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-white text-slate-600 px-5 py-3 rounded-xl font-bold border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all active:scale-95 shadow-sm"
                >
                  <Copy size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-black">{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি করুন' : 'Copy')}</span>
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-800 transition-all shadow-lg active:scale-95"
                >
                  <Share2 size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-black">{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function QA() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [localQA, setLocalQA] = useLocalStorage<QAItem[]>('local_qa', []);
  const [deletedQAIds, setDeletedQAIds] = useLocalStorage<number[]>('deleted_qa_ids', []);

  // Clear category filter on language change to avoid mismatch
  React.useEffect(() => {
    setActiveCategory(null);
  }, [language]);
  
  // Submit state for user question
  const [userQuestion, setUserQuestion] = useState('');
  
  // New/Edit QA form state
  const [newQA, setNewQA] = useState<Partial<QAItem>>({
    question_bn: '',
    question: '',
    answer_bn: '',
    answer: '',
    category_bn: qaCategoriesBn[0],
    category: ''
  });

  const allQA = useMemo(() => {
    const staticItems = staticQA.map(q => ({ ...q, isLocal: false }));
    const dynamicItems = localQA.map(q => ({ ...q, isLocal: true }));
    return [...dynamicItems, ...staticItems].filter(q => !deletedQAIds.some(dId => String(dId) === String(q.id)));
  }, [localQA, deletedQAIds]);

  const filteredQA = useMemo(() => {
    return allQA.filter(q => {
      const qText = language === 'bn' ? q.question_bn : q.question;
      const aText = language === 'bn' ? q.answer_bn : q.answer;
      const matchesSearch = qText.toLowerCase().includes(searchTerm.toLowerCase()) || aText.toLowerCase().includes(searchTerm.toLowerCase());
      const cat = language === 'bn' ? q.category_bn : q.category;
      const matchesCategory = !activeCategory || cat === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, allQA, language]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('নতুন দ্বীনি জিজ্ঞাসা');
    const body = encodeURIComponent(`আমার প্রশ্ন: ${userQuestion}`);
    window.location.href = `mailto:shamimahmadahnaf@gmail.com?subject=${subject}&body=${body}`;
    setShowAskModal(false);
    setUserQuestion('');
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setNewQA({
      question_bn: '',
      question: '',
      answer_bn: '',
      answer: '',
      category_bn: qaCategoriesBn[0],
      category: 'General'
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item: QAItem) => {
    setEditingId(item.id);
    setNewQA({
      question_bn: item.question_bn,
      question: item.question,
      answer_bn: item.answer_bn,
      answer: item.answer,
      category_bn: item.category_bn,
      category: item.category
    });
    setShowAddModal(true);
  };

  const handleDeleteQA = (id: number) => {
    const idStr = String(id);
    setLocalQA(prev => {
      if (!Array.isArray(prev)) return [];
      return prev.filter(q => String(q.id) !== idStr);
    });
    setDeletedQAIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleSaveQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const editIdStr = String(editingId);
      setLocalQA(prev => prev.map(q => 
        String(q.id) === editIdStr ? { ...q, ...newQA } as QAItem : q
      ));
    } else {
      const newItem: QAItem = {
        id: Date.now(),
        ...newQA
      } as QAItem;
      setLocalQA(prev => [newItem, ...prev]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <section className="bg-indigo-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{t.qa.title}</h1>
            <button 
              onClick={handleOpenAddModal}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
              title="নতুন প্রশ্ন-উত্তর যোগ করুন"
            >
              <Plus size={20} />
            </button>
          </div>
          <p className="text-indigo-100 opacity-80 italic">{t.qa.subtitle}</p>
        </div>
        <MessageCircle size={120} className="absolute -right-8 -top-8 opacity-10 rotate-12" />
      </section>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={language === 'bn' ? "আপনার প্রশ্ন খুঁজুন..." : "Search your question..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${!activeCategory ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'}`}
        >
          {language === 'bn' ? 'সব প্রশ্ন-উত্তর' : 'All Q&A'}
        </button>
        {(language === 'bn' ? qaCategoriesBn : qaCategories).map((f) => (
          <button
            key={f}
            onClick={() => setActiveCategory(f)}
            className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeCategory === f 
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
              : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        <AnimatePresence mode="popLayout">
          {filteredQA.map((item) => (
            <QAAccordion 
              key={item.id} 
              item={item} 
              isLocal={(item as any).isLocal} 
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteQA}
            />
          ))}
        </AnimatePresence>
        
        {filteredQA.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400 font-bold italic">
            {language === 'bn' ? 'দুঃখিত, কোনো ফলাফল পাওয়া যায়নি।' : 'Sorry, no results found.'}
          </div>
        )}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-lg">
            <HelpCircle size={40} />
         </div>
         <div className="flex-1 text-center md:text-left">
           <h3 className="text-xl font-black text-indigo-950 mb-2">{language === 'bn' ? 'আপনার কি কোনো জিজ্ঞাসা আছে?' : 'Do you have a question?'}</h3>
           <p className="text-slate-600 font-bold leading-relaxed opacity-80">
             {language === 'bn' ? 'আপনার মনের ইসলামের যেকোনো প্রশ্ন আমাদের পাঠাতে পারেন বিজ্ঞ আলেমদের উত্তরের জন্য।' : 'You can send us any Islamic questions and our scholars will answer them.'}
           </p>
         </div>
         <button 
           onClick={() => setShowAskModal(true)}
           className="whitespace-nowrap bg-indigo-950 text-white font-black px-10 py-5 rounded-2xl hover:bg-indigo-800 transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-widest"
         >
           {language === 'bn' ? 'প্রশ্ন করুন' : 'Ask Question'}
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
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{language === 'bn' ? 'জিজ্ঞাসা পাঠান' : 'Submit Question'}</h3>
                <button onClick={() => setShowAskModal(false)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAskQuestion} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">{language === 'bn' ? 'আপনার প্রশ্ন লিখুন' : 'Write your question'}</label>
                  <textarea 
                    required
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder={language === 'bn' ? "এখানে আপনার প্রশ্নটি বিস্তারিত লিখুন..." : "Describe your question here..."}
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 min-h-[150px]"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-indigo-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-indigo-800 transition-all active:scale-95"
                >
                  <Send size={18} />
                  {language === 'bn' ? 'প্রশ্ন পাঠান' : 'Send Question'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit QA Modal */}
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
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                  {editingId ? (language === 'bn' ? 'এডিট করুন' : 'Edit') : (language === 'bn' ? 'নতুন যোগ করুন' : 'Add New')}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveQA} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">ক্যাটাগরি (বাংলা)</label>
                    <select 
                      value={newQA.category_bn}
                      onChange={(e) => setNewQA({...newQA, category_bn: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold"
                    >
                      {qaCategoriesBn.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Category (English)</label>
                    <input 
                      required
                      value={newQA.category}
                      onChange={(e) => setNewQA({...newQA, category: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">প্রশ্ন (বাংলা)</label>
                  <input 
                    required
                    value={newQA.question_bn}
                    onChange={(e) => setNewQA({...newQA, question_bn: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Question (English)</label>
                  <input 
                    required
                    value={newQA.question}
                    onChange={(e) => setNewQA({...newQA, question: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">উত্তর (বাংলা)</label>
                  <textarea 
                    required
                    value={newQA.answer_bn}
                    onChange={(e) => setNewQA({...newQA, answer_bn: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Answer (English)</label>
                  <textarea 
                    required
                    value={newQA.answer}
                    onChange={(e) => setNewQA({...newQA, answer: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold min-h-[100px]"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95"
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
