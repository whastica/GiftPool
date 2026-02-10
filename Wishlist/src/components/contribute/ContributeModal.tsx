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
import type { ContributionData, PaymentMethod } from '../../types/contributeTypes'
import { getAvailablePaymentMethods } from '../../services/paymentService'

interface ContributeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContributionData, videoBlob?: Blob) => Promise<boolean>
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
  const [formData, setFormData] = useState<ContributionData>({
    wishlistId: '',
    amount: 0,
    name: '',
    email: '',
    message: '',
    isAnonymous: false,
    includeVideo: false,
    paymentMethod: undefined as PaymentMethod | undefined,
  })
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const remaining = targetAmount - currentAmount
  const minAmount = 10000
  const availableMethods = getAvailablePaymentMethods()

  /**
   * Manejar cambios genéricos
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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  /**
   * Validar paso actual
   */
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

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

    if (step === 2 && !formData.paymentMethod) {
      newErrors.paymentMethod = 'Selecciona un método de pago'
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
   * Video listo
   */
  const handleVideoReady = (blob: Blob) => {
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
      setStep(1)
      setFormData({
        wishlistId: '',
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
   * Renderizar contenido del paso
   */
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <AmountSelector
              value={formData.amount}
              onChange={(amount) =>
                setFormData((prev) => ({ ...prev, amount }))
              }
              remaining={remaining}
              minAmount={minAmount}
              error={errors.amount}
            />

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

            {!formData.isAnonymous && (
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                label="Tu nombre"
                error={errors.name}
              />
            )}

            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email (opcional)"
            />

            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              label="Mensaje (opcional)"
              error={errors.message}
              maxLength={300}
            />
          </div>
        )

      case 2:
        return (
          <PaymentMethodSelector
            value={formData.paymentMethod}
            availableMethods={availableMethods}
            error={errors.paymentMethod}  
            onChange={(method: PaymentMethod) => {
              setFormData((prev) => ({ ...prev, paymentMethod: method }))
              setErrors((prev) => ({ ...prev, paymentMethod: '' })) // ✅ limpia error
            }}
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contribuir"
      size="lg"
      showCloseButton={false}
    >
      <div className="mb-8 min-h-[400px]">
        {renderStepContent()}
      </div>

      <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
        <Button onClick={onClose} variant="secondary">
          <X className="w-5 h-5" />
        </Button>

        {step > 1 && step < 4 && (
          <Button onClick={handleBack} variant="secondary" className="flex-1">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Atrás
          </Button>
        )}

        {step < 3 && (
          <Button onClick={handleNext} className="flex-1">
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}

        {step === 4 && (
          <Button onClick={handleSubmit} loading={isLoading} className="flex-1">
            <Heart className="w-5 h-5 mr-2" />
            Ir al pago
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default ContributeModal
