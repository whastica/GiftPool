/**
 * useContribute Hook (EPIC 6) - CORREGIDO
 * Hook personalizado para manejar el flujo de contribución
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ContributeFormData, PaymentMethod } from '../types/contributeTypes'
import { initiateContribution } from '../services/paymentService'
import { uploadVideo } from '../services/videoService'

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
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Procesar contribución completa
   */
  const processContribution = async (
    formData: ContributeFormData,
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

      // 2. Si hay video, guardarlo temporalmente para subirlo después del pago
      if (videoBlob && response.contributionId) {
        console.log('🎥 Saving video reference for later upload...')
        
        // Guardar referencia en localStorage
        localStorage.setItem(
          `pending_video_${response.contributionId}`,
          'true'
        )
        
        // NOTA: El blob no se puede guardar en localStorage directamente.
        // En producción, considerar usar IndexedDB o subirlo inmediatamente.
      }

      // 3. Redirigir al checkout
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
        // Fallback: redirigir a página de checkout local
        // ✅ CORREGIDO: Paréntesis en lugar de backticks
        navigate(`/contribute/checkout/${response.contributionId}`)
      } else {
        throw new Error('No se recibió URL de pago ni ID de contribución')
      }

      onSuccess?.()
      return true
      
    } catch (err) {
      console.error('❌ Error processing contribution:', err)
      
      const errorMessage = err instanceof Error ? err.message : 'Error inesperado al procesar la contribución'
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
      
      // ✅ CORREGIDO: uploadVideo espera un objeto con parámetros nombrados
      const videoUrl = await uploadVideo({
        video: videoBlob,
        contributionId,
        onProgress: (progress) => {
          console.log(`📊 Upload progress: ${progress}%`)
        },
      })
      
      if (videoUrl) {
        console.log('✅ Video uploaded successfully:', videoUrl)
        
        // Limpiar referencia
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