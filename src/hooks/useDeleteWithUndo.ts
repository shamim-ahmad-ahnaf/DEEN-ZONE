import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface UndoStackItem {
  id: string;
  title?: string;
  onUndo: () => void;
}

export function useDeleteWithUndo() {
  const { language } = useLanguage();

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title?: string;
    onConfirm?: () => void;
  }>({ isOpen: false });

  const [undoStack, setUndoStack] = useState<UndoStackItem[]>([]);
  const timerRef = useRef<any>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setUndoStack([]);
    }, 7000);
  };

  const performDelete = (
    title: string | undefined,
    onConfirmDelete: () => void,
    onUndoDelete?: () => void
  ) => {
    onConfirmDelete();

    if (onUndoDelete) {
      const newItem: UndoStackItem = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        onUndo: onUndoDelete
      };

      setUndoStack(prev => [...prev, newItem]);
      resetTimer();
    }
  };

  const requestDelete = (
    title: string | undefined,
    onConfirmDelete: () => void,
    onUndoDelete?: () => void,
    showConfirmModal: boolean = true
  ) => {
    if (showConfirmModal) {
      setDeleteDialog({
        isOpen: true,
        title,
        onConfirm: () => {
          setDeleteDialog({ isOpen: false });
          performDelete(title, onConfirmDelete, onUndoDelete);
        }
      });
    } else {
      performDelete(title, onConfirmDelete, onUndoDelete);
    }
  };

  const handleUndo = () => {
    setUndoStack(prev => {
      if (prev.length === 0) return [];
      const lastItem = prev[prev.length - 1];
      if (lastItem && typeof lastItem.onUndo === 'function') {
        lastItem.onUndo();
      }
      const nextStack = prev.slice(0, -1);
      if (nextStack.length > 0) {
        resetTimer();
      } else {
        if (timerRef.current) clearTimeout(timerRef.current);
      }
      return nextStack;
    });
  };

  const closeDialog = () => {
    setDeleteDialog({ isOpen: false });
  };

  const closeToast = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setUndoStack([]);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const lastUndoItem = undoStack.length > 0 ? undoStack[undoStack.length - 1] : null;

  let toastMessage = '';
  if (lastUndoItem) {
    if (undoStack.length === 1) {
      toastMessage = lastUndoItem.title
        ? (language === 'bn' ? `"${lastUndoItem.title}" মুছে ফেলা হয়েছে` : `"${lastUndoItem.title}" deleted`)
        : (language === 'bn' ? 'আইটেমটি মুছে ফেলা হয়েছে' : 'Item deleted');
    } else {
      toastMessage = language === 'bn'
        ? `${undoStack.length}টি আইটেম মুছে ফেলা হয়েছে`
        : `${undoStack.length} items deleted`;
    }
  }

  const undoToast = {
    isOpen: undoStack.length > 0,
    message: toastMessage,
    count: undoStack.length,
    onUndo: handleUndo
  };

  return {
    deleteDialog,
    undoToast,
    requestDelete,
    closeDialog,
    closeToast,
    language
  };
}

