import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'
import Badge from '../common/Badge'
import type { WishlistStatus } from '../../types/publicWishlistTypes'

interface WishlistStatusBadgeProps {
  status: WishlistStatus
  daysRemaining?: number
  className?: string
}

const WishlistStatusBadge = ({ 
  status, 
  daysRemaining = 0,
  className = '' 
}: WishlistStatusBadgeProps) => {
  const statusConfig = {
    active: {
      variant: 'info' as const,
      icon: <Clock className="w-4 h-4" />,
      label: daysRemaining > 0 
        ? `${daysRemaining} ${daysRemaining === 1 ? 'día' : 'días'} restantes`
        : 'Activa',
      bgClass: 'bg-blue-50 border-blue-200',
    },
    completed: {
      variant: 'success' as const,
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: '¡Completada!',
      bgClass: 'bg-green-50 border-green-200',
    },
    expired: {
      variant: 'warning' as const,
      icon: <XCircle className="w-4 h-4" />,
      label: 'Expirada',
      bgClass: 'bg-yellow-50 border-yellow-200',
    },
    cancelled: {
      variant: 'danger' as const,
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'Cancelada',
      bgClass: 'bg-red-50 border-red-200',
    },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      size="lg"
      className={className}
    >
      {config.label}
    </Badge>
  )
}

export default WishlistStatusBadge