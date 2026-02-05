/**
 * ContributeModal Component - IMPROVED (EPIC 6)
 * Modal con flujo completo de contribución multi-step
 */

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Heart, X } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import AmountSelector from './AmountSelector'
import PaymentMethodSelector from './PaymentMethodSelector'
import VideoRecorder from './VideoRecorder'
import ContributeSummary from './ContributeSummary'
import type {
  ContributeFormData,
  ContributeStep,
  PaymentMethod,
} from '../../types/contributeTypes'
import { getAvailablePaymentMethods } from '../../services/paymentService'

interface ContributeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContributeFormData, videoBlob?: Blob) => Promise<boolean>
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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [formData, setFormData] = useState<ContributeFormData>({
    amount: 0,
    name: '',
    email: '',
    message: '',
    isAnonymous: false,
    includeVideo: false,
    paymentMethod: undefined,
  })
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const remaining = targetAmount - currentAmount
  const minAmount = 10000
  const availableMethods = getAvailablePaymentMethods()

  /**
   * Manejar cambios en formulario
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

    // Limpiar error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /**
   * Validar paso actual
   */
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Step 1: Monto y datos básicos
    if (step === 1) {
      if (!formData.amount || formData.amount < minAmount) {
        newErrors.amount = `El monto mínimo es $${minAmount.toLocaleString()}`
      }
      if (formData.amount > remaining) {
        newErrors.amount = `El monto no puede exceder $${remaining.toLocaleString()}`
      }
      if (!formData.isAnonymous && !formData.name.trim()) {
        newErrors.name = 'El nombre es obligatorio'
      }
      if (formData.message && formData.message.length > 300) {
        newErrors.message = 'El mensaje no puede exceder 300 caracteres'
      }
    }

    // Step 2: Método de pago
    if (step === 2) {
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = 'Selecciona un método de pago'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Avanzar al siguiente paso
   */
  const handleNext = () => {
    if (!validateStep()) return

    if (step < 4) {
      setStep((prev) => (prev + 1) as typeof step)
    }
  }

  /**
   * Retroceder al paso anterior
   */
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as typeof step)
    }
  }

  /**
   * Manejar video listo
   */
  const handleVideoReady = (blob: Blob, url: string) => {
    setVideoBlob(blob)
    setFormData((prev) => ({ ...prev, includeVideo: true }))
    handleNext()
  }

  /**
   * Omitir video
   */
  const handleSkipVideo = () => {
    setVideoBlob(null)
    setFormData((prev) => ({ ...prev, includeVideo: false }))
    handleNext()
  }

  /**
   * Enviar contribución
   */
  const handleSubmit = async () => {
    const success = await onSubmit(formData, videoBlob || undefined)
    
    if (success) {
      // Reset
      setStep(1)
      setFormData({
        amount: 0,
        name: '',
        email: '',
        message: '',
        isAnonymous: false,
        includeVideo: false,
        paymentMethod: undefined,
      })
      setVideoBlob(null)
      setErrors({})
    }
  }

  /**
   * Renderizar contenido del paso actual
   */
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Amount Selection */}
            <AmountSelector
              value={formData.amount}
              onChange={(amount) =>
                setFormData((prev) => ({ ...prev, amount }))
              }
              remaining={remaining}
              minAmount={minAmount}
              error={errors.amount}
            />

            {/* Anonymous Toggle */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                />
                <div className="ml-3">
                  <span className="text-sm font-bold text-purple-900 block">
                    🎭 Aportar anónimamente
                  </span>
                  <span className="text-xs text-purple-700">
                    Tu nombre no aparecerá en la lista pública
                  </span>
                </div>
              </label>
            </div>

            {/* Name */}
            {!formData.isAnonymous && (
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                label="Tu nombre"
                placeholder="Ej: Carlos Rodríguez"
                error={errors.name}
                maxLength={100}
              />
            )}

            {/* Email */}
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email (opcional)"
              placeholder="tu@email.com"
              helperText="Para enviarte confirmación de tu aporte"
            />

            {/* Message */}
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              label="Mensaje (opcional)"
              placeholder="Deja un mensaje especial..."
              rows={3}
              error={errors.message}
              maxLength={300}
            />
            <p className="text-xs text-gray-500 -mt-4">
              {formData.message?.length ?? 0}/300 caracteres
            </p>
          </div>
        )

      case 2:
        return (
          <PaymentMethodSelector
            value={formData.paymentMethod}
            onChange={(method: PaymentMethod) =>
              setFormData((prev) => ({ ...prev, paymentMethod: method }))
            }
            availableMethods={availableMethods}
          />
        )

      case 3:
        return (
          <VideoRecorder
            onVideoReady={handleVideoReady}
            onSkip={handleSkipVideo}
          />
        )

      case 4:
        return (
          <ContributeSummary
            formData={formData}
            hasVideo={!!videoBlob}
          />
        )

      default:
        return null
    }
  }

  /**
   * Obtener título del paso
   */
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return '💝 Detalles de tu aporte'
      case 2:
        return '💳 Método de pago'
      case 3:
        return '🎥 Video-mensaje (opcional)'
      case 4:
        return '✅ Confirmar aporte'
      default:
        return ''
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getStepTitle()}
      size="lg"
      showCloseButton={false}
    >
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`
                flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm
                transition-all duration-300
                ${
                  step >= stepNum
                    ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white scale-110'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {stepNum}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="secondary"
          className="flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Back Button */}
        {step > 1 && step < 4 && (
          <Button onClick={handleBack} variant="secondary" className="flex-1">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Atrás
          </Button>
        )}

        {/* Next/Submit Button */}
        {step < 3 && (
          <Button onClick={handleNext} className="flex-1">
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}

        {step === 4 && (
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            className="flex-1"
            size="lg"
          >
            <Heart className="w-5 h-5 mr-2" />
            {isLoading ? 'Procesando...' : 'Ir al pago'}
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default ContributeModal