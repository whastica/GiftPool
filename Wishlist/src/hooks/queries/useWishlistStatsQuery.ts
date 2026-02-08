/**
 * useWishlistStatsQuery
 * Query hook para obtener estadísticas del dashboard
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { wishlistService } from '../../services/wishlistService'
import { queryKeys } from '../../lib/react-query'
import type { DashboardStats } from '../../types/wishlistTypes'

interface UseWishlistStatsQueryOptions {
  userId?: string
  enabled?: boolean
}

/**
 * Hook para obtener estadísticas del usuario
 */
export const useWishlistStatsQuery = (
  options: UseWishlistStatsQueryOptions = {}
): UseQueryResult<DashboardStats, Error> => {
  const { userId, enabled = true } = options

  return useQuery({
    queryKey: queryKeys.stats.dashboard(userId || 'unknown'),
    
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required')
      }
      return await wishlistService.getDashboardStats(userId)
    },
    
    // Solo ejecutar si hay userId y está habilitado
    enabled: enabled && !!userId,
    
    // Cache configuration - stats pueden ser un poco más stale
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

export default useWishlistStatsQuery