/**
 * PaymentMethodSelector Component (EPIC 6)
 * Selector de método de pago con manejo de error externo
 */

import { CreditCard, Shield, Smartphone } from 'lucide-react'
import type { PaymentMethod } from '../../types/contributeTypes'

interface PaymentMethodSelectorProps {
  value: PaymentMethod | undefined
  onChange: (method: PaymentMethod) => void
  availableMethods?: PaymentMethod[]
  error?: string
}

const PaymentMethodSelector = ({
  value,
  onChange,
  availableMethods = ['mercadopago', 'paypal'],
  error,
}: PaymentMethodSelectorProps) => {
  const paymentMethods = [
    {
      id: 'mercadopago' as PaymentMethod,
      name: 'MercadoPago',
      description: 'Tarjetas, PSE, Efecty y más',
      icon: CreditCard,
      gradient: 'from-blue-500 to-cyan-500',
      bgLight: 'bg-blue-50',
      borderLight: 'border-blue-200',
      textColor: 'text-blue-900',
      popular: true,
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      description: 'Pago internacional seguro',
      icon: Shield,
      gradient: 'from-indigo-500 to-purple-500',
      bgLight: 'bg-indigo-50',
      borderLight: 'border-indigo-200',
      textColor: 'text-indigo-900',
      popular: false,
    },
    {
      id: 'nequi' as PaymentMethod,
      name: 'Nequi',
      description: 'Pago desde tu celular',
      icon: Smartphone,
      gradient: 'from-pink-500 to-rose-500',
      bgLight: 'bg-pink-50',
      borderLight: 'border-pink-200',
      textColor: 'text-pink-900',
      popular: false,
      comingSoon: !availableMethods.includes('nequi'),
    },
  ].filter(method => availableMethods.includes(method.id) || method.comingSoon)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-black text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-green-600" />
          Selecciona cómo pagar
        </h3>
        <p className="text-sm text-gray-600">
          Todas las transacciones son 100% seguras 🔒
        </p>
      </div>

      {/* Methods */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => {
          const isSelected = value === method.id
          const isDisabled = method.comingSoon
          const Icon = method.icon

          return (
            <button
              key={method.id}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  onChange(method.id)
                }
              }}
              className={`
                relative border-3 rounded-2xl p-5 transition-all duration-300
                ${
                  isSelected
                    ? `bg-gradient-to-br ${method.gradient} border-transparent shadow-2xl scale-105`
                    : isDisabled
                    ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                    : `${method.bgLight} ${method.borderLight} hover:shadow-xl`
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${method.gradient}`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 text-left">
                  <h4 className={`font-black ${isSelected ? 'text-white' : method.textColor}`}>
                    {method.name}
                  </h4>
                  <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                    {method.description}
                  </p>
                </div>

                <div className={`w-5 h-5 rounded-full border-3 ${isSelected ? 'bg-white border-white' : 'border-gray-300'}`}>
                  {isSelected && <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${method.gradient}`} />}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ❌ ERROR */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 font-semibold">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export default PaymentMethodSelector
