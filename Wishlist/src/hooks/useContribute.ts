/**
 * useContribute Hook (EPIC 6) - CORREGIDO
 * Hook personalizado para manejar el flujo de contribución
 * 
 * FIXES:
 * - ✅ Sintaxis corregida (backticks → paréntesis)
 * - ✅ Guarda contribuciones en localStorage
 * - ✅ Invalida queries de React Query
 * - ✅ Tipo correcto: ContributionData
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import type { ContributionData, PaymentMethod } from '../types/contributeTypes'
import { initiateContribution } from '../services/paymentService'
import { uploadVideo } from '../services/videoService'
import * as storage from '../services/wishlistStorage'
import { queryKeys } from '../lib/react-query'

interface UseContributeProps {
  wishlistId: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const useContribute = ({
  wishlistId,
  onSuccess,
  onError,
}: UseContributeProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Procesar contribución completa
   */
  const processContribution = async (
    formData: ContributionData,
    videoBlob?: Blob
  ): Promise<boolean> => {
    setIsProcessing(true)
    setError(null)

    try {
      console.log('🚀 Processing contribution...', { formData, hasVideo: !!videoBlob })

      // 1. Iniciar contribución en el backend
      const response = await initiateContribution({
        ...formData,
        wishlistId,
        videoBlob,
      })

      console.log('📦 Backend response:', response)

      if (!response.success) {
        const errorMsg = response.error || 'Error al procesar la contribución'
        setError(errorMsg)
        onError?.(errorMsg)
        setIsProcessing(false)
        return false
      }

      // ✅ FIX: Guardar contribución en localStorage
      if (response.contributionId) {
        console.log('💾 Guardando contribución en localStorage...')
        
        const contributor = {
          id: response.contributionId,
          name: formData.isAnonymous ? 'Anónimo' : formData.name,
          amount: formData.amount,
          message: formData.message,
          isAnonymous: formData.isAnonymous,
          videoUrl: undefined,
          createdAt: new Date().toISOString(),
        }

        // Guardar en wishlist
        const success = storage.addContributor(wishlistId, contributor)
        
        if (success) {
          console.log('✅ Contribución guardada exitosamente')
          
          // ✅ FIX: Invalidar queries de React Query
          console.log('🔄 Invalidando queries...')
          
          queryClient.invalidateQueries({
            queryKey: queryKeys.wishlists.all,
          })
          
          queryClient.invalidateQueries({
            queryKey: queryKeys.stats.all,
          })
          
          console.log('✅ Queries invalidadas')
        }
      }

      // 2. Si hay video, guardarlo temporalmente para subirlo después del pago
      if (videoBlob && response.contributionId) {
        console.log('🎥 Saving video reference for later upload...')
        
        // ✅ FIX: Sintaxis correcta
        localStorage.setItem(
          `pending_video_${response.contributionId}`,
          'true'
        )
        
        // NOTA: El blob no se puede guardar en localStorage directamente.
        // En producción, considerar usar IndexedDB o subirlo inmediatamente.
      }

      // 3. Marcar contribución como exitosa para reload
      localStorage.setItem('giftpool_contribution_success', 'true')

      // 4. Redirigir al checkout
      console.log('🔀 Redirecting to checkout...')
      
      if (response.paymentUrl) {
        // Si la URL es externa (empieza con http), usar window.location
        if (response.paymentUrl.startsWith('http')) {
          window.location.href = response.paymentUrl
        } else {
          // Si es una ruta interna, usar navigate de React Router
          navigate(response.paymentUrl)
        }
      } else if (response.contributionId) {
        // ✅ FIX: Sintaxis correcta (paréntesis en lugar de backticks)
        // Fallback: Volver a la wishlist con estado de recarga
        const wishlist = storage.getWishlistById(wishlistId)
        if (wishlist?.slug) {
          navigate(`/w/${wishlist.slug}`, { 
            state: { reloadData: true } 
          })
        } else {
          // Si no se encuentra el slug, usar ID
          navigate(`/contribute/checkout/${response.contributionId}`)
        }
      } else {
        throw new Error('No se recibió URL de pago ni ID de contribución')
      }

      onSuccess?.()
      return true
      
    } catch (err) {
      console.error('❌ Error processing contribution:', err)
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error inesperado al procesar la contribución'
        
      setError(errorMessage)
      onError?.(errorMessage)
      setIsProcessing(false)
      return false
    }
  }

  /**
   * Subir video después del pago
   */
  const uploadPendingVideo = async (
    contributionId: string,
    videoBlob: Blob
  ): Promise<boolean> => {
    try {
      console.log('📤 Uploading video for contribution:', contributionId)
      
      const videoUrl = await uploadVideo({
        video: videoBlob,
        contributionId,
        onProgress: (progress) => {
          // ✅ FIX: Sintaxis correcta
          console.log(`📊 Upload progress: ${progress}%`)
        },
      })
      
      if (videoUrl) {
        console.log('✅ Video uploaded successfully:', videoUrl)
        
        // ✅ FIX: Sintaxis correcta
        localStorage.removeItem(`pending_video_${contributionId}`)
        return true
      }
      
      console.warn('⚠️ Video upload returned no URL')
      return false
      
    } catch (err) {
      console.error('❌ Error uploading video:', err)
      return false
    }
  }

  /**
   * Cancelar contribución
   */
  const cancelContribution = () => {
    console.log('🚫 Contribution cancelled')
    setIsProcessing(false)
    setError(null)
  }

  return {
    isProcessing,
    error,
    processContribution,
    uploadPendingVideo,
    cancelContribution,
  }
}

export default useContribute