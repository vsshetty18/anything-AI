import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-card shadow-soft bg-card border-l-4 ${
          isError ? 'border-red-400' : 'border-primary'
        }`}
      >
        {isError ? (
          <XCircle size={18} className="text-red-400 shrink-0" />
        ) : (
          <CheckCircle size={18} className="text-primary shrink-0" />
        )}
        <span className="text-sm text-textDark">{message}</span>
        <button onClick={onClose} className="text-textDark/40 hover:text-textDark ml-2">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
