/**
 * QueryClient Singleton
 * Configuración centralizada de React Query
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Configuración global de React Query
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache & Stale Time
      staleTime: 5 * 60 * 1000, // 5 minutos - datos se consideran frescos
      gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en caché (antes era cacheTime)
      
      // Retry Policy
      retry: (failureCount, error: any) => {
        // No reintentar errores 4xx (errores del cliente/usuario)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        
        // Reintentar hasta 3 veces para errores 5xx (servidor)
        return failureCount < 3
      },
      
      // Retry Delay - Exponential Backoff
      retryDelay: (attemptIndex) => {
        // 1s, 2s, 4s, 8s... máximo 30s
        return Math.min(1000 * 2 ** attemptIndex, 30000)
      },
      
      // Refetch Behavior
      refetchOnWindowFocus: true, // Refrescar cuando vuelves a la ventana
      refetchOnReconnect: true, // Refrescar cuando se recupera la conexión
      refetchOnMount: true, // Refrescar al montar componente
      
      // Network Mode
      networkMode: 'online', // Solo ejecutar queries cuando hay internet
    },
    
    mutations: {
      // Retry Policy para mutations (más conservador)
      retry: false, // No reintentar mutations por defecto
      
      // Network Mode
      networkMode: 'online',
    },
  },
})

export default queryClient