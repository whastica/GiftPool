/**
 * useContributeMutation
 * Mutation hook para crear una contribución
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { initiateContribution } from '../../services/paymentService'
import { queryKeys, mutationKeys } from '../../lib/react-query'
import toast from '../../lib/toast'
import type { ContributionData } from '../../types/contributeTypes'

interface ContributeMutationVariables {
  formData: ContributionData
  wishlistId: string
  videoBlob?: Blob
}

interface UseContributeMutationOptions {
  onSuccess?: (contributionId?: string, paymentUrl?: string) => void
  onError?: (error: Error) => void
}

/**
 * Hook para crear una contribución
 */
export const useContributeMutation = (
  options: UseContributeMutationOptions = {}
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [mutationKeys.createContribution],
    
    mutationFn: async (variables: ContributeMutationVariables) => {
      const { formData, wishlistId, videoBlob } = variables

      const response = await initiateContribution({
        ...formData,
        wishlistId,
        videoBlob,
      })

      if (!response.success) {
        throw new Error(response.error || 'Error al procesar la contribución')
      }

      return response
    },

    onSuccess: (response, variables) => {
      // Invalidar query de la wishlist para refrescar datos
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlists.detail(variables.wishlistId),
      })
      
      // Si es wishlist pública, también invalidar por slug
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlists.all,
      })

      // Toast de éxito se mostrará después del pago
      console.log('✅ Contribution initiated successfully')

      // Callback personalizado
      options.onSuccess?.(response.contributionId, response.paymentUrl)
    },

    onError: (error: Error) => {
      console.error('❌ Error creating contribution:', error)
      
      // Toast de error
      toast.error(error.message || 'Error al procesar la contribución')

      // Callback personalizado
      options.onError?.(error)
    },
  })
}

export default useContributeMutation