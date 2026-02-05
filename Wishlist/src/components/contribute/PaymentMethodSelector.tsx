/**
 * PaymentMethodSelector Component (EPIC 6)
 * Selector de método de pago con diseño distintivo para cada opción
 */

import { CreditCard, Shield, Smartphone } from 'lucide-react'
import type { PaymentMethod } from '../../types/contributeTypes'

interface PaymentMethodSelectorProps {
  value: PaymentMethod | undefined
  onChange: (method: PaymentMethod) => void
  availableMethods?: PaymentMethod[]
}

const PaymentMethodSelector = ({
  value,
  onChange,
  availableMethods = ['mercadopago', 'paypal'],
}: PaymentMethodSelectorProps) => {
  // Configuración visual de cada método
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

      {/* Payment Methods Grid */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => {
          const isSelected = value === method.id
          const Icon = method.icon
          const isDisabled = method.comingSoon

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => !isDisabled && onChange(method.id)}
              disabled={isDisabled}
              className={`
                relative group
                border-3 rounded-2xl p-5
                transition-all duration-300
                ${
                  isSelected
                    ? `bg-gradient-to-br ${method.gradient} border-transparent shadow-2xl shadow-${method.gradient.split('-')[1]}-300 scale-105`
                    : isDisabled
                    ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                    : `${method.bgLight} ${method.borderLight} hover:shadow-xl hover:scale-102 active:scale-98`
                }
              `}
            >
              {/* Popular Badge */}
              {method.popular && !isDisabled && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
                  ⚡ MÁS USADO
                </div>
              )}

              {/* Coming Soon Badge */}
              {isDisabled && (
                <div className="absolute -top-3 -right-3 bg-gray-400 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  PRÓXIMAMENTE
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                  ${isSelected
                    ? 'bg-white/20'
                    : isDisabled
                    ? 'bg-gray-200'
                    : `bg-gradient-to-br ${method.gradient}`
                  }
                `}>
                  <Icon className={`w-8 h-8 ${isSelected || isDisabled ? 'text-white' : 'text-white'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <h4 className={`
                    text-lg font-black mb-1
                    ${isSelected ? 'text-white' : isDisabled ? 'text-gray-500' : method.textColor}
                  `}>
                    {method.name}
                  </h4>
                  <p className={`
                    text-sm font-semibold
                    ${isSelected ? 'text-white/90' : isDisabled ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    {method.description}
                  </p>
                </div>

                {/* Radio Indicator */}
                <div className={`
                  w-6 h-6 rounded-full border-3 flex items-center justify-center flex-shrink-0
                  transition-all
                  ${isSelected
                    ? 'border-white bg-white'
                    : isDisabled
                    ? 'border-gray-300'
                    : 'border-gray-300 group-hover:border-gray-400'
                  }
                `}>
                  {isSelected && (
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${method.gradient}`} />
                  )}
                </div>
              </div>

              {/* Selected Indicator Border */}
              {isSelected && (
                <div className="absolute inset-0 border-4 border-white/30 rounded-2xl pointer-events-none" />
              )}
            </button>
          )
        })}
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-green-900 mb-1 text-sm">
              Pago 100% seguro
            </h5>
            <p className="text-xs text-green-800 leading-relaxed">
              Usamos encriptación de nivel bancario. Tus datos financieros nunca son almacenados en nuestros servidores.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodSelector