import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle, Calendar, TrendingUp, RefreshCw } from 'lucide-react'
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
import Skeleton from '../components/ui/Skeleton'
import WishlistStatusBadge from '../components/wishlist/WishlistStatusBadge'
import ProductDisplay from '../components/wishlist/ProductDisplay'
import ContributorsList from '../components/wishlist/ContributorsList'
import ShareButtons from '../components/wishlist/ShareButtons'
// ✅ EPIC 6: Modal multi-step
import ContributeModal from '../components/contribute/ContributeModal'

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
   * ✅ EPIC 6: Guardar slug actual para poder volver después del pago
   */
  useEffect(() => {
    if (wishlist?.slug) {
      localStorage.setItem('last_wishlist_slug', wishlist.slug)
    }
  }, [wishlist?.slug])

  /**
   * ✅ EPIC 6: Detectar si venimos de la página de éxito y recargar datos
   */
  useEffect(() => {
    const contributionSuccess = localStorage.getItem('giftpool_contribution_success')
    const shouldReload = (location.state as any)?.reloadData
    
    if (contributionSuccess === 'true' || shouldReload) {
      console.log('🔄 Reloading wishlist after contribution...')
      
      // Mostrar toast de éxito
      setShowSuccessToast(true)
      
      // Recargar datos
      reload()
      
      // Limpiar flag
      localStorage.removeItem('giftpool_contribution_success')
      
      // Ocultar toast después de 5 segundos
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

  /**
   * Estados base
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <Skeleton height="4rem" className="mb-8" rounded="lg" />
        </div>
      </div>
    )
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Wishlist no encontrada</h2>
          <p className="text-gray-600 mb-4">
            {error ?? 'No pudimos cargar esta wishlist'}
          </p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </Card>
      </div>
    )
  }

  const canContribute =
    !isCompleted && !isExpired && wishlist.status === 'active'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ EPIC 6: Toast de éxito después de contribución */}
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
        <div className="text-5xl mb-3">🎁</div>
        <h1 className="text-4xl font-bold">{wishlist.title}</h1>
        <p className="text-lg mt-2">Para {wishlist.ownerName}</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
          <Calendar className="w-5 h-5" />
          {new Date(wishlist.eventDate).toLocaleDateString('es-CO')}
        </div>
        <div className="mt-4">
          <WishlistStatusBadge
            status={wishlist.status}
            daysRemaining={daysRemaining}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
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
            
            {/* ✅ EPIC 6: Mostrar mensaje si se completó la meta */}
            {isCompleted && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-green-900 mb-1">
                  🎉 ¡Meta alcanzada!
                </p>
                <p className="text-sm text-green-700">
                  Este regalo ya fue completado gracias a la generosidad de todos
                </p>
              </div>
            )}
          </Card>

          <ProductDisplay product={wishlist.product} />

          {/* ✅ EPIC 6: Lista de contribuidores actualizada */}
          <ContributorsList
            contributors={wishlist.contributors}
            total={wishlist.contributorsCount}
          />
        </div>

        <div className="space-y-6">
          <ShareButtons
            url={window.location.href}
            title={wishlist.title}
            ownerName={wishlist.ownerName}
            progress={progress}
          />

          <Card className="bg-blue-50 border-blue-200">
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

      {/* ✅ EPIC 6: Modal multi-step con useContribute integrado */}
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