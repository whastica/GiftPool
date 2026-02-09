/**
 * Dashboard del Usuario
 * ACTUALIZADO: Integrado con React Query y ErrorState
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
import ErrorState from '../components/error/ErrorState'

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
      // El toast ya se muestra en la mutation
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
        {/* ✅ EPIC 9: Error State Mejorado */}
        {error && !isLoading && (
          <div className="mb-6">
            <ErrorState
              error={error}
              onRetry={refreshWishlists}
              isRetrying={isRefreshing}
              title="Error al cargar wishlists"
              compact={true}
            />
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

        {/* ✅ EPIC 9: Loading State */}
        {isLoading && <WishlistSkeleton count={3} />}

        {/* ✅ EPIC 9: Wishlists Grid - Solo si no hay error ni loading */}
        {!isLoading && !error && !isEmpty && (
          <div className="space-y-6 animate-fade-in-up">
            {wishlists.map((wishlist, index) => (
              <div
                key={wishlist.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in-up"
              >
                <WishlistCard
                  wishlist={wishlist}
                  onDelete={handleDeleteWishlist}
                />
              </div>
            ))}
          </div>
        )}

        {/* ✅ EPIC 9: Empty State - Solo si no hay error ni loading */}
        {!isLoading && !error && isEmpty && (
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