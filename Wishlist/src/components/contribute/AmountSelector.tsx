/**
 * AmountSelector Component (EPIC 6)
 * Selector de monto con diseño distintivo y experiencia táctil
 */

import { useState } from 'react'
import { DollarSign, TrendingUp, Heart, Sparkles } from 'lucide-react'
import type { SuggestedAmount } from '../../types/contributeTypes'

interface AmountSelectorProps {
  value: number
  onChange: (amount: number) => void
  remaining: number
  minAmount?: number
  error?: string
}

const AmountSelector = ({
  value,
  onChange,
  remaining,
  minAmount = 10000,
  error,
}: AmountSelectorProps) => {
  const [customMode, setCustomMode] = useState(false)

  // Calcular montos sugeridos dinámicamente
  const suggestedAmounts: SuggestedAmount[] = [
    { value: 20000, label: '20k', popular: false },
    { value: 50000, label: '50k', popular: true },
    { value: 100000, label: '100k', popular: false },
    { value: Math.min(remaining, 200000), label: remaining <= 200000 ? 'Completar' : '200k', popular: false },
  ]

  const handleSuggestedClick = (amount: number) => {
    onChange(amount)
    setCustomMode(false)
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value) || 0
    onChange(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-bold text-amber-900">
            Mínimo ${(minAmount / 1000).toFixed(0)}k COP
          </span>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">
          ¿Cuánto quieres aportar?
        </h3>
        <p className="text-gray-600">
          Cada aporte suma para hacer realidad este regalo 💝
        </p>
      </div>

      {/* Suggested Amounts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {suggestedAmounts.map((suggestion, index) => {
          const isSelected = value === suggestion.value && !customMode
          const isComplete = index === suggestedAmounts.length - 1 && suggestion.label === 'Completar'
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestedClick(suggestion.value)}
              className={`
                relative group
                border-2 rounded-2xl p-4 
                transition-all duration-300 ease-out
                transform hover:scale-105 active:scale-95
                ${
                  isSelected
                    ? 'gradient-bg border-primary-700 shadow-xl'
                    : isComplete
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-700 hover:shadow-lg'
                    : 'bg-white border-gray-200 hover:border-primary-400 hover:shadow-lg'
                }
              `}
            >
              {/* Popular Badge */}
              {suggestion.popular && (
                <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-xs font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </div>
              )}

              {/* Icon */}
              <div className={`
                w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center
                ${isSelected ? 'bg-white/20' : isComplete ? 'bg-white/20' : 'bg-gradient-to-br from-primary-100 to-secondary-100'}
              `}>
                {isComplete ? (
                  <Heart className={`w-5 h-5 ${isSelected || isComplete ? 'text-white' : 'text-primary-600'}`} fill="currentColor" />
                ) : (
                  <DollarSign className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary-600'}`} />
                )}
              </div>

              {/* Label */}
              <p className={`
                text-xs font-bold mb-1 uppercase tracking-wider
                ${isSelected || isComplete ? 'text-white/80' : 'text-gray-500'}
              `}>
                {isComplete ? '¡Completar!' : `Opción ${index + 1}`}
              </p>

              {/* Amount */}
              <p className={`
                text-2xl font-black
                ${isSelected || isComplete ? 'text-white' : 'text-gray-900'}
              `}>
                ${suggestion.label}
              </p>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute inset-0 border-4 border-white rounded-2xl pointer-events-none" />
              )}
            </button>
          )
        })}
      </div>

      {/* Custom Amount */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setCustomMode(true)}
          className={`
            w-full text-center py-3 rounded-xl font-bold transition-all
            ${customMode
              ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          ✨ O ingresa un monto personalizado
        </button>

        {customMode && (
          <div className="mt-4 animate-fade-in-down">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 text-xl font-bold">$</span>
              </div>
              <input
                type="number"
                value={value || ''}
                onChange={handleCustomChange}
                onFocus={() => setCustomMode(true)}
                placeholder="50000"
                min={minAmount}
                step={1000}
                className={`
                  w-full pl-12 pr-4 py-4 text-center
                  text-3xl font-black
                  border-3 rounded-2xl
                  focus:outline-none focus:ring-4
                  transition-all
                  ${error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200'
                  }
                `}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm font-bold">COP</span>
              </div>
            </div>
            
            {/* Quick add buttons */}
            <div className="flex gap-2 mt-3 justify-center">
              {[10000, 25000, 50000].map((add) => (
                <button
                  key={add}
                  type="button"
                  onClick={() => onChange(value + add)}
                  className="px-3 py-1 text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-full transition-colors"
                >
                  +${(add / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <p className="text-red-900 font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Info Footer */}
      <div className="text-center text-sm text-gray-500">
        💡 Puedes aportar hasta <span className="font-bold text-gray-700">${remaining.toLocaleString()}</span> para completar
      </div>
    </div>
  )
}

export default AmountSelector