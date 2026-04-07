import React from 'react';
import { LogOut, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: "bg-red-500 shadow-red-500/20 hover:bg-red-600",
    primary: "bg-accent shadow-accent/20 hover:bg-accent/90"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 italic">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-surface border border-border w-full max-w-md rounded-card overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="absolute top-0 right-0 p-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 pt-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
            <LogOut className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-display font-black tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-10 max-w-[280px]">
            {message}
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button
              onClick={onClose}
              className="py-3.5 px-6 rounded-xl border border-border font-bold uppercase tracking-widest text-[10px] hover:bg-surface/80 transition-all active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`py-3.5 px-6 rounded-xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95 ${typeStyles[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
