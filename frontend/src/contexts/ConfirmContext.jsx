import React, { createContext, useContext, useState, useCallback } from 'react';
import * as Icons from 'lucide-react';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [modalState, setModalState] = useState({ 
    isOpen: false, 
    message: '', 
    onConfirm: null, 
    onCancel: null 
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        message,
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          setTimeout(() => resolve(true), 200); // Wait for transition
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          setTimeout(() => resolve(false), 200);
        }
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {/* POPUP CONFIRMATION */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm m-4 scale-100 animate-[zoomIn_0.2s_ease-out]">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-full shrink-0">
                <Icons.AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Xác nhận thao tác</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{modalState.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={modalState.onCancel} 
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={modalState.onConfirm} 
                className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
