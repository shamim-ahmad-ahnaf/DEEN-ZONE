import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { quizQuestions } from '../data/quiz';

import { useLanguage } from '../contexts/LanguageContext';

export default function Quiz() {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(idx);
    const correct = idx === quizQuestions[currentStep].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gold-100 text-gold-500 rounded-full flex items-center justify-center animate-bounce">
            <Trophy size={48} />
          </div>
        </div>
        
        <div>
          <h1 className="text-4xl font-black text-slate-800 mb-2">{t.quiz.finished}</h1>
          <p className="text-slate-500 font-medium">{t.quiz.finishedDesc}</p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{t.quiz.score}</p>
          <div className="text-5xl font-black text-emerald-900">
            {score} <span className="text-2xl text-emerald-300">/ {quizQuestions.length}</span>
          </div>
        </div>

        <button 
          onClick={restart}
          className="w-full bg-emerald-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all shadow-lg active:scale-95"
        >
          <RefreshCw size={20} />
          {t.quiz.playAgain}
        </button>
      </motion.div>
    );
  }

  const currentQuestion = quizQuestions[currentStep];
  const questionText = language === 'bn' ? currentQuestion.question_bn : currentQuestion.question;
  const options = language === 'bn' ? currentQuestion.options_bn : currentQuestion.options;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{t.quiz.title}</h1>
          <p className="text-slate-500 font-medium">{t.quiz.question} {currentStep + 1} {t.quiz.outOf} {quizQuestions.length}</p>
        </div>
        <div className="px-5 py-2 bg-emerald-50 text-emerald-700 font-black rounded-full border border-emerald-100">
          {t.quiz.score}: {score}
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <motion.div 
          animate={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
          className="bg-emerald-600 h-full"
        />
      </div>

      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
          {questionText}
        </h2>

        <div className="grid gap-3">
          {options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuestion.correctAnswer;
            
            let bgClass = 'bg-slate-50 border-slate-100 hover:border-emerald-200';
            let textClass = 'text-slate-700';

            if (selectedOption !== null) {
              if (isCorrectOption) {
                bgClass = 'bg-emerald-100 border-emerald-300 text-emerald-900';
              } else if (isSelected) {
                bgClass = 'bg-rose-100 border-rose-300 text-rose-900';
              } else {
                bgClass = 'bg-slate-50 border-slate-100 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionSelect(idx)}
                className={`
                  w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all font-bold text-left
                  ${bgClass} ${textClass}
                `}
              >
                <span>{option}</span>
                {selectedOption !== null && isCorrectOption && <CheckCircle2 size={24} className="text-emerald-600" />}
                {selectedOption !== null && isSelected && !isCorrectOption && <XCircle size={24} className="text-rose-600" />}
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedOption !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <button 
              onClick={nextQuestion}
              className="bg-emerald-900 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-emerald-800 shadow-xl transition-all active:scale-95"
            >
              {t.quiz.nextQuestion}
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
