/**
 * ContributePage - Página de Checkout (EPIC 6)
 * Página intermedia para procesar el pago después de crear la contribución
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreditCard, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { getCheckoutUrl } from '../services/paymentService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const ContributePage = () => {
  const { contributionId } = useParams<{ contributionId: string }>()
  const navigate = useNavigate()
  
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!contributionId) {
      setStatus('error')
      setErrorMessage('ID de contribución inválido')
      return
    }

    processCheckout()
  }, [contributionId])

  const processCheckout = async () => {
    if (!contributionId) return

    try {
      setStatus('loading')
      
      console.log('🔄 Getting checkout URL for:', contributionId)
      
      // Obtener URL de checkout del backend
      const response = await getCheckoutUrl(contributionId)
      
      console.log('📦 Checkout response:', response)
      
      if (!response.checkoutUrl) {
        throw new Error('No se recibió URL de checkout')
      }

      setStatus('redirecting')
      
      // Pequeño delay para mostrar el mensaje de redirección
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirigir al checkout
      if (response.checkoutUrl.startsWith('http')) {
        // URL externa (MercadoPago, PayPal, etc.)
        window.location.href = response.checkoutUrl
      } else {
        // URL interna (página de éxito en DEV)
        navigate(response.checkoutUrl)
      }
      
    } catch (error) {
      console.error('❌ Error processing checkout:', error)
      
      setStatus('error')
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Error al procesar el pago. Por favor intenta nuevamente.'
      )
    }
  }

  const handleRetry = () => {
    processCheckout()
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center">
        {/* LOADING STATE */}
        {status === 'loading' && (
          <div className="py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center animate-pulse">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Preparando tu pago...
            </h2>
            
            <p className="text-gray-600 mb-6">
              Estamos procesando tu contribución
            </p>
            
            <div className="flex items-center justify-center gap-2">
              <Loader className="w-5 h-5 text-primary-600 animate-spin" />
              <span className="text-sm font-semibold text-primary-600">
                Un momento por favor...
              </span>
            </div>
          </div>
        )}

        {/* REDIRECTING STATE */}
        {status === 'redirecting' && (
          <div className="py-12 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              ¡Todo listo! 🎉
            </h2>
            
            <p className="text-gray-600 mb-6">
              Redirigiendo a la pasarela de pago segura...
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-900 rounded-full font-semibold text-sm">
              <Loader className="w-4 h-4 animate-spin" />
              Redirigiendo...
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="py-12 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Oops, algo salió mal
            </h2>
            
            <p className="text-gray-600 mb-6">
              {errorMessage || 'No pudimos procesar tu pago'}
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleRetry}
                variant="primary"
              >
                Reintentar
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="secondary"
              >
                Volver
              </Button>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            🔒 Conexión segura encriptada SSL
          </p>
        </div>
      </Card>
    </div>
  )
}

export default ContributePage