import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react'
import { usePublicWishlist } from '../hooks/usePublicWishlist'
import {
  updateMetaTags,
  clearMetaTags,
  insertStructuredData,
  clearStructuredData,
  generateMetaTags,
} from '../utils/metaTagsUtils'

// Components
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressBar from '../components/common/ProgressBar'
import Skeleton from '../components/ui/Skeleton'
import WishlistStatusBadge from '../components/wishlist/WishlistStatusBadge'
import ProductDisplay from '../components/wishlist/ProductDisplay'
import ContributorsList from '../components/wishlist/ContributorsList'
import ContributeModal from '../components/wishlist/ContributeModal'
import ShareButtons from '../components/wishlist/ShareButtons'

/**
 * Página pública de wishlist (EPIC 5)
 * Vista completa y optimizada para conversión
 */
const PublicWishlistPage = () => {
  const navigate = useNavigate()
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

  const [showContributeModal, setShowContributeModal] = useState(false)

  /**
   * Actualizar meta tags cuando cargue la wishlist
   */
  useEffect(() => {
    if (wishlist) {
      const metaTags = generateMetaTags(wishlist)
      updateMetaTags(metaTags)
      insertStructuredData(wishlist)
    }

    return () => {
      clearMetaTags()
      clearStructuredData()
    }
  }, [wishlist])

  /**
   * Manejar contribución exitosa
   */
  const handleContribute = async (data: any) => {
    const success = await contribute(data)
    if (success) {
      setShowContributeModal(false)
      // TODO: Mostrar toast de éxito
    }
    return success
  }

  /**
   * Verificar si se puede contribuir
   */
  const canContribute = wishlist && 
    !isCompleted && 
    !isExpired && 
    wishlist.status === 'active'

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Skeleton height="4rem" className="mb-8" rounded="lg" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton height="32rem" rounded="lg" />
                <Skeleton height="16rem" rounded="lg" />
                <Skeleton height="24rem" rounded="lg" />
              </div>
              <div className="space-y-6">
                <Skeleton height="20rem" rounded="lg" />
                <Skeleton height="16rem" rounded="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !wishlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Card className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Wishlist no encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'No pudimos cargar esta wishlist. Verifica el link.'}
          </p>
          <Button onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Event Icon */}
            <div className="text-6xl mb-4">🎁</div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {wishlist.title}
            </h1>

            {/* Owner */}
            <p className="text-xl text-white/90 mb-4">
              Para {wishlist.ownerName}
            </p>

            {/* Event Date */}
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">
                {new Date(wishlist.eventDate).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <WishlistStatusBadge
                status={wishlist.status}
                daysRemaining={daysRemaining}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Card */}
              <Card className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Progreso
                    </p>
                    <h2 className="text-4xl font-bold text-primary-600 mt-1">
                      ${wishlist.currentAmount.toLocaleString()}
                      <span className="text-2xl text-gray-400">
                        {' '}/ ${wishlist.targetAmount.toLocaleString()}
                      </span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      {progress.toFixed(0)}%
                    </p>
                    <p className="text-sm text-gray-500">completado</p>
                  </div>
                </div>

                <ProgressBar
                  current={wishlist.currentAmount}
                  target={wishlist.targetAmount}
                  showPercentage={false}
                />

                <div className="flex items-center justify-between text-sm mt-4">
                  <span className="text-gray-600">
                    <span className="font-bold text-primary-600">
                      {wishlist.contributorsCount} {wishlist.contributorsCount === 1 ? 'persona' : 'personas'}
                    </span>{' '}
                    han aportado
                  </span>
                  {remaining > 0 && (
                    <span className="text-gray-600">
                      Faltan{' '}
                      <span className="font-bold text-orange-600">
                        ${remaining.toLocaleString()}
                      </span>
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                {canContribute ? (
                  <Button
                    fullWidth
                    size="lg"
                    className="mt-6"
                    onClick={() => setShowContributeModal(true)}
                  >
                    💝 Aportar ahora
                  </Button>
                ) : isCompleted ? (
                  <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-900 font-bold text-lg">
                      🎉 ¡Meta completada!
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      El regalo será enviado pronto
                    </p>
                  </div>
                ) : isExpired ? (
                  <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-900 font-bold">
                      ⏰ Esta wishlist ha expirado
                    </p>
                  </div>
                ) : null}

                <p className="text-center text-sm text-gray-500 mt-4">
                  Al completar, compramos automáticamente y lo enviamos
                </p>
              </Card>

              {/* Product Display */}
              <ProductDisplay
                product={wishlist.product}
                className="animate-fade-in-up animation-delay-200"
              />

              {/* Owner Message */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 animate-fade-in-up animation-delay-400">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {wishlist.ownerName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-600 mb-2">
                      {wishlist.ownerName} dice:
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {wishlist.message}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Contributors List */}
              <ContributorsList
                contributors={wishlist.contributors}
                total={wishlist.contributorsCount}
                className="animate-fade-in-up animation-delay-600"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share Buttons */}
              <ShareButtons
                url={window.location.href}
                title={wishlist.title}
                ownerName={wishlist.ownerName}
                progress={progress}
                className="sticky top-24"
              />

              {/* Info Card */}
              <Card className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <h3 className="font-bold text-lg mb-4">✨ ¿Cómo funciona?</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 font-bold">1.</span>
                    <span>Aportas lo que quieras (mínimo $10.000)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 font-bold">2.</span>
                    <span>Opcionalmente grabas un video-mensaje</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 font-bold">3.</span>
                    <span>
                      Cuando se complete, {wishlist.ownerName} recibe el regalo + video compilado
                    </span>
                  </li>
                </ul>
              </Card>

              {/* Stats Card */}
              {wishlist.contributorsCount > 0 && (
                <Card className="bg-blue-50 border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Estadísticas
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Aporte promedio:</span>
                      <span className="font-bold text-blue-900">
                        ${Math.round(wishlist.currentAmount / wishlist.contributorsCount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Con video-mensaje:</span>
                      <span className="font-bold text-blue-900">
                        {wishlist.contributors.filter(c => c.videoUrl).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Días transcurridos:</span>
                      <span className="font-bold text-blue-900">
                        {Math.ceil(
                          (new Date().getTime() - new Date(wishlist.createdAt).getTime()) / 
                          (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contribute Modal */}
      <ContributeModal
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        onSubmit={handleContribute}
        targetAmount={wishlist.targetAmount}
        currentAmount={wishlist.currentAmount}
        isLoading={isContributing}
      />
    </div>
  )
}

export default PublicWishlistPage