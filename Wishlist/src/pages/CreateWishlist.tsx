/**
 * CreateWishlistPage
 * ACTUALIZADO: Integrado con React Query mutation
 */

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useWishlistWizard } from '../hooks/useWishlistWizard'
import { useCreateWishlist } from '../hooks/mutations/useCreateWishlist'

// Components
import Card from '../components/ui/Card'
import WizardSteps from '../components/wishlist/WizardSteps'
import ProductStep from '../components/wishlist/ProductStep'
import EventDetailsStep from '../components/wishlist/EventDetailStep'
import ShareStep from '../components/wishlist/ShareStep'
import ProductPreview from '../components/wishlist/ProductPreview'

const CreateWishlistPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [createdWishlistSlug, setCreatedWishlistSlug] = useState<string>('')

  const {
    currentStep,
    formData,
    productData,
    isLoading,
    error,
    updateFormData,
    goToStep,
    previousStep,
    loadProduct,
    resetWizard,
  } = useWishlistWizard()

  // ✅ EPIC 9: Usar mutation de React Query
  const createMutation = useCreateWishlist({
    onSuccess: (wishlist) => {
      setCreatedWishlistSlug(wishlist.slug)
      goToStep(3) // Ir al paso de compartir
    },
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/crear-wishlist')
    }
  }, [isAuthenticated, navigate])

  // ============================================
  // HANDLERS
  // ============================================

  const handleUrlChange = (url: string) => {
    updateFormData({ productUrl: url })
  }

  const handleFormChange = (updates: Partial<typeof formData>) => {
    updateFormData(updates)
  }

  const handleCreateWishlist = async () => {
    if (!user || !productData) {
      console.error('Missing user or product data')
      return
    }

    // ✅ EPIC 9: Usar mutation en lugar de createWishlist
    createMutation.mutate({
      formData,
      userId: user.id,
      productData,
    })
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  const handleCreateAnother = () => {
    resetWizard()
    setCreatedWishlistSlug('')
  }

  // ✅ EPIC 9: Combinar estados de loading
  const isCreating = createMutation.isPending || isLoading
  const creationError = createMutation.error?.message || error

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wizard Steps Indicator */}
      <WizardSteps 
        currentStep={currentStep} 
        onStepClick={goToStep}
        allowNavigation={currentStep > 1 && !isCreating}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Crea tu{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Wishlist
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              En menos de 2 minutos tendrás tu página lista para compartir
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Column */}
            <div className="order-2 lg:order-1">
              <Card className="animate-fade-in-up">
                {/* Step 1: Product URL */}
                {currentStep === 1 && (
                  <ProductStep
                    productUrl={formData.productUrl}
                    isLoading={isLoading}
                    error={creationError}
                    onUrlChange={handleUrlChange}
                    onLoadProduct={loadProduct}
                  />
                )}

                {/* Step 2: Event Details */}
                {currentStep === 2 && (
                  <EventDetailsStep
                    formData={formData}
                    isLoading={isCreating}
                    error={creationError}
                    onFormChange={handleFormChange}
                    onSubmit={handleCreateWishlist}
                    onBack={previousStep}
                  />
                )}

                {/* Step 3: Share */}
                {currentStep === 3 && (
                  <ShareStep
                    wishlistSlug={createdWishlistSlug}
                    wishlistTitle={formData.eventTitle}
                    onGoToDashboard={handleGoToDashboard}
                    onCreateAnother={handleCreateAnother}
                  />
                )}
              </Card>
            </div>

            {/* Preview Column */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24 animate-fade-in-up animation-delay-200">
                <ProductPreview
                  product={productData}
                  targetAmount={formData.targetAmount}
                  isLoading={isLoading && currentStep === 1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateWishlistPage