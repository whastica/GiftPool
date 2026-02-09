/**
 * React Query Configuration
 * Query Keys Factory y utilidades
 */

// ============================================
// QUERY KEYS FACTORY
// ============================================

/**
 * Factory de Query Keys
 * Centraliza todas las claves de queries para evitar duplicados
 * 
 * Patrón recomendado por React Query:
 * ['entity'] - Lista todas las entidades
 * ['entity', id] - Entidad específica
 * ['entity', 'list', filters] - Lista filtrada
 * ['entity', 'detail', id] - Detalle de entidad
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  
  // Wishlists
  wishlists: {
    all: ['wishlists'] as const,
    lists: () => [...queryKeys.wishlists.all, 'list'] as const,
    list: (filters?: Record<string, any>) => 
      [...queryKeys.wishlists.lists(), filters] as const,
    details: () => [...queryKeys.wishlists.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.wishlists.details(), id] as const,
    bySlug: (slug: string) => 
      [...queryKeys.wishlists.all, 'slug', slug] as const,
    byUser: (userId: string) => 
      [...queryKeys.wishlists.all, 'user', userId] as const,
  },
  
  // Stats
  stats: {
    all: ['stats'] as const,
    dashboard: (userId: string) => 
      [...queryKeys.stats.all, 'dashboard', userId] as const,
  },
  
  // Contributors
  contributors: {
    all: ['contributors'] as const,
    byWishlist: (wishlistId: string) => 
      [...queryKeys.contributors.all, 'wishlist', wishlistId] as const,
  },
} as const

// ============================================
// QUERY OPTIONS HELPERS
// ============================================

/**
 * Opciones comunes para queries de datos en tiempo real
 */
export const realtimeQueryOptions = {
  staleTime: 0, // Siempre considerar datos obsoletos
  gcTime: 5 * 60 * 1000, // 5 min en caché
  refetchInterval: 30 * 1000, // Refetch cada 30 segundos
  refetchIntervalInBackground: false, // No refetch en background
}

/**
 * Opciones comunes para queries de datos estáticos
 */
export const staticQueryOptions = {
  staleTime: 24 * 60 * 60 * 1000, // 24 horas
  gcTime: 48 * 60 * 60 * 1000, // 48 horas
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
}

/**
 * Opciones comunes para queries de usuario
 */
export const userQueryOptions = {
  staleTime: 10 * 60 * 1000, // 10 minutos
  gcTime: 30 * 60 * 1000, // 30 minutos
}

// ============================================
// MUTATION KEYS
// ============================================

/**
 * Claves para mutations (opcional, pero ayuda con logging)
 */
export const mutationKeys = {
  // Wishlist mutations
  createWishlist: 'createWishlist',
  updateWishlist: 'updateWishlist',
  deleteWishlist: 'deleteWishlist',
  
  // Contribution mutations
  createContribution: 'createContribution',
  uploadVideo: 'uploadVideo',
  
  // Auth mutations
  login: 'login',
  register: 'register',
  logout: 'logout',
} as const

// ============================================
// TYPES
// ============================================

/**
 * Tipo para errores de API
 */
export interface ApiError {
  message: string
  status?: number
  code?: string
  field?: string
}

/**
 * Tipo genérico para respuestas paginadas
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// ============================================
// ERROR HANDLERS
// ============================================

/**
 * Extrae mensaje de error de diferentes formatos
 */
export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'Error desconocido'
  
  // Error de Axios
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as any
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      'Error en la solicitud'
    )
  }
  
  // Error estándar
  if (error instanceof Error) {
    return error.message
  }
  
  // String
  if (typeof error === 'string') {
    return error
  }
  
  return 'Error desconocido'
}

/**
 * Determina si un error es de red/conexión
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!error) return false
  
  const message = getErrorMessage(error).toLowerCase()
  
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('conexión') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('offline')
  )
}

/**
 * Determina si un error es 4xx (cliente)
 */
export const isClientError = (error: unknown): boolean => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const status = (error as any).response?.status
    return status >= 400 && status < 500
  }
  return false
}

/**
 * Determina si un error es 5xx (servidor)
 */
export const isServerError = (error: unknown): boolean => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const status = (error as any).response?.status
    return status >= 500
  }
  return false
}