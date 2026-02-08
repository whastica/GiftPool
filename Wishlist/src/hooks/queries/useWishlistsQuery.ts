/**
 * useWishlistsQuery
 * Query hook para obtener wishlists del usuario
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { wishlistService } from '../../services/wishlistService'
import { queryKeys } from '../../lib/react-query'
import type { Wishlist } from '../../types/wishlistTypes'

interface UseWishlistsQueryOptions {
  userId?: string
  enabled?: boolean
}

/**
 * Hook para obtener todas las wishlists de un usuario
 */
export const useWishlistsQuery = (
  options: UseWishlistsQueryOptions = {}
): UseQueryResult<Wishlist[], Error> => {
  const { userId, enabled = true } = options

  return useQuery({
    queryKey: queryKeys.wishlists.byUser(userId || 'unknown'),
    
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required')
      }
      return await wishlistService.getUserWishlists(userId)
    },
    
    // Solo ejecutar si hay userId y está habilitado
    enabled: enabled && !!userId,
    
    // Cache configuration
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    
    // Refetch configuration
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export default useWishlistsQuery