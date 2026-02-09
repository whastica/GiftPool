/**
 * Hook personalizado para el Dashboard
 * ACTUALIZADO: Ahora usa React Query para gestión de estado
 */

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useWishlistsQuery } from './queries/useWishlistsQuery'
import { useWishlistStatsQuery } from './queries/useWishlistStatsQuery'
import { useDeleteWishlist } from './mutations/useDeleteWishlist'
import {
  filterWishlistsByStatus,
  searchWishlists,
  toWishlistListItem,
} from '../utils/wishlistUtils'
import type {
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

  // Local state para filtros
  const [activeFilter, setActiveFilter] = useState<WishlistFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // ============================================
  // REACT QUERY - WISHLISTS
  // ============================================

  const {
    data: rawWishlists = [],
    isLoading,
    error: queryError,
    refetch,
    isFetching,
  } = useWishlistsQuery({
    userId: user?.id,
    enabled: !!user,
  })

  // ============================================
  // REACT QUERY - STATS
  // ============================================

  const {
    data: stats,
  } = useWishlistStatsQuery({
    userId: user?.id,
    enabled: !!user,
  })

  // ============================================
  // REACT QUERY - DELETE MUTATION
  // ============================================

  const deleteMutation = useDeleteWishlist()

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
  // ACTIONS
  // ============================================

  const handleSetFilter = useCallback((filter: WishlistFilter) => {
    setActiveFilter(filter)
    setSearchTerm('') // Clear search when changing filter
  }, [])

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const refreshWishlists = useCallback(async () => {
    await refetch()
  }, [refetch])

  const handleDeleteWishlist = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) return false

      try {
        await deleteMutation.mutateAsync({
          wishlistId: id,
          userId: user.id,
        })
        return true
      } catch (err) {
        console.error('Error deleting wishlist:', err)
        return false
      }
    },
    [user, deleteMutation]
  )

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const hasWishlists = rawWishlists.length > 0
  const isEmpty = filteredWishlists.length === 0
  const error = queryError?.message || null

  // Default stats si no hay datos
  const defaultStats: DashboardStats = {
    activeWishlists: 0,
    completed: 0,
    expired: 0,
    totalRaised: 0,
    videosReceived: 0,
    totalContributors: 0,
  }

  return {
    // Data
    wishlists: filteredWishlists,
    stats: stats || defaultStats,
    
    // Filters
    activeFilter,
    searchTerm,
    
    // Loading
    isLoading,
    isRefreshing: isFetching && !isLoading, // isFetching pero no initial load
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