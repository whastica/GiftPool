/**
 * useCreateWishlist
 * Mutation hook para crear una nueva wishlist
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistService } from '../../services/wishlistService'
import { queryKeys, mutationKeys } from '../../lib/react-query'
import toast from '../../lib/toast'
import type { WishlistFormData, Wishlist, Product } from '../../types/wishlistTypes'

interface CreateWishlistVariables {
  formData: WishlistFormData
  userId: string
  productData: Product
}

interface UseCreateWishlistOptions {
  onSuccess?: (wishlist: Wishlist) => void
  onError?: (error: Error) => void
}

/**
 * Hook para crear una wishlist
 */
export const useCreateWishlist = (options: UseCreateWishlistOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [mutationKeys.createWishlist],
    
    mutationFn: async (variables: CreateWishlistVariables) => {
      const { formData, userId, productData } = variables
      
      const response = await wishlistService.createWishlist(
        formData,
        userId,
        productData
      )

      if (!response.success || !response.wishlist) {
        throw new Error(response.error || 'Error al crear la wishlist')
      }

      return response.wishlist
    },

    onSuccess: (wishlist, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlists.byUser(variables.userId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.stats.dashboard(variables.userId),
      })

      // Toast de éxito
      toast.crud.created('Wishlist')

      // Callback personalizado
      options.onSuccess?.(wishlist)
    },

    onError: (error: Error) => {
      console.error('Error creating wishlist:', error)
      
      // Toast de error
      toast.error(error.message || 'Error al crear la wishlist')

      // Callback personalizado
      options.onError?.(error)
    },
  })
}

export default useCreateWishlist