import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import type { PublicWishlist, ContributeFormData } from '../types/publicWishlistTypes'
import { publicWishlistService } from '../services/publicWishlistService'

/**
 * Hook personalizado para manejar wishlist pública
 */
export const usePublicWishlist = () => {
  const { slug } = useParams<{ slug: string }>()
  
  const [wishlist, setWishlist] = useState<PublicWishlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isContributing, setIsContributing] = useState(false)

  /**
   * Cargar wishlist
   */
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
      
      // Track view (analytics)
      publicWishlistService.trackView(data.id)
    } catch (err: any) {
      setError(err.message || 'Error al cargar la wishlist')
      console.error('Error loading wishlist:', err)
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  /**
   * Contribuir a la wishlist
   */
  const contribute = async (data: ContributeFormData): Promise<boolean> => {
    if (!wishlist) return false

    setIsContributing(true)
    setError(null)

    try {
      const result = await publicWishlistService.contribute(wishlist.id, data)
      
      if (result.success) {
        // Recargar wishlist para mostrar nueva contribución
        await loadWishlist()
        return true
      }
      
      return false
    } catch (err: any) {
      setError(err.message || 'Error al realizar la contribución')
      console.error('Error contributing:', err)
      return false
    } finally {
      setIsContributing(false)
    }
  }

  /**
   * Calcular porcentaje de progreso
   */
  const getProgress = useCallback((): number => {
    if (!wishlist) return 0
    return Math.min((wishlist.currentAmount / wishlist.targetAmount) * 100, 100)
  }, [wishlist])

  /**
   * Calcular monto faltante
   */
  const getRemaining = useCallback((): number => {
    if (!wishlist) return 0
    return Math.max(wishlist.targetAmount - wishlist.currentAmount, 0)
  }, [wishlist])

  /**
   * Verificar si está expirada
   */
  const isExpired = useCallback((): boolean => {
    if (!wishlist?.expiresAt) return false
    return new Date(wishlist.expiresAt) < new Date()
  }, [wishlist])

  /**
   * Verificar si está completada
   */
  const isCompleted = useCallback((): boolean => {
    if (!wishlist) return false
    return wishlist.status === 'completed' || wishlist.currentAmount >= wishlist.targetAmount
  }, [wishlist])

  /**
   * Obtener días restantes
   */
  const getDaysRemaining = useCallback((): number => {
    if (!wishlist?.expiresAt) return 0
    
    const now = new Date()
    const expires = new Date(wishlist.expiresAt)
    const diffTime = expires.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return Math.max(diffDays, 0)
  }, [wishlist])

  /**
   * Cargar wishlist al montar
   */
  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  return {
    wishlist,
    isLoading,
    error,
    isContributing,
    
    // Actions
    contribute,
    reload: loadWishlist,
    
    // Computed values
    progress: getProgress(),
    remaining: getRemaining(),
    isExpired: isExpired(),
    isCompleted: isCompleted(),
    daysRemaining: getDaysRemaining(),
  }
}