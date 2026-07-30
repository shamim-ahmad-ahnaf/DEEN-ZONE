import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book as BookIcon, Download, X, Search, BookOpen, Library, Plus, Trash2, Globe, FileText, User } from 'lucide-react';
import { books as initialBooks, Book } from '../data/books';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo';
import { DeleteConfirmModal, UndoToast } from '../components/common/DeleteConfirmModal';

export default function Books() {
  const { language, t } = useLanguage();
  const { deleteDialog, undoToast, requestDelete, closeDialog, closeToast } = useDeleteWithUndo();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filter, setFilter] = useState<'All' | Book['category']>('All');
  const [search, setSearch] = useState('');
  const [userBooks, setUserBooks] = useLocalStorage<Book[]>('user_books', []);
  const [deletedBookIds, setDeletedBookIds] = useLocalStorage<number[]>('deleted_book_ids', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Book Form State
  const [newBook, setNewBook] = useState({
    title: '',
    title_bn: '',
    author: '',
    author_bn: '',
    category: 'Other' as Book['category'],
    cover: '',
    description: '',
    description_bn: '',
    pdfUrl: ''
  });

  const allBooks = useMemo(() => {
    return [...initialBooks, ...userBooks].filter(b => !deletedBookIds.some(dId => String(dId) === String(b.id)));
  }, [userBooks, deletedBookIds]);

  const filteredBooks = useMemo(() => {
    return allBooks.filter(book => {
      const matchesFilter = filter === 'All' || book.category === filter;
      const searchText = search.toLowerCase();
      const matchesSearch = 
        book.title.toLowerCase().includes(searchText) || 
        book.title_bn.includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        book.author_bn.includes(searchText);
      
      return matchesFilter && matchesSearch;
    });
  }, [allBooks, filter, search]);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const book: Book = {
      ...newBook,
      id: Date.now(),
      title_bn: newBook.title_bn || newBook.title,
      author_bn: newBook.author_bn || newBook.author,
      description_bn: newBook.description_bn || newBook.description,
      cover: newBook.cover || 'https://images.unsplash.com/photo-1544640808-32ca72ac7f67?w=800&q=80'
    };

    const updated = [...userBooks, book];
    setUserBooks(updated);
    localStorage.setItem('user_books', JSON.stringify(updated));
    setIsAddModalOpen(false);
    setNewBook({
      title: '',
      title_bn: '',
      author: '',
      author_bn: '',
      category: 'Other',
      cover: '',
      description: '',
      description_bn: '',
      pdfUrl: ''
    });
  };

  const handleDeleteBook = (bookItem: Book) => {
    const bookTitle = language === 'bn' ? bookItem.title_bn : bookItem.title;
    requestDelete(
      bookTitle,
      () => {
        const updated = userBooks.filter(b => b.id !== bookItem.id);
        setUserBooks(updated);
        localStorage.setItem('user_books', JSON.stringify(updated));
        setDeletedBookIds(prev => prev.includes(bookItem.id) ? prev : [...prev, bookItem.id]);
        if (selectedBook?.id === bookItem.id) setSelectedBook(null);
      },
      () => {
        setDeletedBookIds(prev => prev.filter(dId => String(dId) !== String(bookItem.id)));
      }
    );
  };

  const categories: ('All' | Book['category'])[] = ['All', 'Hadith', 'Seerah', 'Aqeedah', 'Fiqh', 'Other'];

  const getCategoryLabel = (cat: string) => {
    if (language === 'en') return cat;
    switch (cat) {
      case 'All': return 'সবগুলো';
      case 'Hadith': return 'হাদিস';
      case 'Seerah': return 'সীরাত';
      case 'Aqeedah': return 'আকীদাহ';
      case 'Fiqh': return 'ফিকহ';
      case 'Other': return 'অন্যান্য';
      default: return cat;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section className="relative h-[25rem] md:h-[30rem] rounded-[3.5rem] overflow-hidden group shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1584281723351-90a6e0388902?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.4]"
          alt="Library"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-emerald-950/40 to-transparent flex items-center px-8 md:px-20">
          <div className="max-w-2xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full text-emerald-200 border border-white/10 text-xs font-black uppercase tracking-[0.2em]"
            >
              <Library size={16} /> {language === 'bn' ? 'ইসলামিক লাইব্রেরি' : 'Islamic Digital Library'}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]"
            >
              {t.books.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-100/60 text-xl font-medium tracking-tight max-w-lg leading-relaxed"
            >
              {t.books.subtitle}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/50 transition-all hover:bg-emerald-50"
            >
              <Plus size={18} strokeWidth={3} /> {language === 'bn' ? 'নতুন বই যোগ করুন' : 'Add New Book'}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between px-2">
        <div className="relative w-full max-w-xl group">
          <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={22} />
          <input 
            type="text" 
            placeholder={t.books.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-medium text-lg tracking-tight"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none w-full xl:w-auto mt-2 xl:mt-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 shadow-sm active:shadow-inner ${
                filter === cat 
                  ? 'bg-emerald-900 text-white shadow-emerald-900/30 shadow-2xl scale-105' 
                  : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50 hover:border-emerald-100'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid - Re-styled for 4-5 columns and better mobile spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-10 px-2">
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <div className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-700 group-hover:shadow-[0_30px_70px_rgba(6,78,59,0.15)] group-hover:-translate-y-3 cursor-pointer bg-slate-50">
               {/* Cover Image */}
               <img 
                src={book.cover} 
                alt={language === 'bn' ? book.title_bn : book.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              
              {/* Interaction Overlay */}
              <div 
                onClick={() => setSelectedBook(book)}
                className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-900 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                  <BookOpen size={28} strokeWidth={2.5} />
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Read More</span>
              </div>

              {/* Badges */}
              <div className="absolute top-6 left-6 pointer-events-none">
                <span className="px-5 py-2 bg-white/90 backdrop-blur-xl text-emerald-900 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg border border-white/20">
                  {getCategoryLabel(book.category)}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBook(book);
                }}
                className="absolute bottom-6 right-6 p-4 bg-black/60 backdrop-blur-xl text-white rounded-full hover:bg-rose-600 transition-all opacity-80 group-hover:opacity-100 border border-white/20 hover:scale-110 z-10"
                title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="px-3" onClick={() => setSelectedBook(book)}>
              <h3 className="font-black text-slate-800 text-lg md:text-xl tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                {language === 'bn' ? book.title_bn : book.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 opacity-60">
                <div className="w-5 h-1 bg-emerald-500 rounded-full" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  {language === 'bn' ? book.author_bn : book.author}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
          <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 rotate-6">
            <Library size={64} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-400 tracking-tight">{language === 'bn' ? 'কোন বই পাওয়া যায়নি' : 'No books found'}</h3>
            <p className="text-slate-300 font-bold">{language === 'bn' ? 'অনুগ্রহ করে অন্য নামে বা ক্যাটাগরিতে চেষ্টা করুন' : 'Try adjusting your search or categories'}</p>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl bg-white rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.3)] relative z-10 overflow-hidden"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute right-8 top-8 p-4 bg-slate-100 rounded-full text-slate-500 hover:bg-rose-600 hover:text-white transition-all z-20 hover:scale-110 active:scale-95"
              >
                <X size={20} strokeWidth={3} />
              </button>

              <div className="flex flex-col md:flex-row divide-x divide-slate-50">
                {/* Book Cover Area */}
                <div className="w-full md:w-[45%] bg-slate-50/50 p-12 md:p-20 flex items-center justify-center">
                  <div className="relative group w-full max-w-[320px]">
                    <div className="absolute inset-0 bg-emerald-900/30 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img 
                      src={selectedBook.cover} 
                      alt={language === 'bn' ? selectedBook.title_bn : selectedBook.title} 
                      className="w-full aspect-[3/4.5] object-cover rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] relative z-10"
                    />
                  </div>
                </div>

                {/* Book Info Area */}
                <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col justify-between">
                  <div className="space-y-8">
                    <div>
                      <span className="inline-block px-5 py-2 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] mb-6">
                        {getCategoryLabel(selectedBook.category)}
                      </span>
                      <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-6">
                        {language === 'bn' ? selectedBook.title_bn : selectedBook.title}
                      </h2>
                      <div className="flex items-center gap-4 text-slate-500">
                        <div className="w-12 h-12 rounded-full bg-emerald-900 flex items-center justify-center text-white font-black text-lg">
                          {selectedBook.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Author</p>
                          <p className="font-bold text-xl tracking-tight text-slate-700">
                            {language === 'bn' ? selectedBook.author_bn : selectedBook.author}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                           <FileText size={16} className="text-emerald-500" />
                           <p className="text-xs font-black uppercase tracking-widest text-slate-400">Synopsis</p>
                        </div>
                        <p className="text-slate-600 text-xl leading-relaxed font-medium tracking-tight">
                          {language === 'bn' ? selectedBook.description_bn : selectedBook.description}
                        </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-12">
                    <button 
                      onClick={() => window.open(selectedBook.pdfUrl, '_blank')}
                      className="flex-[2] bg-emerald-900 text-white font-black uppercase tracking-widest text-xs py-6 rounded-2xl flex items-center justify-center gap-4 hover:bg-emerald-950 transition-all shadow-2xl shadow-emerald-900/30 active:scale-95 group"
                    >
                      <BookOpen size={20} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                      {t.books.readBook}
                    </button>
                    <a 
                      href={selectedBook.pdfUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-8 py-6 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 border border-slate-200/50 shadow-sm"
                    >
                      <Download size={20} strokeWidth={2.5} />
                      {language === 'bn' ? 'পিডিএফ' : 'PDF'}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Book Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">
                    {language === 'bn' ? 'নতুন বই যোগ করুন' : 'Enrich the Library'}
                  </h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Share knowledge with the Ummah</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all shrink-0"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-8 md:p-10 custom-scrollbar">
                <form onSubmit={handleAddBook} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Book Title</label>
                      <div className="relative">
                        <BookIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input 
                          required
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm tracking-tight transition-all placeholder:text-slate-300"
                          value={newBook.title}
                          onChange={e => setNewBook({...newBook, title: e.target.value})}
                          placeholder="e.g. Sahih al-Bukhari"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">বইয়ের নাম (বাংলা)</label>
                      <input 
                        className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm tracking-tight transition-all placeholder:text-slate-300"
                        value={newBook.title_bn}
                        onChange={e => setNewBook({...newBook, title_bn: e.target.value})}
                        placeholder="বাংলা নাম লিখুন"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Author</label>
                      <div className="relative">
                        <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input 
                          required
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all placeholder:text-slate-300"
                          value={newBook.author}
                          onChange={e => setNewBook({...newBook, author: e.target.value})}
                          placeholder="e.g. Imam Bukhari"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Category</label>
                      <div className="relative">
                        <select 
                          className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm appearance-none cursor-pointer transition-all"
                          value={newBook.category}
                          onChange={e => setNewBook({...newBook, category: e.target.value as Book['category']})}
                        >
                          {categories.filter(c => c !== 'All').map(c => (
                            <option key={c} value={c}>{getCategoryLabel(c)}</option>
                          ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <Plus size={16} className="rotate-45" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">PDF Link or Book URL</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                      <input 
                        required
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm transition-all placeholder:text-slate-300"
                        value={newBook.pdfUrl}
                        onChange={e => setNewBook({...newBook, pdfUrl: e.target.value})}
                        placeholder="https://archive.org/.../book.pdf"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Short Description</label>
                    <textarea 
                      required
                      rows={3}
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm resize-none transition-all placeholder:text-slate-300"
                      value={newBook.description}
                      onChange={e => setNewBook({...newBook, description: e.target.value})}
                      placeholder="Briefly describe what this book is about..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-900 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-950/20 active:scale-95"
                  >
                    <Plus size={20} strokeWidth={3} />
                    {language === 'bn' ? 'লাইব্রেরিতে যোগ করুন' : 'Add to Library'}
                  </button>
                </form>
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
