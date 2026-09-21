import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  role?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth,
  size,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const effectiveWidth = size || maxWidth || 'lg';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidthMap[effectiveWidth]} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content body */}
        <div className="px-6 py-5 overflow-y-auto space-y-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
