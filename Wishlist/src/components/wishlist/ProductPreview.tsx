import { Gift, ExternalLink, TrendingUp, ShieldCheck } from 'lucide-react'
import Card from '../ui/Card'
import Skeleton from '../ui/Skeleton'
import type { Product } from '../../types/wishlistTypes'

interface ProductPreviewProps {
  product: Product | null
  targetAmount?: number
  isLoading?: boolean
}

const ProductPreview = ({ product, targetAmount, isLoading }: ProductPreviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <Skeleton height="16rem" rounded="lg" className="mb-4" />
        <Skeleton height="1.5rem" className="mb-2" />
        <Skeleton height="2rem" width="60%" className="mb-4" />
        <Skeleton height="1rem" width="40%" />
      </Card>
    )
  }

  if (!product) {
    return (
      <Card className="text-center py-12 bg-gray-50">
        <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium text-gray-400">Vista previa del producto</p>
        <p className="text-sm text-gray-400 mt-2">
          Pega un link para ver cómo se verá tu wishlist
        </p>
      </Card>
    )
  }

  const commission = targetAmount ? targetAmount - product.price : product.price * 0.05

  return (
    <div className="space-y-4">
      {/* Main Product Card */}
      <Card className="animate-fade-in-up overflow-hidden">
        {/* Product Image */}
        <div className="relative group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
          {product.available && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ✓ Disponible
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-primary-600">
              ${product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">COP</span>
          </div>

          {/* Target Amount with Commission */}
          {targetAmount && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-700">Precio del producto:</span>
                <span className="font-semibold">${product.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-700">Comisión GiftPool (5%):</span>
                <span className="font-semibold">+${commission.toLocaleString()}</span>
              </div>
              <div className="border-t border-purple-300 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Meta total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${targetAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Link to Product */}
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
          >
            Ver en {product.marketplace === 'mercadolibre' ? 'MercadoLibre' : 'tienda'}
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </Card>

      {/* Success Tips Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Tips para el éxito
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Productos populares se completan más rápido</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Un mensaje emotivo aumenta las colaboraciones</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Comparte pronto para dar tiempo de aportar</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Actualiza a tus amigos sobre el progreso</span>
          </li>
        </ul>
      </Card>

      {/* Security Badge */}
      <Card className="bg-green-50 border-2 border-green-200 text-center">
        <div className="flex items-center justify-center gap-2 text-green-900">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-sm">
            Compra protegida con garantía
          </span>
        </div>
        <p className="text-xs text-green-700 mt-1">
          Si no se completa en 30 días, devolvemos el dinero
        </p>
      </Card>
    </div>
  )
}

export default ProductPreview