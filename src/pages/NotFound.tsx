import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{t.notFound.title}</h1>
      <p className="text-slate-500 max-w-md mb-10 text-lg">
        {t.notFound.subtitle}
      </p>
      
      <Button 
        variant="primary" 
        size="lg" 
        onClick={() => navigate('/')}
        className="gap-2"
      >
        <Home size={20} />
        {t.notFound.backHome}
      </Button>
    </div>
  );
}
