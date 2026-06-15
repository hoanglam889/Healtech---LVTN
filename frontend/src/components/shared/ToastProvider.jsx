import React, { createContext, useContext, useState, useCallback } from 'react';
import * as Icons from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const iconMap = {
    success: <Icons.CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <Icons.AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Icons.Info className="w-5 h-5 text-blue-500 shrink-0" />,
    warning: <Icons.AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  const bgMap = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-amber-50 border-amber-200',
  };

  const textMap = {
    success: 'text-emerald-800',
    error: 'text-rose-800',
    info: 'text-blue-800',
    warning: 'text-amber-800',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg text-sm font-semibold pointer-events-auto
              animate-[slideInRight_0.2s_ease-out] ${bgMap[toast.type] || bgMap.info} ${textMap[toast.type] || textMap.info}`}
          >
            {iconMap[toast.type] || iconMap.info}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Simple inline confirmation modal to replace window.confirm() */
export function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10">
        <p className="text-gray-800 font-semibold text-sm mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors cursor-pointer"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
