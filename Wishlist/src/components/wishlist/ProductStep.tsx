/**
 * ProductStep Component - CORREGIDO
 * Paso 1 del wizard: Cargar producto desde URL
 * 
 * FIX: Spinner ahora aparece durante la carga
 */

import { useState } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'
import Button from '../ui/Button'
import { Input } from '../ui/Input'

interface ProductStepProps {
  productUrl: string
  isLoading: boolean
  error: string | null
  onUrlChange: (url: string) => void
  onLoadProduct: () => Promise<void>
}

const ProductStep = ({
  productUrl,
  isLoading,
  error,
  onUrlChange,
  onLoadProduct,
}: ProductStepProps) => {
  const [touched, setTouched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    await onLoadProduct()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(e.target.value)
  }

  const isValidUrl = productUrl.trim().length > 0
  const showError = touched && error

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Paso 1: Producto
      </h2>
      <p className="text-gray-600 mb-6">
        Pega el link del producto de MercadoLibre que deseas recibir
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label htmlFor="productUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL del producto
          </label>
          <Input
            id="productUrl"
            type="url"
            value={productUrl}
            onChange={handleInputChange}
            placeholder="https://www.mercadolibre.com.co/producto..."
            disabled={isLoading}
            error={showError ? error : undefined}
          />
          {showError && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Ejemplos de URLs */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">
            💡 URLs de ejemplo:
          </p>
          <div className="space-y-1 text-sm text-blue-700">
            <button
              type="button"
              onClick={() => onUrlChange('https://www.mercadolibre.com.co/laptop-macbook')}
              className="flex items-center hover:text-blue-900 transition-colors"
              disabled={isLoading}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Laptop MacBook
            </button>
            <button
              type="button"
              onClick={() => onUrlChange('https://www.mercadolibre.com.co/playstation-5')}
              className="flex items-center hover:text-blue-900 transition-colors"
              disabled={isLoading}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              PlayStation 5
            </button>
            <button
              type="button"
              onClick={() => onUrlChange('https://www.mercadolibre.com.co/bicicleta-mtb')}
              className="flex items-center hover:text-blue-900 transition-colors"
              disabled={isLoading}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Bicicleta MTB
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={!isValidUrl || isLoading}
        >
          {/* ✅ FIX: Spinner visible con animación */}
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Cargando producto...
            </>
          ) : (
            'Cargar Producto'
          )}
        </Button>
      </form>
    </div>
  )
}

export default ProductStep