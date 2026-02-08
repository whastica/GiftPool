/**
 * Card individual de Wishlist para el dashboard
 * Muestra información resumida y acciones rápidas
 */

import { TrendingUp, Calendar, Clock } from 'lucide-react'
import Card from '../ui/Card'
import ProgressBar from '../common/ProgressBar'
import WishlistActions from './WishlistActions'
import type { WishlistListItem, WishlistStatus } from '../../types/wishlistTypes'
import { formatDate, formatRelativeDate, calculateDaysRemaining } from '../../utils/wishlistUtils'

interface WishlistCardProps {
  wishlist: WishlistListItem
  onDelete?: (id: string) => void
}

interface StatusBadgeProps {
  status: WishlistStatus
  daysRemaining?: number
}

const StatusBadge = ({ status, daysRemaining }: StatusBadgeProps) => {
  const badges = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: daysRemaining !== undefined && daysRemaining >= 0
        ? daysRemaining === 0
          ? '¡Hoy!'
          : daysRemaining === 1
          ? 'Mañana'
          : `${daysRemaining} días`
        : 'Activa',
    },
    completed: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: '¡Completada!',
    },
    expired: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Expirada',
    },
    cancelled: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Cancelada',
    },
  }

  const badge = badges[status]

  return (
    <span
      className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center`}
    >
      {status === 'active' && daysRemaining !== undefined && daysRemaining <= 7 && (
        <Clock className="w-3 h-3 mr-1" />
      )}
      {badge.label}
    </span>
  )
}

const WishlistCard = ({ wishlist, onDelete }: WishlistCardProps) => {
  const daysRemaining = calculateDaysRemaining(wishlist.eventDate)
  const isUrgent = wishlist.status === 'active' && daysRemaining <= 7 && daysRemaining >= 0

  return (
    <Card
      hover
      className={`animate-fade-in-up ${
        isUrgent ? 'border-2 border-orange-200 shadow-orange-100' : ''
      }`}
    >
      <div className="grid md:grid-cols-12 gap-6">
        {/* Product Image */}
        <div className="md:col-span-2">
          <div className="relative">
            <img
              src={wishlist.product.image}
              alt={wishlist.product.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            {/* Urgent indicator */}
            {isUrgent && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                ¡Próximo!
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-7">
          {/* Title and Badge */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                {wishlist.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {wishlist.product.name}
              </p>
            </div>
            <StatusBadge status={wishlist.status} daysRemaining={daysRemaining} />
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <ProgressBar
              current={wishlist.currentAmount}
              target={wishlist.targetAmount}
              showPercentage={true}
            />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-gray-600">
            {/* Contributors */}
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {wishlist.contributors} {wishlist.contributors === 1 ? 'colaborador' : 'colaboradores'}
            </span>

            <span className="text-gray-300">•</span>

            {/* Event Date */}
            <span className="flex items-center" title={formatDate(wishlist.eventDate)}>
              <Calendar className="w-4 h-4 mr-1" />
              Evento: {formatRelativeDate(wishlist.eventDate)}
            </span>

            {/* Videos indicator */}
            {wishlist.hasVideos && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-purple-600 font-medium">
                  📹 Con videos
                </span>
              </>
            )}
          </div>

          {/* Creation date (small) */}
          <p className="text-xs text-gray-400 mt-2">
            Creada {formatRelativeDate(wishlist.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="md:col-span-3">
          <WishlistActions wishlist={wishlist} onDelete={onDelete} />
        </div>
      </div>
    </Card>
  )
}

export default WishlistCard