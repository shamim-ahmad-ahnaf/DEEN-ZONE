import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function useDeleteWithUndo() {
  const { language } = useLanguage();

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title?: string;
    onConfirm?: () => void;
  }>({ isOpen: false });

  const [undoToast, setUndoToast] = useState<{
    isOpen: boolean;
    message?: string;
    onUndo?: () => void;
  }>({ isOpen: false });

  const timerRef = useRef<any>(null);

  const requestDelete = (
    title: string | undefined,
    onConfirmDelete: () => void,
    onUndoDelete?: () => void
  ) => {
    setDeleteDialog({
      isOpen: true,
      title,
      onConfirm: () => {
        onConfirmDelete();
        setDeleteDialog({ isOpen: false });

        if (onUndoDelete) {
          if (timerRef.current) clearTimeout(timerRef.current);

          setUndoToast({
            isOpen: true,
            message: title
              ? (language === 'bn' ? `"${title}" মুছে ফেলা হয়েছে` : `"${title}" deleted`)
              : (language === 'bn' ? 'আইটেম মুছে ফেলা হয়েছে' : 'Item deleted'),
            onUndo: () => {
              onUndoDelete();
              setUndoToast({ isOpen: false });
            }
          });

          timerRef.current = setTimeout(() => {
            setUndoToast(prev => ({ ...prev, isOpen: false }));
          }, 6000);
        }
      }
    });
  };

  const closeDialog = () => {
    setDeleteDialog({ isOpen: false });
  };

  const closeToast = () => {
    setUndoToast({ isOpen: false });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    deleteDialog,
    undoToast,
    requestDelete,
    closeDialog,
    closeToast,
    language
  };
}
