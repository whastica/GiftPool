import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Calendar, TrendingUp } from 'lucide-react'
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
// ✅ EPIC 6: Importar modal multi-step desde contribute/
import ContributeModal from '../components/contribute/ContributeModal'
import ShareButtons from '../components/wishlist/ShareButtons'

const PublicWishlistPage = () => {
  const navigate = useNavigate()
  const [showContributeModal, setShowContributeModal] = useState(false)

  const {
    wishlist,
    isLoading,
    error,
    isContributing,
    contribute,
    progress,
    remaining,
    isExpired,
    isCompleted,
    daysRemaining,
  } = usePublicWishlist()

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
          </Card>

          <ProductDisplay product={wishlist.product} />

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
                {Math.round(
                  wishlist.currentAmount / wishlist.contributorsCount
                ).toLocaleString()}
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