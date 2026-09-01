import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface NotificationToastProps {
  message: string | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 max-w-md">
        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-100 flex-1">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
