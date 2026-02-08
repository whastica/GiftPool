import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

// Providers
import { AuthProvider } from './context/AuthContext'
import { QueryProvider } from './providers/QueryProvider'

// ✨ NOTA: Mantenemos tu ToastProvider como fallback por si lo necesitas
// pero usaremos react-hot-toast como sistema principal
import { ToastProvider } from './components/ui/ToastContext'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        {/* ✅ EPIC 9: React Query Provider - DEBE IR PRIMERO */}
        <QueryProvider>
          {/* Auth Provider */}
          <AuthProvider>
            {/* Toast Provider (tu implementación original - opcional) */}
            <ToastProvider>
              <App />
              
              {/* ✅ EPIC 9: React Hot Toast - Sistema principal de notificaciones */}
              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                  // Estilos globales
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  
                  // Estilos por tipo
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                    style: {
                      background: '#10b981',
                    },
                  },
                  
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                    style: {
                      background: '#ef4444',
                    },
                  },
                  
                  loading: {
                    style: {
                      background: '#7c3aed',
                    },
                  },
                }}
              />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
} else {
  console.error("No se encontró un elemento con el ID 'root'.")
}