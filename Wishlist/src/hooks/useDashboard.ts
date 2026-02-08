/**
 * Hook personalizado para el Dashboard
 * Gestiona wishlists, filtros, estadísticas y acciones
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './useAuth'
import { wishlistService } from '../services/wishlistService'
import {
  filterWishlistsByStatus,
  searchWishlists,
  sortByCreatedAt,
  toWishlistListItem,
} from '../utils/wishlistUtils'
import type {
  Wishlist,
  WishlistFilter,
  WishlistListItem,
  DashboardStats,
} from '../types/wishlistTypes'

// ============================================
// TYPES
// ============================================

interface UseDashboardReturn {
  // Data
  wishlists: WishlistListItem[]
  stats: DashboardStats
  
  // Filters
  activeFilter: WishlistFilter
  searchTerm: string
  
  // Loading states
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  
  // Actions
  setFilter: (filter: WishlistFilter) => void
  setSearchTerm: (term: string) => void
  refreshWishlists: () => Promise<void>
  deleteWishlist: (id: string) => Promise<boolean>
  
  // Computed
  filteredCount: number
  hasWishlists: boolean
  isEmpty: boolean
}

// ============================================
// HOOK
// ============================================

export const useDashboard = (): UseDashboardReturn => {
  const { user } = useAuth()

  // State
  const [rawWishlists, setRawWishlists] = useState<Wishlist[]>([])
  const [activeFilter, setActiveFilter] = useState<WishlistFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ============================================
  // FETCH WISHLISTS
  // ============================================

  const fetchWishlists = useCallback(async () => {
    if (!user) {
      setRawWishlists([])
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      const data = await wishlistService.getUserWishlists(user.id)
      
      // Ordenar por fecha de creación (más recientes primero)
      const sorted = sortByCreatedAt(data, 'desc')
      setRawWishlists(sorted)
    } catch (err: any) {
      console.error('Error fetching wishlists:', err)
      setError('No pudimos cargar tus wishlists. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Load wishlists on mount
  useEffect(() => {
    fetchWishlists()
  }, [fetchWishlists])

  // ============================================
  // REFRESH
  // ============================================

  const refreshWishlists = useCallback(async () => {
    setIsRefreshing(true)
    await fetchWishlists()
    setIsRefreshing(false)
  }, [fetchWishlists])

  // ============================================
  // FILTERED WISHLISTS
  // ============================================

  const filteredWishlists = useMemo(() => {
    let result = rawWishlists

    // Apply status filter
    result = filterWishlistsByStatus(result, activeFilter)

    // Apply search
    if (searchTerm.trim()) {
      result = searchWishlists(result, searchTerm)
    }

    // Convert to list items
    return result.map(toWishlistListItem)
  }, [rawWishlists, activeFilter, searchTerm])

  // ============================================
  // STATISTICS
  // ============================================

  const stats = useMemo(() => {
    if (!user) {
      return {
        activeWishlists: 0,
        completed: 0,
        expired: 0,
        totalRaised: 0,
        videosReceived: 0,
        totalContributors: 0,
      }
    }

    // Calculate from raw wishlists (not filtered)
    const activeCount = rawWishlists.filter((w) => w.status === 'active').length
    const completedCount = rawWishlists.filter((w) => w.status === 'completed').length
    const expiredCount = rawWishlists.filter(
      (w) => new Date(w.eventDate) < new Date() && w.status === 'active'
    ).length

    const totalRaised = rawWishlists.reduce((sum, w) => sum + w.currentAmount, 0)
    
    const totalContributors = rawWishlists.reduce(
      (sum, w) => sum + w.contributors.length,
      0
    )
    
    const videosReceived = rawWishlists.reduce(
      (sum, w) => sum + w.contributors.filter((c) => c.videoUrl).length,
      0
    )

    return {
      activeWishlists: activeCount,
      completed: completedCount,
      expired: expiredCount,
      totalRaised,
      videosReceived,
      totalContributors,
    }
  }, [rawWishlists, user])

  // ============================================
  // ACTIONS
  // ============================================

  const handleSetFilter = useCallback((filter: WishlistFilter) => {
    setActiveFilter(filter)
    setSearchTerm('') // Clear search when changing filter
  }, [])

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleDeleteWishlist = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const success = await wishlistService.deleteWishlist(id)
        
        if (success) {
          // Remove from local state
          setRawWishlists((prev) => prev.filter((w) => w.id !== id))
          return true
        }
        
        return false
      } catch (err) {
        console.error('Error deleting wishlist:', err)
        return false
      }
    },
    []
  )

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const hasWishlists = rawWishlists.length > 0
  const isEmpty = filteredWishlists.length === 0

  return {
    // Data
    wishlists: filteredWishlists,
    stats,
    
    // Filters
    activeFilter,
    searchTerm,
    
    // Loading
    isLoading,
    isRefreshing,
    error,
    
    // Actions
    setFilter: handleSetFilter,
    setSearchTerm: handleSetSearchTerm,
    refreshWishlists,
    deleteWishlist: handleDeleteWishlist,
    
    // Computed
    filteredCount: filteredWishlists.length,
    hasWishlists,
    isEmpty,
  }
}

export default useDashboard