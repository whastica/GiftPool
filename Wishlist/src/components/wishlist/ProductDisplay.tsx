import { ExternalLink, Package, ShoppingCart } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../common/Badge'
import type { PublicProduct } from '../../types/publicWishlistTypes'

interface ProductDisplayProps {
  product: PublicProduct
  className?: string
}

const ProductDisplay = ({ product, className = '' }: ProductDisplayProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Product Image */}
      <div className="relative group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 md:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {product.available ? (
            <Badge variant="success" size="md" icon={<ShoppingCart className="w-4 h-4" />}>
              Disponible
            </Badge>
          ) : (
            <Badge variant="danger" size="md" icon={<Package className="w-4 h-4" />}>
              No disponible
            </Badge>
          )}
        </div>

        {/* Marketplace Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="default" size="sm">
            {product.marketplace}
          </Badge>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {product.name}
        </h2>

        {product.description && (
          <p className="text-gray-600 mb-4 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl md:text-5xl font-bold text-primary-600">
            ${product.price.toLocaleString()}
          </span>
          <span className="text-lg text-gray-500">COP</span>
        </div>

        {/* Link to Product */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          Ver producto en {product.marketplace}
        </a>
      </div>

      {/* Product Features (Optional) */}
      <div className="px-6 pb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            ℹ️ Sobre este producto
          </p>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Compra protegida con garantía</li>
            <li>• Envío directo al destinatario</li>
            <li>• Sin cargos ocultos</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}

export default ProductDisplay