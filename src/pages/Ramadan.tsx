import { motion } from 'motion/react';
import { Moon, Utensils, Sunrise, Heart } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

const ramadanTimings = [
  { day: 1, date: 'Mar 10', sehri: '04:52 AM', iftar: '06:12 PM' },
  { day: 2, date: 'Mar 11', sehri: '04:51 AM', iftar: '06:13 PM' },
  { day: 3, date: 'Mar 12', sehri: '04:50 AM', iftar: '06:13 PM' },
  { day: 4, date: 'Mar 13', sehri: '04:49 AM', iftar: '06:14 PM' },
  { day: 5, date: 'Mar 14', sehri: '04:48 AM', iftar: '06:14 PM' },
];

export default function Ramadan() {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-8 pb-20">
      <section className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.ramadan.title}</h1>
          <p className="text-indigo-200">{t.ramadan.subtitle}</p>
        </div>
        <Moon size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-indigo-700">
            <Sunrise size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">{t.ramadan.sehriDua}</h3>
          </div>
          <p className="arabic-text text-2xl text-right leading-loose text-emerald-950 font-medium">
            وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ
          </p>
          <p className="text-slate-600 text-sm italic">
            {language === 'bn' ? 'আমি আগামীকালের রমজান মাসের রোজা রাখার নিয়ত করছি।' : 'I intend to keep the fast for tomorrow in the month of Ramadan.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-rose-700">
            <Utensils size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">{t.ramadan.iftarDua}</h3>
          </div>
          <p className="arabic-text text-2xl text-right leading-loose text-emerald-950 font-medium">
            اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
          </p>
          <p className="text-slate-600 text-sm italic">
            {language === 'bn' ? 'হে আল্লাহ! আমি তোমারই জন্য রোজা রেখেছি এবং তোমারই দেয়া রিজিক দ্বারা ইফতার করছি।' : 'O Allah, I fasted for You and I break my fast with Your provision.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">{t.ramadan.timingsTitle}</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, BD'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-6 py-4">{t.ramadan.day}</th>
                <th className="px-6 py-4">{t.ramadan.date}</th>
                <th className="px-6 py-4 text-emerald-600">{t.ramadan.sehriEnds}</th>
                <th className="px-6 py-4 text-rose-600">{t.ramadan.iftarBegins}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ramadanTimings.map((t_item) => (
                <tr key={t_item.day} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{t.ramadan.day} {t_item.day}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{t_item.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{t_item.sehri}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{t_item.iftar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gold-50 border border-gold-200 p-8 rounded-[2.5rem] text-center space-y-4">
        <div className="w-16 h-16 bg-gold-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-gold-500/20">
          <Heart size={28} />
        </div>
        <h3 className="text-xl font-bold text-emerald-950">{t.ramadan.virtueTitle}</h3>
        <div className="text-emerald-900 text-sm max-w-sm mx-auto leading-relaxed italic">
          <p>{t.ramadan.virtueText}</p>
          <p className="block mt-2 font-bold">{t.ramadan.virtueRef}</p>
        </div>
      </div>
    </div>
  );
}
