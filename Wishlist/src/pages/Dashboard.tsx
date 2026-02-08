/**
 * Dashboard del Usuario
 * Muestra todas las wishlists con filtros, búsqueda y estadísticas
 */

import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import useDashboard from '../hooks/useDashboard'
import Button from '../components/ui/Button'
import DashboardStats from '../components/dashboard/DashboardStats'
import WishlistFilters from '../components/dashboard/WishlistFilters'
import WishlistCard from '../components/dashboard/WishlistCard'
import EmptyState from '../components/dashboard/EmptyState'
import WishlistSkeleton from '../components/dashboard/WishlistSkeleton'
import {
  filterWishlistsByStatus,
  getWishlistStatus,
  isWishlistExpired,
} from '../utils/wishlistUtils'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    wishlists,
    stats,
    activeFilter,
    searchTerm,
    isLoading,
    isRefreshing,
    error,
    setFilter,
    setSearchTerm,
    refreshWishlists,
    deleteWishlist,
    hasWishlists,
    isEmpty,
  } = useDashboard()

  // ============================================
  // FILTER COUNTS
  // ============================================

  const filterCounts = {
    all: wishlists.length,
    active: stats.activeWishlists,
    completed: stats.completed,
    expired: stats.expired,
  }

  // ============================================
  // HANDLERS
  // ============================================

  const handleDeleteWishlist = async (id: string) => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar esta wishlist? Esta acción no se puede deshacer.'
    )
    
    if (confirmed) {
      const success = await deleteWishlist(id)
      if (!success) {
        alert('No se pudo eliminar la wishlist. Intenta de nuevo.')
      }
    }
  }

  const handleRefresh = async () => {
    await refreshWishlists()
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-bold text-white mb-2">
                Hola, {user?.name || 'Usuario'} 👋
              </h1>
              <p className="text-xl text-white/90">
                Gestiona todas tus wishlists desde aquí
              </p>
            </div>

            <div className="flex space-x-3">
              {/* Refresh button */}
              {hasWishlists && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <RefreshCw
                    className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                  {isRefreshing ? 'Actualizando...' : 'Actualizar'}
                </Button>
              )}

              {/* Create button */}
              <Button
                size="lg"
                onClick={() => navigate('/crear-wishlist')}
                className="bg-white text-primary-600 hover:bg-white/90"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Wishlist
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8">
            <DashboardStats stats={stats} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        {(hasWishlists || isLoading) && (
          <WishlistFilters
            activeFilter={activeFilter}
            onFilterChange={setFilter}
            counts={filterCounts}
          />
        )}

        {/* Loading State */}
        {isLoading && <WishlistSkeleton count={3} />}

        {/* Wishlists Grid */}
        {!isLoading && !isEmpty && (
          <div className="space-y-6">
            {wishlists.map((wishlist) => (
              <WishlistCard
                key={wishlist.id}
                wishlist={wishlist}
                onDelete={handleDeleteWishlist}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && isEmpty && (
          <EmptyState
            filter={activeFilter}
            searchTerm={searchTerm}
            hasWishlists={hasWishlists}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard