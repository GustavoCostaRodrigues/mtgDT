import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgStyles = {
    success: 'bg-[#171513] text-white border-[#9b7130]',
    error: 'bg-[#7e2f28] text-white border-red-400',
    info: 'bg-[#29476a] text-white border-blue-400',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-2xl text-xs font-bold transition-all animate-fadeIn ${bgStyles[type]}`}
    >
      <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>{message}</span>
      <button type="button" onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer" aria-label="Fechar notificação">
        ×
      </button>
    </div>
  );
}

export default Toast;
