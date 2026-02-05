/**
 * ContributeSummary Component (EPIC 6)
 * Resumen visual de la contribución antes del pago
 */

import { DollarSign, User, Mail, MessageSquare, Video, CreditCard, Shield } from 'lucide-react'
import type { ContributeFormData, PaymentMethod } from '../../types/contributeTypes'

interface ContributeSummaryProps {
  formData: ContributeFormData
  hasVideo?: boolean
}

const ContributeSummary = ({ formData, hasVideo = false }: ContributeSummaryProps) => {
  const platformFee = Math.round(formData.amount * 0.029) // 2.9% + IVA
  const total = formData.amount

  // Mapeo de nombres de métodos de pago
  const paymentMethodNames: Record<PaymentMethod, string> = {
    mercadopago: 'MercadoPago',
    paypal: 'PayPal',
    nequi: 'Nequi',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-green-200">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">
          Resumen de tu aporte
        </h3>
        <p className="text-gray-600">
          Verifica que todo esté correcto antes de continuar
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-3 border-gray-200 rounded-2xl p-6 space-y-4">
        {/* Amount */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-600">Tu aporte</p>
              <p className="text-2xl font-black text-gray-900">
                ${formData.amount.toLocaleString()} COP
              </p>
            </div>
          </div>
        </div>

        {/* Contributor Info */}
        {!formData.isAnonymous && formData.name && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">Nombre</p>
              <p className="font-bold text-gray-900">{formData.name}</p>
            </div>
          </div>
        )}

        {formData.isAnonymous && (
          <div className="flex items-center gap-3 bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-purple-900">Aporte anónimo</p>
              <p className="text-xs text-purple-700">Tu nombre no aparecerá públicamente</p>
            </div>
          </div>
        )}

        {/* Email */}
        {formData.email && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">Email</p>
              <p className="font-semibold text-gray-900 text-sm">{formData.email}</p>
            </div>
          </div>
        )}

        {/* Message */}
        {formData.message && (
          <div className="flex items-start gap-3 bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-blue-600 mb-1">Tu mensaje</p>
              <p className="text-sm text-blue-900 italic leading-relaxed">
                "{formData.message}"
              </p>
            </div>
          </div>
        )}

        {/* Video Indicator */}
        {hasVideo && (
          <div className="flex items-center gap-3 bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-purple-900">Video-mensaje incluido</p>
              <p className="text-xs text-purple-700">Se subirá después del pago</p>
            </div>
          </div>
        )}

        {/* Payment Method */}
        {formData.paymentMethod && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">Método de pago</p>
              <p className="font-bold text-gray-900">
                {paymentMethodNames[formData.paymentMethod]}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div className="bg-white border-3 border-gray-200 rounded-2xl p-6 space-y-3">
        <h4 className="font-black text-gray-900 mb-4">Desglose</h4>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tu aporte:</span>
          <span className="font-bold text-gray-900">
            ${formData.amount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Comisión plataforma (incluida):
            <span className="text-xs ml-1">🛈</span>
          </span>
          <span className="font-semibold text-gray-700">
            ${platformFee.toLocaleString()}
          </span>
        </div>

        <div className="border-t-2 border-gray-200 pt-3 flex justify-between">
          <span className="text-lg font-black text-gray-900">TOTAL:</span>
          <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h5 className="font-bold text-green-900 text-sm mb-1">
              🔒 Transacción segura
            </h5>
            <p className="text-xs text-green-800 leading-relaxed">
              Tu información está protegida con encriptación SSL de 256 bits.
              No almacenamos tus datos de pago.
            </p>
          </div>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-center text-gray-500">
        Al continuar, aceptas nuestros{' '}
        <a href="/terminos" className="text-primary-600 hover:underline font-semibold">
          términos de servicio
        </a>{' '}
        y{' '}
        <a href="/privacidad" className="text-primary-600 hover:underline font-semibold">
          política de privacidad
        </a>
      </p>
    </div>
  )
}

export default ContributeSummary