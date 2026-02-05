// src/pages/ContributeSuccessPage.tsx

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Card from '../components/ui/Card'
import { confirmPayment } from '../services/paymentService'

type PaymentState = 'loading' | 'success' | 'error'

const ContributeSuccessPage = () => {
  const { contributionId } = useParams<{ contributionId: string }>()
  const [state, setState] = useState<PaymentState>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!contributionId) {
      setState('error')
      setError('ID de contribución inválido')
      return
    }

    const confirm = async () => {
      try {
        const result = await confirmPayment(contributionId)

        if (!result) {
          throw new Error('No se pudo confirmar el pago')
        }

        // 🔑 Limpieza de intención de video (si existe)
        const pendingVideoKey = `pending_video_${contributionId}`
        if (localStorage.getItem(pendingVideoKey)) {
          localStorage.removeItem(pendingVideoKey)
        }

        setState('success')
      } catch (err: any) {
        console.error('Payment confirmation error:', err)
        setError(err.message || 'Error confirmando el pago')
        setState('error')
      }
    }

    confirm()
  }, [contributionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <Card className="max-w-md w-full text-center p-8">
        {state === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary-600" />
            <p className="mt-4 text-gray-600">
              Confirmando tu pago…
            </p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              ¡Pago confirmado!
            </h2>
            <p className="mt-2 text-gray-600">
              Tu contribución se registró correctamente.
            </p>

            <Link
              to="/"
              className="inline-block mt-6 text-primary-600 hover:underline"
            >
              Volver al inicio
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="w-12 h-12 mx-auto text-red-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Error al confirmar el pago
            </h2>
            <p className="mt-2 text-gray-600">
              {error}
            </p>

            <Link
              to="/"
              className="inline-block mt-6 text-primary-600 hover:underline"
            >
              Volver al inicio
            </Link>
          </>
        )}
      </Card>
    </div>
  )
}

export default ContributeSuccessPage
