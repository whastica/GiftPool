import { Calendar, MessageSquare, Sparkles } from 'lucide-react'
import { Input, Textarea } from '../ui/Input'
import Button from '../ui/Button'
import type { WishlistFormData } from '../../types/wishlistTypes'

interface EventDetailsStepProps {
  formData: WishlistFormData
  isLoading: boolean
  error: string | null
  onFormChange: (updates: Partial<WishlistFormData>) => void
  onSubmit: () => void
  onBack: () => void
}

const EventDetailsStep = ({
  formData,
  isLoading,
  error,
  onFormChange,
  onSubmit,
  onBack,
}: EventDetailsStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onFormChange({ [e.target.name]: e.target.value })
  }

  // Calcular fecha mínima (mañana)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Title */}
      <div>
        <Input
          label="🎉 Nombre del evento"
          type="text"
          name="eventTitle"
          value={formData.eventTitle}
          onChange={handleInputChange}
          placeholder="Ej: Cumpleaños de María, Graduación de Juan, etc."
          error={error && !formData.eventTitle ? error : undefined}
          required
          autoFocus
          minLength={3}
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.eventTitle.length}/100 caracteres
        </p>
      </div>

      {/* Event Date */}
      <div>
        <Input
          label={
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Fecha del evento
            </span>
          }
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleInputChange}
          min={minDate}
          error={error && !formData.eventDate ? error : undefined}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Tu wishlist estará activa hasta esta fecha
        </p>
      </div>

      {/* Personal Message */}
      <div>
        <Textarea
          label={
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Mensaje personal
            </span>
          }
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          placeholder="Cuéntales por qué quieres este regalo y qué significa para ti... Esto ayudará a que más personas quieran colaborar 💝"
          helperText="Este mensaje aparecerá en tu wishlist pública"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.message.length}/500 caracteres
        </p>
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-100">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-900 mb-2">
              💡 Tips para un mensaje efectivo:
            </p>
            <ul className="space-y-1 text-xs text-purple-800">
              <li>• Explica por qué este regalo es importante para ti</li>
              <li>• Sé honesto y auténtico</li>
              <li>• Menciona cómo lo usarás o disfrutarás</li>
              <li>• Agradece de antemano a quienes colaboren</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={onBack}
          disabled={isLoading}
        >
          ← Cambiar producto
        </Button>
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={
            !formData.eventTitle.trim() ||
            !formData.eventDate ||
            isLoading
          }
        >
          {isLoading ? 'Creando wishlist...' : 'Crear wishlist →'}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </form>
  )
}

export default EventDetailsStep