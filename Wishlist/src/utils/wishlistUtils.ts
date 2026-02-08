/**
 * Utilidades para wishlists
 * Funciones helpers para filtrado, ordenamiento, cálculos y formateo
 */

import type { 
  Wishlist, 
  WishlistFilter, 
  WishlistListItem, 
  WishlistStatus,
  DashboardStats 
} from '../types/wishlistTypes'

// ============================================
// FILTRADO Y BÚSQUEDA
// ============================================

/**
 * Filtra wishlists por estado
 */
export const filterWishlistsByStatus = (
  wishlists: Wishlist[],
  filter: WishlistFilter
): Wishlist[] => {
  if (filter === 'all') return wishlists

  return wishlists.filter((wishlist) => {
    if (filter === 'expired') {
      return isWishlistExpired(wishlist)
    }
    return wishlist.status === filter
  })
}

/**
 * Busca wishlists por texto
 */
export const searchWishlists = (
  wishlists: Wishlist[],
  searchTerm: string
): Wishlist[] => {
  if (!searchTerm.trim()) return wishlists

  const term = searchTerm.toLowerCase()
  return wishlists.filter(
    (wishlist) =>
      wishlist.title.toLowerCase().includes(term) ||
      wishlist.product.name.toLowerCase().includes(term)
  )
}

// ============================================
// VALIDACIONES DE ESTADO
// ============================================

/**
 * Verifica si una wishlist está expirada
 */
export const isWishlistExpired = (wishlist: Wishlist): boolean => {
  if (wishlist.status === 'completed' || wishlist.status === 'cancelled') {
    return false
  }

  const eventDate = new Date(wishlist.eventDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return eventDate < today
}

/**
 * Obtiene el estado actual de una wishlist
 */
export const getWishlistStatus = (wishlist: Wishlist): WishlistStatus => {
  if (wishlist.status === 'cancelled') return 'cancelled'
  if (wishlist.currentAmount >= wishlist.targetAmount) return 'completed'
  if (isWishlistExpired(wishlist)) return 'expired'
  return 'active'
}

/**
 * Verifica si una wishlist está activa
 */
export const isWishlistActive = (wishlist: Wishlist): boolean => {
  return getWishlistStatus(wishlist) === 'active'
}

// ============================================
// CÁLCULOS
// ============================================

/**
 * Calcula el porcentaje de progreso
 */
export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0
  const progress = (current / target) * 100
  return Math.min(Math.round(progress), 100)
}

/**
 * Calcula cuánto falta para completar
 */
export const calculateRemaining = (current: number, target: number): number => {
  return Math.max(target - current, 0)
}

/**
 * Calcula días restantes hasta el evento
 */
export const calculateDaysRemaining = (eventDate: string): number => {
  const event = new Date(eventDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  event.setHours(0, 0, 0, 0)

  const diffTime = event.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

// ============================================
// FORMATEO
// ============================================

/**
 * Formatea moneda colombiana
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formatea moneda de forma compacta (1.2M, 500k)
 */
export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}k`
  }
  return `$${amount}`
}

/**
 * Formatea fecha en español
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formatea fecha relativa (hace 2 días, en 5 días)
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Mañana'
  if (diffDays === -1) return 'Ayer'
  if (diffDays > 0) return `En ${diffDays} días`
  return `Hace ${Math.abs(diffDays)} días`
}

// ============================================
// ORDENAMIENTO
// ============================================

/**
 * Ordena wishlists por fecha de creación
 */
export const sortByCreatedAt = (
  wishlists: Wishlist[],
  direction: 'asc' | 'desc' = 'desc'
): Wishlist[] => {
  return [...wishlists].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return direction === 'desc' ? dateB - dateA : dateA - dateB
  })
}

/**
 * Ordena wishlists por fecha del evento
 */
export const sortByEventDate = (
  wishlists: Wishlist[],
  direction: 'asc' | 'desc' = 'asc'
): Wishlist[] => {
  return [...wishlists].sort((a, b) => {
    const dateA = new Date(a.eventDate).getTime()
    const dateB = new Date(b.eventDate).getTime()
    return direction === 'asc' ? dateA - dateB : dateB - dateA
  })
}

/**
 * Ordena wishlists por progreso
 */
export const sortByProgress = (
  wishlists: Wishlist[],
  direction: 'asc' | 'desc' = 'desc'
): Wishlist[] => {
  return [...wishlists].sort((a, b) => {
    const progressA = calculateProgress(a.currentAmount, a.targetAmount)
    const progressB = calculateProgress(b.currentAmount, b.targetAmount)
    return direction === 'desc' ? progressB - progressA : progressA - progressB
  })
}

// ============================================
// TRANSFORMACIONES
// ============================================

/**
 * Convierte Wishlist a WishlistListItem (para el dashboard)
 */
export const toWishlistListItem = (wishlist: Wishlist): WishlistListItem => {
  return {
    id: wishlist.id,
    slug: wishlist.slug,
    title: wishlist.title,
    eventDate: wishlist.eventDate,
    product: {
      name: wishlist.product.name,
      image: wishlist.product.image,
    },
    currentAmount: wishlist.currentAmount,
    targetAmount: wishlist.targetAmount,
    contributors: wishlist.contributors.length,
    status: getWishlistStatus(wishlist),
    createdAt: wishlist.createdAt,
    completedAt: wishlist.status === 'completed' ? wishlist.updatedAt : undefined,
    hasVideos: wishlist.contributors.some((c) => c.videoUrl),
  }
}

// ============================================
// ESTADÍSTICAS
// ============================================

/**
 * Calcula estadísticas del dashboard
 */
export const calculateDashboardStats = (wishlists: Wishlist[]): DashboardStats => {
  const stats: DashboardStats = {
    activeWishlists: 0,
    completed: 0,
    expired: 0,
    totalRaised: 0,
    videosReceived: 0,
    totalContributors: 0,
  }

  wishlists.forEach((wishlist) => {
    const status = getWishlistStatus(wishlist)

    if (status === 'active') stats.activeWishlists++
    if (status === 'completed') stats.completed++
    if (status === 'expired') stats.expired++

    stats.totalRaised += wishlist.currentAmount

    const contributorsCount = wishlist.contributors.length
    stats.totalContributors += contributorsCount

    const videosCount = wishlist.contributors.filter((c) => c.videoUrl).length
    stats.videosReceived += videosCount
  })

  return stats
}

// ============================================
// GENERACIÓN DE DATOS
// ============================================

/**
 * Genera un ID único para wishlist
 */
export const generateWishlistId = (): string => {
  return `wl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Genera un slug único a partir del título
 */
export const generateSlug = (title: string, userId?: string): string => {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .substring(0, 50) // Limitar longitud

  // Agregar timestamp para unicidad
  const timestamp = Date.now().toString(36)
  return `${baseSlug}-${timestamp}`
}

// ============================================
// VALIDACIONES
// ============================================

/**
 * Valida si una fecha de evento es válida
 */
export const isValidEventDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return date >= today
}

/**
 * Valida si un monto es válido
 */
export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && Number.isFinite(amount)
}