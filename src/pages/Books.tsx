import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book as BookIcon, Download, X, Search, Filter } from 'lucide-react';
import { books, Book } from '../data/books';

import { useLanguage } from '../contexts/LanguageContext';

export default function Books() {
  const { t } = useLanguage();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filter, setFilter] = useState<'All' | Book['category']>('All');
  const [search, setSearch] = useState('');

  const filteredBooks = books.filter(book => 
    (filter === 'All' || book.category === filter) &&
    (book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase()))
  );

  const categories: ('All' | Book['category'])[] = ['All', 'Hadith', 'Fiqh', 'Aqeedah', 'Seerah'];

  return (
    <div className="space-y-8 pb-20">
      <section className="bg-emerald-900 rounded-3xl p-8 text-emerald-50 relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.books.title}</h1>
          <p className="text-emerald-200">{t.books.subtitle}</p>
        </div>
        <BookIcon size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </section>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t.books.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                filter === cat ? 'bg-emerald-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <motion.div
            key={book.id}
            layoutId={`book-${book.id}`}
            onClick={() => setSelectedBook(book)}
            className="bg-white rounded-3xl border border-slate-100 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100">
              <img 
                src={book.cover || 'https://images.unsplash.com/photo-1544640808-32ca72ac7f67?w=800&q=80'} 
                alt={book.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="px-1 py-1">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">
                {book.category}
              </span>
              <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{book.title}</h3>
              <p className="text-xs text-slate-500 font-medium">By {book.author}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              layoutId={`book-${selectedBook.id}`}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-white rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute right-6 top-6 p-2 bg-slate-100 rounded-full text-slate-500 z-10"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col md:flex-row p-8 gap-8">
                <div className="w-48 aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 shadow-lg mx-auto md:mx-0">
                  <img src={selectedBook.cover || 'https://images.unsplash.com/photo-1544640808-32ca72ac7f67?w=800&q=80'} alt={selectedBook.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      {selectedBook.category}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedBook.title}</h2>
                    <p className="text-slate-500 font-bold">By {selectedBook.author}</p>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedBook.description}
                  </p>
                  <button className="w-full bg-emerald-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/10 active:scale-95">
                    <Download size={20} />
                    {t.books.downloadPDF}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
