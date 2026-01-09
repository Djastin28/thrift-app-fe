import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Dialog({ open, onClose, children, className }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={cn(
          'relative w-full max-w-lg bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, onClose, className }) {
  return (
    <div className={cn('flex items-center justify-between p-6 border-b border-slate-100', className)}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export function DialogTitle({ children, className }) {
  return (
    <h2 className={cn('text-lg font-semibold text-slate-900', className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-slate-500 mt-1', className)}>
      {children}
    </p>
  );
}

export function DialogContent({ children, className }) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-6 pt-0', className)}>
      {children}
    </div>
  );
}
