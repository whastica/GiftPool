import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import type {
  PublicWishlist,
  ContributeFormData,
} from '../types/publicWishlistTypes'

import { publicWishlistService } from '../services/publicWishlistService'
import { useContribute } from '../hooks/useContribute'

// Tipos para contribuciones

/**
 * Métodos de pago disponibles
 */
export type PaymentMethod = 'mercadopago' | 'paypal' | 'nequi';

/**
 * Datos necesarios para iniciar una contribución
 */
export interface ContributionData {
  wishlistId: string;
  amount: number;
  name: string;
  email?: string;
  message?: string;
  isAnonymous: boolean;
  includeVideo?: boolean;
  paymentMethod?: PaymentMethod; // Made optional
  videoBlob?: Blob;
}

/**
 * Respuesta al iniciar una contribución
 */
export interface ContributionResponse {
  success: boolean;
  contributionId?: string;
  paymentUrl?: string;
  error?: string;
}

export const usePublicWishlist = () => {
  const { slug } = useParams<{ slug: string }>()

  const [wishlist, setWishlist] = useState<PublicWishlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* -------------------------------------------------------------------------- */
  /*                               LOAD WISHLIST                                */
  /* -------------------------------------------------------------------------- */

  const loadWishlist = useCallback(async () => {
    if (!slug) {
      setError('No se proporcionó un slug válido')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await publicWishlistService.getBySlug(slug)
      setWishlist(data)
      void publicWishlistService.trackView(data.id)
    } catch (err: unknown) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar la wishlist'
      )
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  /* -------------------------------------------------------------------------- */
  /*                          CONTRIBUTE (EPIC 6)                               */
  /* -------------------------------------------------------------------------- */

  const {
    processContribution,
    isProcessing: isContributing,
    error: contributeError,
  } = useContribute({
    wishlistId: wishlist?.id ?? '',
    onSuccess: () => {
      loadWishlist()
    },
    onError: (err) => {
      setError(err)
    },
  })

  /**
   * Wrapper público para contribuir
   */
  const contribute = async (
    data: ContributionData,
    videoBlob?: Blob
  ): Promise<boolean> => {
    if (!wishlist) {
      setError('No se encontró la wishlist')
      return false
    }

    try {
      return await processContribution(data, videoBlob)
    } catch (err: unknown) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : 'Error al realizar la contribución'
      )
      return false
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             COMPUTED HELPERS                               */
  /* -------------------------------------------------------------------------- */

  const progress = useCallback(() => {
    if (!wishlist) return 0
    return Math.min(
      (wishlist.currentAmount / wishlist.targetAmount) * 100,
      100
    )
  }, [wishlist])

  const remaining = useCallback(() => {
    if (!wishlist) return 0
    return Math.max(
      wishlist.targetAmount - wishlist.currentAmount,
      0
    )
  }, [wishlist])

  const isExpired = useCallback(() => {
    if (!wishlist?.expiresAt) return false
    return new Date(wishlist.expiresAt) < new Date()
  }, [wishlist])

  const isCompleted = useCallback(() => {
    if (!wishlist) return false
    return (
      wishlist.status === 'completed' ||
      wishlist.currentAmount >= wishlist.targetAmount
    )
  }, [wishlist])

  const daysRemaining = useCallback(() => {
    if (!wishlist?.expiresAt) return 0
    const diff =
      new Date(wishlist.expiresAt).getTime() - Date.now()

    return Math.max(
      Math.ceil(diff / (1000 * 60 * 60 * 24)),
      0
    )
  }, [wishlist])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  return {
    wishlist,
    isLoading,
    error: error || contributeError,
    isContributing,

    contribute,
    reload: loadWishlist,

    progress: progress(),
    remaining: remaining(),
    isExpired: isExpired(),
    isCompleted: isCompleted(),
    daysRemaining: daysRemaining(),
  }
}
