import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Prayer = lazy(() => import('./pages/Prayer'));
const Quran = lazy(() => import('./pages/Quran'));
const Hadith = lazy(() => import('./pages/Hadith'));
const Tasbih = lazy(() => import('./pages/Tasbih'));
const Dua = lazy(() => import('./pages/Dua'));
const Articles = lazy(() => import('./pages/Articles'));
const Masail = lazy(() => import('./pages/Masail'));
const History = lazy(() => import('./pages/History'));
const Scholars = lazy(() => import('./pages/Scholars'));
const QA = lazy(() => import('./pages/QA'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Audio = lazy(() => import('./pages/Audio'));
const Video = lazy(() => import('./pages/Video'));
const Ramadan = lazy(() => import('./pages/Ramadan'));
const HajjGuide = lazy(() => import('./pages/HajjGuide'));
const Books = lazy(() => import('./pages/Books'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
  </div>
);

// Placeholder for missing feature pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-6">
      <span className="text-2xl font-bold italic-small italic serif">{name[0]}</span>
    </div>
    <h1 className="text-3xl font-bold text-slate-800 mb-2">{name} Zone</h1>
    <p className="text-slate-500 max-w-md">This feature is coming soon to your Deen Zone companion app. Stay tuned for updates!</p>
  </div>
);

export default function App() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/hadith" element={<Hadith />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/dua" element={<Dua />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/masail" element={<Masail />} />
          <Route path="/history" element={<History />} />
          <Route path="/scholars" element={<Scholars />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/audio" element={<Audio />} />
          <Route path="/video" element={<Video />} />
          <Route path="/ramadan" element={<Ramadan />} />
          <Route path="/hajj" element={<HajjGuide />} />
          <Route path="/books" element={<Books />} />
          
          {/* External/Settings Routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<Placeholder name="About" />} />
          
          {/* Error Handling */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}
