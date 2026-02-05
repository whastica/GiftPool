import { useState, useEffect } from 'react'
import {
  Video,
  DollarSign,
  User,
  Mail,
  MessageSquare,
  Heart,
} from 'lucide-react'

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

const INITIAL_FORM: ContributeFormData = {
  amount: 0,
  name: '',
  email: '',
  message: '',
  isAnonymous: false,
  includeVideo: false,
}

const ContributeModal = ({
  isOpen,
  onClose,
  onSubmit,
  targetAmount,
  currentAmount,
  isLoading = false,
}: ContributeModalProps) => {
  const [formData, setFormData] =
    useState<ContributeFormData>(INITIAL_FORM)

  const [errors, setErrors] = useState<Record<string, string>>({})

  /* -------------------------------------------------------------------------- */
  /* 🔁 RESET OBLIGATORIO AL ABRIR EL MODAL                                       */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM)
      setErrors({})
    }
  }, [isOpen])

  const remaining = targetAmount - currentAmount
  const minAmount = 10000
  const suggestedAmounts = [20000, 50000, 100000, remaining]

  /* -------------------------------------------------------------------------- */
  /* HANDLERS                                                                    */
  /* -------------------------------------------------------------------------- */

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

  const selectAmount = (amount: number) => {
    setFormData((prev) => ({ ...prev, amount }))
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }))
    }
  }

  /* -------------------------------------------------------------------------- */
  /* VALIDATION                                                                  */
  /* -------------------------------------------------------------------------- */

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || formData.amount < minAmount) {
      newErrors.amount = `El monto mínimo es $${minAmount.toLocaleString()}`
    }

    if (formData.amount > remaining) {
      newErrors.amount = `No puede exceder $${remaining.toLocaleString()}`
    }

    if (!formData.isAnonymous && !formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    if (formData.name.length > 100) {
      newErrors.name = 'Máx. 100 caracteres'
    }

    if (formData.message && formData.message.length > 300) {
      newErrors.message = 'Máx. 300 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* -------------------------------------------------------------------------- */
  /* SUBMIT                                                                      */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const success = await onSubmit(formData)

    // 🔑 El modal NO decide el flujo, SOLO se cierra
    if (success) {
      onClose()
    }
  }

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="💝 Aportar al regalo"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* AMOUNT */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            <DollarSign className="inline w-4 h-4 mr-1" />
            ¿Cuánto quieres aportar?
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {suggestedAmounts.map((amount, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectAmount(amount)}
                className={`border-2 rounded-lg p-3 font-semibold transition
                  ${
                    formData.amount === amount
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-200 hover:border-primary-600'
                  }`}
              >
                ${(amount / 1000).toFixed(0)}k
              </button>
            ))}
          </div>

          <Input
            type="number"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            error={errors.amount}
            min={minAmount}
            step={1000}
          />
        </div>

        {!formData.isAnonymous && (
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            label={
              <span>
                <User className="inline w-4 h-4 mr-1" />
                Tu nombre
              </span>
            }
            error={errors.name}
          />
        )}

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
        />

        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          label={
            <span>
              <MessageSquare className="inline w-4 h-4 mr-1" />
              Mensaje
            </span>
          }
          maxLength={300}
          error={errors.message}
        />

        {/* VIDEO */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Video className="w-5 h-5 text-yellow-600" />
            <input
              type="checkbox"
              name="includeVideo"
              checked={formData.includeVideo}
              onChange={handleChange}
            />
            <span>Grabar video después del pago</span>
          </label>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          disabled={isLoading}
        >
          <Heart className="w-5 h-5 mr-2" />
          Continuar al pago
        </Button>
      </form>
    </Modal>
  )
}

export default ContributeModal
