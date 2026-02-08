/**
 * Estado vacío para el dashboard
 * Se muestra cuando no hay wishlists o no hay resultados de búsqueda
 */

import { useNavigate } from 'react-router-dom'
import { Plus, Search, Gift, CheckCircle2, Clock } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import type { WishlistFilter } from '../../types/wishlistTypes'

interface EmptyStateProps {
  filter: WishlistFilter
  searchTerm?: string
  hasWishlists: boolean
}

const EmptyState = ({ filter, searchTerm, hasWishlists }: EmptyStateProps) => {
  const navigate = useNavigate()

  // ============================================
  // EMPTY STATES POR FILTRO
  // ============================================

  const emptyStates = {
    all: {
      icon: Gift,
      title: '¡Crea tu primera wishlist!',
      description:
        'Aún no has creado ninguna wishlist. Empieza ahora y comparte tu regalo ideal con amigos y familia.',
      showButton: true,
    },
    active: {
      icon: Clock,
      title: 'No tienes wishlists activas',
      description:
        hasWishlists
          ? 'Todas tus wishlists están completadas o expiradas.'
          : 'Las wishlists activas aparecerán aquí.',
      showButton: !hasWishlists,
    },
    completed: {
      icon: CheckCircle2,
      title: '¡Aún no has completado ninguna!',
      description:
        'Cuando completes tus primeras wishlists, aparecerán aquí con todos sus detalles.',
      showButton: !hasWishlists,
    },
    expired: {
      icon: Clock,
      title: 'No tienes wishlists expiradas',
      description: 'Las wishlists cuya fecha de evento ya pasó aparecerán aquí.',
      showButton: false,
    },
  }

  // ============================================
  // EMPTY STATE POR BÚSQUEDA
  // ============================================

  if (searchTerm && searchTerm.trim()) {
    return (
      <Card className="text-center py-16 animate-fade-in">
        <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No encontramos resultados
        </h3>
        <p className="text-gray-600 mb-6">
          No hay wishlists que coincidan con{' '}
          <span className="font-semibold">"{searchTerm}"</span>
        </p>
        <p className="text-sm text-gray-500">
          Intenta con otro término de búsqueda
        </p>
      </Card>
    )
  }

  // ============================================
  // EMPTY STATE POR FILTRO
  // ============================================

  const state = emptyStates[filter]
  const Icon = state.icon

  return (
    <Card className="text-center py-16 animate-fade-in">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 mb-6">
          <Icon className="w-10 h-10 text-primary-600" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{state.title}</h3>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">{state.description}</p>

        {/* Action Button */}
        {state.showButton && (
          <Button
            size="lg"
            onClick={() => navigate('/crear-wishlist')}
            className="mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear mi primera Wishlist
          </Button>
        )}

        {/* Additional Tips */}
        {filter === 'all' && hasWishlists === false && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">💡 ¿Cómo funciona?</p>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center mb-2">
                  1
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Elige</strong> el producto que quieres
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center mb-2">
                  2
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Comparte</strong> con amigos y familia
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center mb-2">
                  3
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Recibe</strong> tu regalo y videos
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default EmptyState