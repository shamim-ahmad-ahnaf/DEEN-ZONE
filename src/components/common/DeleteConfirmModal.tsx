import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X, RotateCcw } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  language: 'bn' | 'en';
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  language
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]"
          />
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto p-6 space-y-5 border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 transition-colors hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'bn' ? 'মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Deletion'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {message || (
                    title
                      ? (language === 'bn' ? `আপনি কি নিশ্চিত যে "${title}" মুছে ফেলতে চান?` : `Are you sure you want to delete "${title}"?`)
                      : (language === 'bn' ? 'আপনি কি নিশ্চিত যে এটি তালিকা থেকে মুছে ফেলতে চান?' : 'Are you sure you want to delete this item?')
                  )}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/25 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  {language === 'bn' ? 'হ্যাঁ, মুছে ফেলুন' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

interface UndoToastProps {
  isOpen: boolean;
  message?: string;
  onUndo: () => void;
  onClose: () => void;
  language: 'bn' | 'en';
}

export const UndoToast: React.FC<UndoToastProps> = ({
  isOpen,
  message,
  onUndo,
  onClose,
  language
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[130] bg-slate-900/95 text-white backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl px-5 py-3.5 flex items-center gap-4 max-w-md w-[calc(100%-2rem)] justify-between"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <p className="text-xs font-semibold text-slate-200 truncate">
              {message || (language === 'bn' ? 'আইটেমটি মুছে ফেলা হয়েছে' : 'Item has been deleted')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onUndo}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-500/30 active:scale-95"
            >
              <RotateCcw size={13} />
              {language === 'bn' ? 'আন্ডু (ফিরিয়ে আনুন)' : 'Undo'}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
