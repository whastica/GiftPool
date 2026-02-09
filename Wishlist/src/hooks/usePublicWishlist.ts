/**
 * usePublicWishlist Hook
 * ACTUALIZADO: Ahora usa React Query para gestión de estado
 */

import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { usePublicWishlistQuery } from './queries/usePublicWishlistQuery'
import { useContribute } from './useContribute'
import type { ContributeFormData } from '../types/publicWishlistTypes'

export const usePublicWishlist = () => {
  const { slug } = useParams<{ slug: string }>()

  // ============================================
  // REACT QUERY - WISHLIST
  // ============================================

  const {
    data: wishlist,
    isLoading,
    error: queryError,
    refetch,
  } = usePublicWishlistQuery({
    slug,
    enabled: !!slug,
  })

  // ============================================
  // CONTRIBUTE HOOK
  // ============================================

  const {
    processContribution,
    isProcessing: isContributing,
    error: contributeError,
  } = useContribute({
    wishlistId: wishlist?.id || '',
    onSuccess: () => {
      console.log('✅ Contribution flow started successfully!')
      // Recargar wishlist después de la contribución
      refetch()
    },
    onError: (error) => {
      console.error('❌ Contribution error:', error)
    },
  })

  // ============================================
  // CONTRIBUTE WRAPPER
  // ============================================

  /**
   * Wrapper para mantener compatibilidad con código existente
   */
  const contribute = useCallback(
    async (data: ContributeFormData, videoBlob?: Blob): Promise<boolean> => {
      if (!wishlist) {
        console.error('No wishlist found')
        return false
      }

      try {
        const success = await processContribution(data, videoBlob)
        
        if (success) {
          console.log('🎉 Contribution successful, redirecting...')
        }
        
        return success
      } catch (err: any) {
        console.error('❌ Error in contribute wrapper:', err)
        return false
      }
    },
    [wishlist, processContribution]
  )

  // ============================================
  // COMPUTED HELPERS
  // ============================================

  const progress = useMemo(() => {
    if (!wishlist) return 0
    return Math.min(
      (wishlist.currentAmount / wishlist.targetAmount) * 100,
      100
    )
  }, [wishlist])

  const remaining = useMemo(() => {
    if (!wishlist) return 0
    return Math.max(wishlist.targetAmount - wishlist.currentAmount, 0)
  }, [wishlist])

  const isExpired = useMemo(() => {
    if (!wishlist?.expiresAt) return false
    return new Date(wishlist.expiresAt) < new Date()
  }, [wishlist])

  const isCompleted = useMemo(() => {
    if (!wishlist) return false
    return (
      wishlist.status === 'completed' ||
      wishlist.currentAmount >= wishlist.targetAmount
    )
  }, [wishlist])

  const daysRemaining = useMemo(() => {
    if (!wishlist?.expiresAt) return 0
    const diff = new Date(wishlist.expiresAt).getTime() - Date.now()
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
  }, [wishlist])

  // ============================================
  // ERROR HANDLING
  // ============================================

  const error = queryError?.message || contributeError || null

  // ============================================
  // RETURN
  // ============================================

  return {
    wishlist: wishlist || null,
    isLoading,
    error,
    isContributing,
    contribute,
    reload: refetch,
    progress,
    remaining,
    isExpired,
    isCompleted,
    daysRemaining,
  }
}

export default usePublicWishlist