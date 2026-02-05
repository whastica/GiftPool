/**
 * ContributeSuccessPage - Página de Confirmación (EPIC 6)
 * Página mostrada después de completar exitosamente una contribución
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Heart, ArrowLeft, Home, Loader2, Gift, Sparkles } from 'lucide-react'
import { confirmPayment, type ConfirmPaymentResponse } from '../services/paymentService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const ContributeSuccessPage = () => {
  const { contributionId } = useParams<{ contributionId: string }>()
  const navigate = useNavigate()
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentData, setPaymentData] = useState<ConfirmPaymentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!contributionId) {
      setError('ID de contribución inválido')
      setIsVerifying(false)
      return
    }

    verifyPayment()
  }, [contributionId])

  const verifyPayment = async () => {
    if (!contributionId) return

    try {
      setIsVerifying(true)
      
      console.log('✅ Verifying payment for:', contributionId)
      
      // Verificar el pago con el backend
      const data = await confirmPayment(contributionId)
      
      if (!data) {
        throw new Error('No se pudo confirmar el pago')
      }

      console.log('💰 Payment confirmed:', data)
      
      setPaymentData(data)
      setIsVerifying(false)

      // ✅ EPIC 6: Limpiar referencia de video pendiente
      const pendingVideoKey = `pending_video_${contributionId}`
      if (localStorage.getItem(pendingVideoKey)) {
        localStorage.removeItem(pendingVideoKey)
        console.log('🗑️ Pending video reference cleared')
      }

      // ✅ EPIC 6: Marcar que hay una contribución nueva para recargar la wishlist
      localStorage.setItem('giftpool_contribution_success', 'true')
      console.log('✅ Contribution success flag set')

      // Trigger confetti animation
      triggerConfetti()
      
    } catch (err) {
      console.error('❌ Error verifying payment:', err)
      
      setError(err instanceof Error ? err.message : 'Error al confirmar el pago')
      setIsVerifying(false)
    }
  }

  const triggerConfetti = () => {
    console.log('🎉 CONFETTI!')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  // ✅ EPIC 6: Volver a la wishlist y recargar datos
  const handleBackToWishlist = () => {
    const lastWishlistSlug = localStorage.getItem('last_wishlist_slug')
    
    if (lastWishlistSlug) {
      console.log('🔙 Returning to wishlist:', lastWishlistSlug)
      navigate(`/w/${lastWishlistSlug}`, { 
        state: { reloadData: true }
      })
    } else {
      console.warn('⚠️ No wishlist slug found, going home')
      navigate('/')
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center py-12">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary-600 animate-spin" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Verificando tu pago...
          </h2>
          <p className="text-gray-600">
            Un momento por favor
          </p>
        </Card>
      </div>
    )
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">😕</span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No pudimos confirmar tu pago
          </h2>
          
          <p className="text-gray-600 mb-6">
            {error || 'Por favor contacta a soporte si ya realizaste el pago'}
          </p>
          
          <Button onClick={handleGoHome}>
            Volver al inicio
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <Card className="text-center py-12 mb-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-secondary-600" />
          
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20 animate-float" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-200 rounded-full opacity-20 animate-float animation-delay-200" />

          {/* Success Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-200 animate-scale-in">
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
          </div>

          {/* Main Message */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-black text-gray-900 mb-3 flex items-center justify-center gap-3">
              <span>¡Pago exitoso!</span>
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </h1>
            
            <p className="text-xl text-gray-600 font-semibold mb-2">
              Tu aporte ha sido registrado
            </p>
            
            <p className="text-gray-500">
              Gracias por contribuir a hacer realidad este regalo especial 💝
            </p>
          </div>

          {/* Payment Details */}
          <div className="max-w-md mx-auto mb-8 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6 animate-fade-in-up animation-delay-200">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">Monto</p>
                <p className="text-2xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  ${paymentData.amount.toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">Método</p>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {paymentData.paymentMethod}
                </p>
              </div>
              
              <div className="col-span-2 pt-4 border-t-2 border-gray-300">
                <p className="text-xs font-bold text-gray-500 mb-1">ID de transacción</p>
                <p className="text-xs font-mono text-gray-700 bg-gray-200 px-3 py-2 rounded">
                  {paymentData.transactionId}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up animation-delay-400">
            <Button
              onClick={handleBackToWishlist}
              variant="primary"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Ver mi contribución
            </Button>
            
            <Button
              onClick={handleGoHome}
              variant="secondary"
              size="lg"
              className="gap-2"
            >
              <Home className="w-5 h-5" />
              Ir al inicio
            </Button>
          </div>
        </Card>

        {/* Next Steps Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 animate-fade-in-up animation-delay-600">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-2 text-lg">
                ¿Qué sigue?
              </h3>
              
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" />
                  <span>Tu aporte ya aparece en la lista de contribuciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" />
                  <span>Puedes compartir esta lista para que más personas contribuyan</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ContributeSuccessPage