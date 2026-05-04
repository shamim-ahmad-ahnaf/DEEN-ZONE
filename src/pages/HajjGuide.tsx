import { useState } from 'react';
import { motion } from 'motion/react';
import { Map, CheckCircle2, Circle, ChevronRight, Info, Compass } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

const hajjSteps = [
  { title: 'Ihram & Niyyah', desc: 'Enter the state of Ihram and make your intention for Hajj at the Meeqat.' },
  { title: 'Mina', desc: 'Spend the 8th of Dhul-Hijjah in Mina, praying and preparing for Arafat.' },
  { title: 'Arafat', desc: 'The climax of Hajj. Spending time in supplication on the 9th of Dhul-Hijjah.' },
  { title: 'Muzdalifah', desc: 'Staying overnight after sunset and collecting pebbles for Jamarat.' },
  { title: 'Rami al-Jamarat', desc: 'Stoning the pillars representing Shaitan on the 10th-12th days.' },
  { title: 'Tawaf & Sa’i', desc: 'Circing the Kaaba and walking between Safa and Marwa.' },
];

const checklistItems = [
  "Passport and Travel Documents",
  "Ihram Clothing (2 sets)",
  "Comfortable Walking Shoes",
  "Prayer Mat and Umbrella",
  "Personal Hygiene Kit (Fragrance-free)",
  "Emergency Medikit",
];

export default function HajjGuide() {
  const { t } = useLanguage();
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setCompletedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="bg-emerald-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.hajj.title}</h1>
          <p className="text-emerald-100 opacity-80">{t.hajj.subtitle}</p>
        </div>
        <Map size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Compass size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{t.hajj.journeyTitle}</h2>
          </div>

          <div className="space-y-4 relative before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-100">
            {hajjSteps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-1 w-10 h-10 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center font-bold text-emerald-700 z-10 shadow-sm">
                  {i + 1}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed italic italic">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600" />
              {t.hajj.packingTitle}
            </h3>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border ${
                    completedItems.includes(item) 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                      : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-emerald-200'
                  }`}
                >
                  {completedItems.includes(item) ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  <span className={`text-sm font-medium ${completedItems.includes(item) ? 'line-through opacity-70' : ''}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 p-4 bg-gold-50 text-gold-900 rounded-2xl border border-gold-100">
                <Info size={20} className="flex-shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                  {t.hajj.checkAuthorities}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white text-center">
            <h4 className="font-bold mb-2">{t.hajj.helpTitle}</h4>
            <p className="text-slate-400 text-xs mb-4">{t.hajj.helpDesc}</p>
            <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors text-sm">
              {t.hajj.contactSupport}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
