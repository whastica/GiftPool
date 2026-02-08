/**
 * usePublicWishlistQuery
 * Query hook para obtener wishlist pública por slug
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { publicWishlistService } from '../../services/publicWishlistService'
import { queryKeys } from '../../lib/react-query'
import type { PublicWishlist } from '../../types/publicWishlistTypes'

interface UsePublicWishlistQueryOptions {
  slug?: string
  enabled?: boolean
}

/**
 * Hook para obtener una wishlist pública por slug
 */
export const usePublicWishlistQuery = (
  options: UsePublicWishlistQueryOptions = {}
): UseQueryResult<PublicWishlist, Error> => {
  const { slug, enabled = true } = options

  return useQuery({
    queryKey: queryKeys.wishlists.bySlug(slug || 'unknown'),
    
    queryFn: async () => {
      if (!slug) {
        throw new Error('Slug is required')
      }
      
      const wishlist = await publicWishlistService.getBySlug(slug)
      
      // Track view (fire and forget)
      if (wishlist?.id) {
        publicWishlistService.trackView(wishlist.id)
      }
      
      return wishlist
    },
    
    // Solo ejecutar si hay slug y está habilitado
    enabled: enabled && !!slug,
    
    // Cache configuration
    staleTime: 2 * 60 * 1000, // 2 minutos (más corto porque puede cambiar rápido)
    gcTime: 5 * 60 * 1000, // 5 minutos
    
    // Refetch configuration
    refetchOnWindowFocus: true, // Refetch al volver a la ventana
    refetchOnReconnect: true,
    
    // Retry configuration
    retry: (failureCount, error: any) => {
      // No reintentar si es 404 (wishlist no encontrada)
      if (error?.response?.status === 404) {
        return false
      }
      return failureCount < 3
    },
  })
}

export default usePublicWishlistQuery