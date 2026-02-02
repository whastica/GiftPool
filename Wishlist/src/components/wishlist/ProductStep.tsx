import { Link2, AlertCircle, Loader2 } from 'lucide-react'
import { Input } from '../ui/Input'
import Button from '../ui/Button'

interface ProductStepProps {
  productUrl: string
  isLoading: boolean
  error: string | null
  onUrlChange: (url: string) => void
  onLoadProduct: () => void
}

const ProductStep = ({
  productUrl,
  isLoading,
  error,
  onUrlChange,
  onLoadProduct,
}: ProductStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLoadProduct()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL Input */}
      <div>
        <Input
          label="Link del producto (MercadoLibre)"
          type="url"
          name="productUrl"
          value={productUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://articulo.mercadolibre.com.co/..."
          error={error || undefined}
          helperText={!error ? "Pega el link completo del producto que quieres" : undefined}
          disabled={isLoading}
          autoFocus
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit"
        fullWidth 
        loading={isLoading}
        disabled={!productUrl.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Cargando producto...
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4 mr-2" />
            Cargar producto
          </>
        )}
      </Button>

      {/* Info Alert */}
      <div className="flex items-start space-x-3 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 mb-1">
            💡 ¿Cómo funciona?
          </p>
          <ul className="space-y-1 text-blue-800">
            <li>• Busca el producto en MercadoLibre</li>
            <li>• Copia el link completo desde tu navegador</li>
            <li>• Pégalo aquí y nosotros lo cargamos automáticamente</li>
          </ul>
        </div>
      </div>

      {/* Supported Marketplaces */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Tiendas soportadas:
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ✓ MercadoLibre
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
            Amazon (próximamente)
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
            Falabella (próximamente)
          </span>
        </div>
      </div>
    </form>
  )
}

export default ProductStep