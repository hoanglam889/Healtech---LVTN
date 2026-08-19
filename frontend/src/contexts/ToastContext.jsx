import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as Icons from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* POPUP NOTIFICATION (Shared) */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white font-bold border transition-all animate-[fadeIn_0.2s_ease-out] ${
          notification.type === 'success' ? 'bg-emerald-500 border-emerald-600' : 
          notification.type === 'warning' ? 'bg-amber-500 border-amber-600' : 'bg-rose-500 border-rose-600'
        }`}>
          <Icons.Volume2 className="w-5 h-5 animate-bounce" />
          <span>{notification.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
