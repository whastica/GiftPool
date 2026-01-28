import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`
              flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg
              text-white animate-slide-up
              ${
                toast.type === 'success'
                  ? 'bg-green-600'
                  : toast.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-gray-800'
              }
            `}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
