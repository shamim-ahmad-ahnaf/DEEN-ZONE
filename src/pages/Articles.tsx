import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronRight, X, Calendar, User } from 'lucide-react';
import { articles, Article } from '../data/educational';

import { useLanguage } from '../contexts/LanguageContext';

export default function Articles() {
  const { t, language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<'All' | Article['category']>('All');

  const filteredArticles = articles.filter(article => 
    activeCategory === 'All' || article.category === activeCategory
  );

  const categories: ('All' | Article['category'])[] = ['All', 'Spiritual', 'Society', 'Health', 'Youth'];

  return (
    <div className="space-y-8">
      <section className="bg-blue-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.nav.articles}</h1>
          <p className="text-blue-100 italic">{t.articles.subtitle}</p>
        </div>
        <FileText size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </section>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeCategory === cat 
              ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' 
              : 'bg-white text-slate-600 border border-slate-100 hover:border-blue-200'
            }`}
          >
            {cat === 'All' ? t.articles.all : (language === 'bn' ? articles.find(a => a.category === cat)?.category_bn || cat : cat)}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredArticles.map((article) => {
          const title = language === 'bn' ? article.title_bn : article.title;
          const excerpt = language === 'bn' ? article.excerpt_bn : article.excerpt;
          const category = language === 'bn' ? article.category_bn : article.category;
          const date = language === 'bn' ? article.date_bn : article.date;
          const author = language === 'bn' ? article.author_bn : article.author;

          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedArticle(article)}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row cursor-pointer transition-all hover:shadow-md"
            >
              <div className="h-48 md:h-auto md:w-64 flex-shrink-0 bg-slate-100">
                <img src={article.image} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4 flex flex-col justify-center">
                <div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                    {category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-2 line-clamp-2">{title}</h3>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 italic">{excerpt}</p>
                <div className="flex items-center gap-4 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> {date}</span>
                  <span className="flex items-center gap-1.5"><User size={12} /> {author}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-[2.5rem] shadow-2xl z-[110] overflow-y-auto custom-scrollbar"
            >
              <div className="sticky top-0 right-0 p-6 flex justify-end z-20 pointer-events-none">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-2.5 bg-slate-900/10 backdrop-blur-md rounded-full text-slate-900 pointer-events-auto hover:bg-slate-950/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8 pb-12">
                <div className="h-64 md:h-80 w-full bg-slate-100 overflow-hidden -mt-20">
                  <img src={selectedArticle.image} alt={language === 'bn' ? selectedArticle.title_bn : selectedArticle.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="px-8 md:px-12 space-y-6">
                  <div className="space-y-4">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-black rounded-full uppercase tracking-widest inline-block">
                      {language === 'bn' ? selectedArticle.category_bn : selectedArticle.category}
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-800 leading-tight">
                      {language === 'bn' ? selectedArticle.title_bn : selectedArticle.title}
                    </h2>
                    <div className="flex items-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-[0.1em] border-b border-slate-50 pb-6">
                       <span>{language === 'bn' ? selectedArticle.date_bn : selectedArticle.date}</span>
                       <span>{t.articles.by} {language === 'bn' ? selectedArticle.author_bn : selectedArticle.author}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-xl text-slate-800 leading-relaxed font-bold border-l-4 border-blue-500 pl-6 italic">
                       {language === 'bn' ? selectedArticle.content_bn : selectedArticle.content}
                    </p>
                    <p className="text-slate-600 leading-loose text-lg">
                      {t.articles.lorem1}
                    </p>
                    <p className="text-slate-600 leading-loose text-lg">
                      {t.articles.lorem2}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
