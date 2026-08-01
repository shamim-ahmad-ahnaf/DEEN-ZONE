import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, X, Calendar, User, BookOpen, Share2, ArrowLeft, Bookmark, Plus, Trash2 } from 'lucide-react';
import { articles as initialArticles, Article } from '../data/educational';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { DeleteConfirmModal, UndoToast } from '../components/common/DeleteConfirmModal';

export default function Articles() {
  const { t, language } = useLanguage();
  const { deleteDialog, undoToast, requestDelete, closeDialog, closeToast } = useDeleteWithUndo();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<'All' | Article['category']>('All');
  const [userArticles, setUserArticles] = useLocalStorage<Article[]>('user_articles', []);
  const [deletedArticleIds, setDeletedArticleIds] = useLocalStorage<number[]>('deleted_article_ids', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newArticle, setNewArticle] = useState({
    title_bn: '',
    title: '',
    excerpt_bn: '',
    excerpt: '',
    content_bn: '',
    content: '',
    author_bn: '',
    author: '',
    category: 'Spiritual' as Article['category'],
    category_bn: 'আধ্যাত্মিকতা',
    image: ''
  });

  const allArticles = useMemo(() => {
    return [...userArticles, ...initialArticles].filter(a => !deletedArticleIds.some(dId => String(dId) === String(a.id)));
  }, [userArticles, deletedArticleIds]);

  const filteredArticles = allArticles.filter(article => 
    activeCategory === 'All' || article.category === activeCategory
  );

  const handleDeleteArticle = (articleItem: Article) => {
    const titleText = language === 'bn' ? articleItem.title_bn : articleItem.title;
    const isUserArticle = userArticles.some(a => String(a.id) === String(articleItem.id));
    requestDelete(
      titleText,
      () => {
        setDeletedArticleIds(prev => prev.includes(articleItem.id) ? prev : [...prev, articleItem.id]);
        if (selectedArticle?.id === articleItem.id) setSelectedArticle(null);
      },
      () => {
        setDeletedArticleIds(prev => prev.filter(dId => String(dId) !== String(articleItem.id)));
        if (isUserArticle) {
          setUserArticles(prev => prev.some(a => String(a.id) === String(articleItem.id)) ? prev : [...prev, articleItem]);
        }
      }
    );
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title_bn && !newArticle.title) return;

    const articleItem: Article = {
      id: Date.now(),
      title_bn: newArticle.title_bn || newArticle.title,
      title: newArticle.title || newArticle.title_bn,
      excerpt_bn: newArticle.excerpt_bn || newArticle.excerpt,
      excerpt: newArticle.excerpt || newArticle.excerpt_bn,
      content_bn: newArticle.content_bn || newArticle.content,
      content: newArticle.content || newArticle.content_bn,
      author_bn: newArticle.author_bn || newArticle.author || 'লেখক',
      author: newArticle.author || newArticle.author_bn || 'Author',
      category: newArticle.category,
      category_bn: newArticle.category === 'Spiritual' ? 'আধ্যাত্মিকতা' : newArticle.category === 'Society' ? 'সমাজ' : newArticle.category === 'Health' ? 'স্বাস্থ্য' : newArticle.category === 'Knowledge' ? 'জ্ঞান' : 'যুবসমাজ',
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      date_bn: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      image: newArticle.image || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80'
    };

    setUserArticles(prev => [articleItem, ...prev]);
    setIsAddModalOpen(false);
    setNewArticle({
      title_bn: '',
      title: '',
      excerpt_bn: '',
      excerpt: '',
      content_bn: '',
      content: '',
      author_bn: '',
      author: '',
      category: 'Spiritual',
      category_bn: 'আধ্যাত্মিকতা',
      image: ''
    });
  };

  const categories: ('All' | Article['category'])[] = ['All', 'Spiritual', 'Society', 'Health', 'Knowledge', 'Youth'];

  const handleShare = (article: Article) => {
    if (navigator.share) {
      navigator.share({
        title: language === 'bn' ? article.title_bn : article.title,
        text: language === 'bn' ? article.excerpt_bn : article.excerpt,
        url: window.location.href,
      }).catch((err) => {
        if (err && err.name !== 'AbortError') {
          console.log('Share error:', err);
        }
      });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="bg-emerald-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">{t.nav.articles}</h1>
            <p className="text-emerald-100 italic opacity-80">{t.articles.subtitle}</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg"
          >
            <Plus size={18} />
            {language === 'bn' ? 'নতুন আর্টিকেল' : 'Add Article'}
          </button>
        </div>
        <FileText size={120} className="absolute -right-8 -top-8 opacity-10 rotate-12 pointer-events-none" />
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeCategory === cat 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' 
              : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200'
            }`}
          >
            {cat === 'All' ? t.articles.all : (language === 'bn' ? initialArticles.find(a => a.category === cat)?.category_bn || cat : cat)}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredArticles.map((article, i) => {
          const title = language === 'bn' ? article.title_bn : article.title;
          const excerpt = language === 'bn' ? article.excerpt_bn : article.excerpt;
          const category = language === 'bn' ? article.category_bn : article.category;
          const date = language === 'bn' ? article.date_bn : article.date;
          const author = language === 'bn' ? article.author_bn : article.author;

          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col md:flex-row cursor-pointer transition-all hover:shadow-xl hover:border-emerald-200 relative"
            >
              <div className="h-56 md:h-auto md:w-72 flex-shrink-0 bg-slate-100 relative overflow-hidden">
                <img 
                  src={article.image || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80'} 
                  alt={title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteArticle(article);
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md text-slate-800 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-lg z-10"
                  title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-widest">
                      {category}
                    </span>
                    <div className="h-1 w-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{date}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight mb-3 group-hover:text-emerald-700 transition-colors">{title}</h3>
                  <p className="text-slate-500 font-bold line-clamp-2 italic leading-relaxed">{excerpt}</p>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-tight">{author}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl opacity-60 group-hover:opacity-100 transition-all border border-transparent group-hover:border-emerald-200">
                    <span className="text-[10px] font-black uppercase tracking-widest">বিস্তারিত পড়ুন</span>
                    <ArrowLeft className="rotate-180" size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400 font-bold italic">
          {language === 'bn' ? 'কোন আর্টিকেল পাওয়া যায়নি' : 'No articles found'}
        </div>
      )}

      {/* Add Article Modal */}
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
                {language === 'bn' ? 'নতুন আর্টিকেল যোগ করুন' : 'Add New Article'}
              </h2>

              <form onSubmit={handleAddArticle} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    {language === 'bn' ? 'শিরোনাম (বাংলা)' : 'Title (Bengali)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newArticle.title_bn}
                    onChange={(e) => setNewArticle({ ...newArticle, title_bn: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    {language === 'bn' ? 'সংক্ষিপ্ত বিবরণ' : 'Excerpt'}
                  </label>
                  <textarea
                    rows={2}
                    value={newArticle.excerpt_bn}
                    onChange={(e) => setNewArticle({ ...newArticle, excerpt_bn: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    {language === 'bn' ? 'সম্পূর্ণ মূল লেখা' : 'Full Content'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newArticle.content_bn}
                    onChange={(e) => setNewArticle({ ...newArticle, content_bn: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                      {language === 'bn' ? 'লেখক' : 'Author'}
                    </label>
                    <input
                      type="text"
                      value={newArticle.author_bn}
                      onChange={(e) => setNewArticle({ ...newArticle, author_bn: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                      {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                    </label>
                    <select
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Spiritual">Spiritual (আধ্যাত্মিকতা)</option>
                      <option value="Society">Society (সমাজ)</option>
                      <option value="Health">Health (স্বাস্থ্য)</option>
                      <option value="Knowledge">Knowledge (জ্ঞান)</option>
                      <option value="Youth">Youth (যুবসমাজ)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                    {language === 'bn' ? 'ছবি ইউআরএল (ঐচ্ছিক)' : 'Image URL (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newArticle.image}
                    onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all mt-4"
                >
                  {language === 'bn' ? 'আর্টিকেল প্রকাশ করুন' : 'Publish Article'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-6 right-6 z-20 flex gap-2">
                <button 
                  onClick={() => handleShare(selectedArticle)}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-colors shadow-lg"
                >
                  <Share2 size={20} />
                </button>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-colors shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="h-64 md:h-80 w-full overflow-hidden relative">
                <img 
                  src={selectedArticle.image || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80'} 
                  alt={language === 'bn' ? selectedArticle.title_bn : selectedArticle.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <span className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest inline-block mb-4 shadow-xl">
                    {language === 'bn' ? selectedArticle.category_bn : selectedArticle.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    {language === 'bn' ? selectedArticle.title_bn : selectedArticle.title}
                  </h2>
                </div>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                <div className="flex items-center gap-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-6">
                   <div className="flex items-center gap-2">
                     <Calendar size={14} className="text-emerald-500" />
                     <span>{language === 'bn' ? selectedArticle.date_bn : selectedArticle.date}</span>
                   </div>
                   <div className="w-1.5 h-1.5 bg-slate-100 rounded-full" />
                   <div className="flex items-center gap-2">
                     <User size={14} className="text-emerald-500" />
                     <span>{language === 'bn' ? selectedArticle.author_bn : selectedArticle.author}</span>
                   </div>
                </div>

                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-full opacity-20" />
                    <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-bold italic pl-4">
                       "{language === 'bn' ? selectedArticle.content_bn : selectedArticle.content}"
                    </p>
                  </div>

                  {selectedArticle.reference_bn && (
                    <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 relative overflow-hidden group">
                      <Bookmark className="absolute -right-4 -top-4 opacity-5 text-emerald-900 rotate-12" size={80} />
                      <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-4">তথ্যসূত্র ও দলিলসমূহ</h4>
                      <p className="text-emerald-900 font-bold text-lg italic">
                        {selectedArticle.reference_bn}
                      </p>
                    </div>
                  )}

                  <div className="space-y-6 pt-4">
                    <p className="text-slate-600 leading-loose text-lg font-medium">
                      প্রবন্ধটির বিস্তারিত আলোচনা ও ব্যাখ্যা এখানে প্রদান করা হয়েছে। ইসলামি জ্ঞানের আলো ছড়িয়ে দিতে এই ধরণের প্রবন্ধগুলো অত্যন্ত গুরুত্বপূর্ণ ভূমিকা পালন করে। সঠিক রেফারেন্স এবং নির্ভরযোগ্য উৎস থেকে তথ্য গ্রহণ করাই আমাদের মূল লক্ষ্য।
                    </p>
                  </div>
                </div>

                <div className="pt-10 flex justify-center">
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-800 transition-all shadow-2xl active:scale-95"
                  >
                    <BookOpen size={18} />
                    পড়া শেষ হয়েছে
                  </button>
                </div>
              </div>
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

