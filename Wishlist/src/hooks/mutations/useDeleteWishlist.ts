/**
 * useDeleteWishlist
 * Mutation hook para eliminar una wishlist
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistService } from '../../services/wishlistService'
import { queryKeys, mutationKeys } from '../../lib/react-query'
import toast from '../../lib/toast'

interface DeleteWishlistVariables {
  wishlistId: string
  userId: string
}

interface UseDeleteWishlistOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Hook para eliminar una wishlist
 */
export const useDeleteWishlist = (options: UseDeleteWishlistOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [mutationKeys.deleteWishlist],
    
    mutationFn: async (variables: DeleteWishlistVariables) => {
      const success = await wishlistService.deleteWishlist(variables.wishlistId)
      
      if (!success) {
        throw new Error('No se pudo eliminar la wishlist')
      }
      
      return success
    },

    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlists.byUser(variables.userId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.dashboard(variables.userId),
      })

      // Toast de éxito
      toast.crud.deleted('Wishlist')

      // Callback personalizado
      options.onSuccess?.()
    },

    onError: (error: Error) => {
      console.error('Error deleting wishlist:', error)
      
      // Toast de error
      toast.error('No se pudo eliminar la wishlist')

      // Callback personalizado
      options.onError?.(error)
    },
  })
}

export default useDeleteWishlist