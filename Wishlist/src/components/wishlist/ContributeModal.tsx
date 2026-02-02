import { useState } from 'react'
import { Video, DollarSign, User, Mail, MessageSquare, Heart } from 'lucide-react'
import Modal from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import Button from '../ui/Button'
import type { ContributeFormData } from '../../types/publicWishlistTypes'

interface ContributeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContributeFormData) => Promise<boolean>
  targetAmount: number
  currentAmount: number
  isLoading?: boolean
}

const ContributeModal = ({
  isOpen,
  onClose,
  onSubmit,
  targetAmount,
  currentAmount,
  isLoading = false,
}: ContributeModalProps) => {
  const [formData, setFormData] = useState<ContributeFormData>({
    amount: 0,
    name: '',
    email: '',
    message: '',
    isAnonymous: false,
    includeVideo: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const remaining = targetAmount - currentAmount
  const minAmount = 10000 // Mínimo $10.000 COP
  const suggestedAmounts = [20000, 50000, 100000, remaining]

  /**
   * Manejar cambios en el formulario
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /**
   * Seleccionar monto sugerido
   */
  const selectAmount = (amount: number) => {
    setFormData((prev) => ({ ...prev, amount }))
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }))
    }
  }

  /**
   * Validar formulario
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || formData.amount < minAmount) {
      newErrors.amount = `El monto mínimo es $${minAmount.toLocaleString()}`
    }

    if (formData.amount > remaining) {
      newErrors.amount = `El monto no puede exceder lo que falta: $${remaining.toLocaleString()}`
    }

    if (!formData.isAnonymous && !formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    if (formData.name.trim().length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres'
    }

    if (formData.message && formData.message.length > 300) {
      newErrors.message = 'El mensaje no puede exceder 300 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Manejar envío
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const success = await onSubmit(formData)

    if (success) {
      // Resetear formulario
      setFormData({
        amount: 0,
        name: '',
        email: '',
        message: '',
        isAnonymous: false,
        includeVideo: false,
      })
      setErrors({})
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="💝 Aportar al regalo" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <DollarSign className="inline w-4 h-4 mr-1" />
            ¿Cuánto quieres aportar?
          </label>

          {/* Suggested Amounts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {suggestedAmounts.map((amount, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectAmount(amount)}
                className={`
                  border-2 rounded-lg p-3 text-center transition-all font-semibold
                  ${formData.amount === amount
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white border-primary-600'
                    : 'border-gray-200 hover:border-primary-600 text-gray-700'
                  }
                `}
              >
                <p className="text-xs mb-1">
                  {index === suggestedAmounts.length - 1 ? 'Completar' : `Opción ${index + 1}`}
                </p>
                <p className="text-lg font-bold">
                  ${(amount / 1000).toFixed(0)}k
                </p>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <Input
            type="number"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            placeholder={`Monto personalizado (mín $${minAmount.toLocaleString()})`}
            error={errors.amount}
            min={minAmount}
            step={1000}
          />
        </div>

        {/* Anonymous Toggle */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              Aportar anónimamente
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-8">
            Tu nombre no aparecerá en la lista pública
          </p>
        </div>

        {/* Name */}
        {!formData.isAnonymous && (
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            label={
              <span>
                <User className="inline w-4 h-4 mr-1" />
                Tu nombre
              </span>
            }
            placeholder="Ej: Carlos Rodríguez"
            error={errors.name}
            maxLength={100}
          />
        )}

        {/* Email (Optional) */}
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label={
            <span>
              <Mail className="inline w-4 h-4 mr-1" />
              Email (opcional)
            </span>
          }
          placeholder="tu@email.com"
          helperText="Para enviarte confirmación de tu aporte"
        />

        {/* Message */}
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          label={
            <span>
              <MessageSquare className="inline w-4 h-4 mr-1" />
              Mensaje (opcional)
            </span>
          }
          placeholder="Deja un mensaje para el destinatario..."
          rows={3}
          error={errors.message}
          maxLength={300}
        />
        <p className="text-xs text-gray-500 -mt-4">
          {formData.message?.length ?? 0}/300 caracteres
        </p>

        {/* Video Message Option */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Video className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-1">
                ¿Quieres grabar un video-mensaje?
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Máximo 15 segundos. Lo compilaremos con todos los videos
              </p>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="includeVideo"
                  checked={formData.includeVideo}
                  onChange={handleChange}
                  className="w-4 h-4 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Sí, quiero grabar video después del pago
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tu aporte:</span>
            <span className="font-semibold">
              ${(formData.amount || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Comisión plataforma (incluida):</span>
            <span className="font-semibold">
              ${Math.round((formData.amount || 0) * 0.029).toLocaleString()}
            </span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary-600">
              ${(formData.amount || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          disabled={!formData.amount || formData.amount < minAmount || isLoading}
        >
          <Heart className="w-5 h-5 mr-2" />
          {isLoading ? 'Procesando...' : 'Continuar al pago'}
        </Button>

        <p className="text-xs text-center text-gray-500">
          Al continuar, aceptas nuestros{' '}
          <a href="/terminos" className="text-primary-600 hover:underline">
            términos y condiciones
          </a>
        </p>
      </form>
    </Modal>
  )
}

export default ContributeModal