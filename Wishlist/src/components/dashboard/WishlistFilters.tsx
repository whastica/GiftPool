/**
 * Filtros de Wishlists (Tabs)
 * Permite filtrar wishlists por estado
 */

import Card from '../ui/Card'
import type { WishlistFilter } from '../../types/wishlistTypes'

interface WishlistFiltersProps {
  activeFilter: WishlistFilter
  onFilterChange: (filter: WishlistFilter) => void
  counts: {
    all: number
    active: number
    completed: number
    expired: number
  }
}

interface TabButtonProps {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}

const TabButton = ({ label, count, isActive, onClick }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative py-4 px-6 border-b-2 font-semibold transition-all duration-200
        ${
          isActive
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }
      `}
    >
      <span className="flex items-center space-x-2">
        <span>{label}</span>
        <span
          className={`
            px-2 py-0.5 rounded-full text-xs font-bold
            ${
              isActive
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600'
            }
          `}
        >
          {count}
        </span>
      </span>

      {/* Active indicator */}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600" />
      )}
    </button>
  )
}

const WishlistFilters = ({
  activeFilter,
  onFilterChange,
  counts,
}: WishlistFiltersProps) => {
  return (
    <Card className="mb-6">
      <div className="flex flex-wrap -mb-px">
        <TabButton
          label="Todas"
          count={counts.all}
          isActive={activeFilter === 'all'}
          onClick={() => onFilterChange('all')}
        />
        
        <TabButton
          label="Activas"
          count={counts.active}
          isActive={activeFilter === 'active'}
          onClick={() => onFilterChange('active')}
        />
        
        <TabButton
          label="Completadas"
          count={counts.completed}
          isActive={activeFilter === 'completed'}
          onClick={() => onFilterChange('completed')}
        />
        
        <TabButton
          label="Expiradas"
          count={counts.expired}
          isActive={activeFilter === 'expired'}
          onClick={() => onFilterChange('expired')}
        />
      </div>
    </Card>
  )
}

export default WishlistFilters