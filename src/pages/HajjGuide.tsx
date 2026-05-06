import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, CheckCircle2, Circle, Compass, Info, MessageSquare, Send, Plus, HelpCircle, X, Check } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

interface HajjRule {
  id: number;
  title: string;
  desc: string;
}

interface UserQuestion {
  id: number;
  text: string;
  timestamp: string;
}

export default function HajjGuide() {
  const { language, t } = useLanguage();
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [userRules, setUserRules] = useState<HajjRule[]>([]);
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([]);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form states
  const [newRule, setNewRule] = useState({ title: '', desc: '' });
  const [newQuestion, setNewQuestion] = useState('');

  const hajjSteps = useMemo(() => [
    { 
      title: language === 'bn' ? 'এহরাম ও নিয়ত' : 'Ihram & Niyyah', 
      desc: language === 'bn' ? 'নির্দিষ্ট মীকাত থেকে এহরাম বেঁধে হজ্জের নিয়ত করা।' : 'Enter the state of Ihram and make your intention for Hajj at the Meeqat.' 
    },
    { 
      title: language === 'bn' ? 'মিনা' : 'Mina', 
      desc: language === 'bn' ? '৮ই জিলহজ্জ দিনটি মিনায় অবস্থান করা এবং ইবাদতের মাধ্যমে পরবর্তী দিনের প্রস্তুতি নেওয়া।' : 'Spend the 8th of Dhul-Hijjah in Mina, praying and preparing for Arafat.' 
    },
    { 
      title: language === 'bn' ? 'আরাফাত' : 'Arafat', 
      desc: language === 'bn' ? 'হজ্জের প্রধান রোকন। ৯ই জিলহজ্জ আরাফাতের ময়দানে অবস্থান ও দোয়া করা।' : 'The climax of Hajj. Spending time in supplication on the 9th of Dhul-Hijjah.' 
    },
    { 
      title: language === 'bn' ? 'মুজদালিফা' : 'Muzdalifah', 
      desc: language === 'bn' ? 'সূর্যাস্তের পর আরাফাত থেকে মুজদালিফার উদ্দেশ্যে যাত্রা এবং সেখানে রাতযাপন।' : 'Staying overnight after sunset and collecting pebbles for Jamarat.' 
    },
    { 
      title: language === 'bn' ? 'জামারাত' : 'Rami al-Jamarat', 
      desc: language === 'bn' ? '১০ই থেকে ১২ই জিলহজ্জ শয়তানকে পাথর নিক্ষেপ করা।' : 'Stoning the pillars representing Shaitan on the 10th-12th days.' 
    },
    { 
      title: language === 'bn' ? 'তাওয়াফ ও সাঈ' : 'Tawaf & Sa’i', 
      desc: language === 'bn' ? 'কাবা শরীফ তাওয়াফ করা এবং সাফা-মারওয়া পাহাড়ের মাঝে সাঈ করা।' : 'Circing the Kaaba and walking between Safa and Marwa.' 
    },
  ], [language]);

  const checklistItems = useMemo(() => [
    language === 'bn' ? 'পাসপোর্ট ও ভ্রমণ দলিলপত্র' : "Passport and Travel Documents",
    language === 'bn' ? 'এহরামের কাপড় (২ সেট)' : "Ihram Clothing (2 sets)",
    language === 'bn' ? 'আরামদায়ক হাঁটার জুতো' : "Comfortable Walking Shoes",
    language === 'bn' ? ' জায়নামাজ ও ছাতা' : "Prayer Mat and Umbrella",
    language === 'bn' ? 'ব্যক্তিগত পরিচ্ছন্নতা সামগ্রী (সুগন্ধিহীন)' : "Personal Hygiene Kit (Fragrance-free)",
    language === 'bn' ? 'জরুরি ঔষধপত্র' : "Emergency Medikit",
  ], [language]);

  // Sync with localStorage
  useEffect(() => {
    const savedRules = localStorage.getItem('hajj_user_rules');
    const savedQuestions = localStorage.getItem('hajj_user_questions');
    const savedChecks = localStorage.getItem('hajj_checklist');
    
    if (savedRules) setUserRules(JSON.parse(savedRules));
    if (savedQuestions) setUserQuestions(JSON.parse(savedQuestions));
    if (savedChecks) setCompletedItems(JSON.parse(savedChecks));
  }, []);

  const toggleItem = (item: string) => {
    const updated = completedItems.includes(item) 
      ? completedItems.filter(i => i !== item) 
      : [...completedItems, item];
    setCompletedItems(updated);
    localStorage.setItem('hajj_checklist', JSON.stringify(updated));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const rule: HajjRule = {
      id: Date.now(),
      ...newRule
    };
    const updated = [...userRules, rule];
    setUserRules(updated);
    localStorage.setItem('hajj_user_rules', JSON.stringify(updated));
    setNewRule({ title: '', desc: '' });
    setIsRuleModalOpen(false);
    triggerSuccess();
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const q: UserQuestion = {
      id: Date.now(),
      text: newQuestion,
      timestamp: new Date().toLocaleString()
    };
    const updated = [q, ...userQuestions];
    setUserQuestions(updated);
    localStorage.setItem('hajj_user_questions', JSON.stringify(updated));
    setNewQuestion('');
    setIsQuestionModalOpen(false);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const deleteRule = (id: number) => {
    const updated = userRules.filter(r => r.id !== id);
    setUserRules(updated);
    localStorage.setItem('hajj_user_rules', JSON.stringify(updated));
  };

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <Check size={20} strokeWidth={3} />
            {t.hajj.successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-emerald-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-200 border border-white/10 text-[10px] font-black uppercase tracking-widest"
          >
            <Map size={14} /> Makkah, Saudi Arabia
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">{t.hajj.title}</h1>
          <p className="text-emerald-100/70 text-lg md:text-xl font-medium tracking-tight leading-relaxed">
            {t.hajj.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => setIsQuestionModalOpen(true)}
              className="px-8 py-5 bg-white text-emerald-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center gap-3 shadow-xl"
            >
              <MessageSquare size={18} /> {t.hajj.askQuestion}
            </button>
            <button 
              onClick={() => setIsRuleModalOpen(true)}
              className="px-8 py-5 bg-emerald-800/50 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all flex items-center gap-3"
            >
              <Plus size={18} /> {t.hajj.addRule}
            </button>
          </div>
        </div>
        <Map size={240} className="absolute -right-20 -bottom-20 opacity-5 rotate-12 scale-150" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Journey */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-sm">
                <Compass size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.hajj.journeyTitle}</h2>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[23px] before:top-8 before:bottom-0 before:w-1 before:bg-slate-100">
              {hajjSteps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-14 group"
                >
                  <div className="absolute left-0 top-1 w-12 h-12 bg-white border-4 border-emerald-500 rounded-full flex items-center justify-center font-black text-emerald-700 z-10 shadow-lg transition-transform group-hover:scale-110">
                    {i + 1}
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:border-emerald-200 transition-all">
                    <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Added Rules */}
          {userRules.length > 0 && (
            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shadow-sm">
                  <Info size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{language === 'bn' ? 'সংযোজিত মাসায়েলসমূহ' : 'Added Rules & Notes'}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userRules.map((rule) => (
                  <motion.div 
                    layout
                    key={rule.id}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 relative group"
                  >
                    <button 
                      onClick={() => deleteRule(rule.id)}
                      className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                    <h3 className="text-lg font-black text-slate-800 mb-3 tracking-tight">{rule.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{rule.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Checklist */}
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-600" />
              {t.hajj.packingTitle}
            </h3>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all text-left border-2 ${
                    completedItems.includes(item) 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                      : 'bg-white border-slate-50 text-slate-600 hover:border-emerald-100'
                  } group`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                    completedItems.includes(item) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-200 group-hover:border-emerald-300'
                  }`}>
                    {completedItems.includes(item) && <Check size={14} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className={`text-sm font-bold tracking-tight ${completedItems.includes(item) ? 'line-through opacity-50' : ''}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-4 p-6 bg-slate-50 text-slate-600 rounded-[2rem] border border-slate-100">
                <Info size={20} className="flex-shrink-0 text-emerald-600 mt-1" />
                <p className="text-xs font-bold leading-relaxed tracking-tight">
                  {t.hajj.checkAuthorities}
                </p>
              </div>
            </div>
          </div>

          {/* User Questions */}
          {userQuestions.length > 0 && (
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/20">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <HelpCircle size={24} className="text-slate-400" />
                {t.hajj.questionsList}
              </h3>
              <div className="space-y-4">
                {userQuestions.map((q) => (
                  <div key={q.id} className="p-6 bg-slate-50 rounded-2xl space-y-2">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{q.text}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{q.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-950 rounded-[3rem] p-10 text-white text-center shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-3 tracking-tight">{t.hajj.helpTitle}</h4>
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed italic opacity-80">{t.hajj.helpDesc}</p>
              <button 
                onClick={() => setIsQuestionModalOpen(true)}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageSquare size={18} /> {t.hajj.contactSupport}
              </button>
            </div>
            <MessageSquare size={120} className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0 duration-700" />
          </div>
        </div>
      </div>

      {/* Question Modal */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuestionModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">{t.hajj.askQuestion}</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Get guidance from experts</p>
                </div>
                <button onClick={() => setIsQuestionModalOpen(false)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
              <form onSubmit={handleAskQuestion} className="p-10 space-y-6">
                <textarea 
                  required
                  rows={5}
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder={t.hajj.questionPlaceholder}
                  className="w-full p-8 bg-slate-50 border border-transparent rounded-[2rem] focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-bold text-lg tracking-tight transition-all resize-none"
                />
                <button className="w-full py-6 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-950 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/20 active:scale-95">
                  <Send size={18} strokeWidth={3} /> {t.hajj.submitQuestion}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rule Modal */}
      <AnimatePresence>
        {isRuleModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRuleModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">{t.hajj.addRule}</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Note down important Masail</p>
                </div>
                <button onClick={() => setIsRuleModalOpen(false)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
              <form onSubmit={handleAddRule} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">{t.hajj.ruleTitle}</label>
                  <input 
                    required
                    value={newRule.title}
                    onChange={e => setNewRule({...newRule, title: e.target.value})}
                    className="w-full px-8 py-5 bg-slate-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-black text-sm tracking-tight transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-6 tracking-widest">{t.hajj.ruleDesc}</label>
                  <textarea 
                    required
                    rows={4}
                    value={newRule.desc}
                    onChange={e => setNewRule({...newRule, desc: e.target.value})}
                    className="w-full p-8 bg-slate-50 border border-transparent rounded-[2rem] focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm tracking-tight transition-all resize-none"
                  />
                </div>
                <button className="w-full py-6 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-950 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/20 active:scale-95">
                  <Plus size={18} strokeWidth={3} /> {t.hajj.submitRule}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

