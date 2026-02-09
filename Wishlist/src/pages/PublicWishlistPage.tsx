/**
 * PublicWishlistPage
 * ACTUALIZADO: Integrado con React Query y ErrorState
 */

import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Calendar, TrendingUp, RefreshCw } from 'lucide-react'
import { usePublicWishlist } from '../hooks/usePublicWishlist'
import {
  generateMetaTags,
  updateMetaTags,
  insertStructuredData,
  clearMetaTags,
  clearStructuredData,
} from '../utils/metaTagsUtils'

// UI
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressBar from '../components/common/ProgressBar'
import WishlistStatusBadge from '../components/wishlist/WishlistStatusBadge'
import ProductDisplay from '../components/wishlist/ProductDisplay'
import ContributorsList from '../components/wishlist/ContributorsList'
import ShareButtons from '../components/wishlist/ShareButtons'
import ContributeModal from '../components/contribute/ContributeModal'

// ✅ EPIC 9: Error & Loading Components
import ErrorState from '../components/error/ErrorState'
import WishlistSkeleton from '../components/dashboard/WishlistSkeleton'

const PublicWishlistPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showContributeModal, setShowContributeModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const {
    wishlist,
    isLoading,
    error,
    isContributing,
    contribute,
    reload,
    progress,
    remaining,
    isExpired,
    isCompleted,
    daysRemaining,
  } = usePublicWishlist()

  /**
   * Guardar slug actual para poder volver después del pago
   */
  useEffect(() => {
    if (wishlist?.slug) {
      localStorage.setItem('last_wishlist_slug', wishlist.slug)
    }
  }, [wishlist?.slug])

  /**
   * Detectar si venimos de la página de éxito y recargar datos
   */
  useEffect(() => {
    const contributionSuccess = localStorage.getItem('giftpool_contribution_success')
    const shouldReload = (location.state as any)?.reloadData
    
    if (contributionSuccess === 'true' || shouldReload) {
      console.log('🔄 Reloading wishlist after contribution...')
      
      setShowSuccessToast(true)
      reload()
      localStorage.removeItem('giftpool_contribution_success')
      
      setTimeout(() => {
        setShowSuccessToast(false)
      }, 5000)
    }
  }, [location, reload])

  /**
   * SEO / Meta tags
   */
  useEffect(() => {
    if (!wishlist) return
    
    const metaTags = generateMetaTags(wishlist)
    updateMetaTags(metaTags)
    insertStructuredData(wishlist)
    
    return () => {
      clearMetaTags()
      clearStructuredData()
    }
  }, [wishlist])

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="gradient-bg py-12">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-block w-16 h-16 bg-white/20 rounded-full mb-4 animate-pulse" />
            <div className="h-10 bg-white/20 rounded-lg max-w-md mx-auto mb-2 animate-pulse" />
            <div className="h-6 bg-white/20 rounded-lg max-w-xs mx-auto animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <WishlistSkeleton count={1} />
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error || !wishlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <ErrorState
            error={error || 'Wishlist no encontrada'}
            onRetry={reload}
            title="No pudimos cargar la wishlist"
            description={error || 'Esta wishlist no existe o ha sido eliminada.'}
            showRetry={!!error}
          />
          
          <div className="mt-6 text-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // SUCCESS STATE
  // ============================================

  const canContribute = !isCompleted && !isExpired && wishlist.status === 'active'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">¡Contribución registrada!</p>
              <p className="text-sm opacity-90">La lista se ha actualizado</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12 text-center text-white">
        <div className="text-5xl mb-3 animate-float">🎁</div>
        <h1 className="text-4xl font-bold animate-fade-in-up">{wishlist.title}</h1>
        <p className="text-lg mt-2 animate-fade-in-up animation-delay-200">
          Para {wishlist.ownerName}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full animate-fade-in-up animation-delay-400">
          <Calendar className="w-5 h-5" />
          {new Date(wishlist.eventDate).toLocaleDateString('es-CO')}
        </div>
        <div className="mt-4 animate-fade-in-up animation-delay-600">
          <WishlistStatusBadge
            status={wishlist.status}
            daysRemaining={daysRemaining}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-primary-600">
              ${wishlist.currentAmount.toLocaleString()}
              <span className="text-gray-400">
                {' '}
                / ${wishlist.targetAmount.toLocaleString()}
              </span>
            </h2>
            
            <ProgressBar
              current={wishlist.currentAmount}
              target={wishlist.targetAmount}
            />
            
            <div className="flex justify-between text-sm mt-3">
              <span>{wishlist.contributorsCount} personas han aportado</span>
              {remaining > 0 && (
                <span>Faltan ${remaining.toLocaleString()}</span>
              )}
            </div>

            {canContribute && (
              <Button
                fullWidth
                size="lg"
                className="mt-6"
                onClick={() => setShowContributeModal(true)}
              >
                💝 Aportar ahora
              </Button>
            )}
            
            {isCompleted && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 text-center animate-scale-in">
                <p className="text-lg font-bold text-green-900 mb-1">
                  🎉 ¡Meta alcanzada!
                </p>
                <p className="text-sm text-green-700">
                  Este regalo ya fue completado gracias a la generosidad de todos
                </p>
              </div>
            )}
          </Card>

          <div className="animate-fade-in-up animation-delay-200">
            <ProductDisplay product={wishlist.product} />
          </div>

          <div className="animate-fade-in-up animation-delay-400">
            <ContributorsList
              contributors={wishlist.contributors}
              total={wishlist.contributorsCount}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="animate-fade-in-up animation-delay-200">
            <ShareButtons
              url={window.location.href}
              title={wishlist.title}
              ownerName={wishlist.ownerName}
              progress={progress}
            />
          </div>

          <Card className="bg-blue-50 border-blue-200 animate-fade-in-up animation-delay-400">
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5" />
              Estadísticas
            </h3>
            <p>
              Aporte promedio:{' '}
              <strong>
                $
                {wishlist.contributorsCount > 0
                  ? Math.round(
                      wishlist.currentAmount / wishlist.contributorsCount
                    ).toLocaleString()
                  : 0}
              </strong>
            </p>
          </Card>
        </div>
      </div>

      {/* Contribute Modal */}
      <ContributeModal
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        onSubmit={contribute}
        targetAmount={wishlist.targetAmount}
        currentAmount={wishlist.currentAmount}
        isLoading={isContributing}
      />
    </div>
  )
}

export default PublicWishlistPage