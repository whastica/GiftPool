import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useWishlistWizard } from '../hooks/useWishlistWizard'
import Card from '../components/ui/Card'
import WizardSteps from '../components/wishlist/WizardSteps'
import ProductStep from '../components/wishlist/ProductStep'
import EventDetailsStep from '../components/wishlist/EventDetailStep'
import ShareStep from '../components/wishlist/ShareStep'
import ProductPreview from '../components/wishlist/ProductPreview'
import { wishlistService } from '../services/wishlistService'
import { useEffect, useState } from 'react'

const CreateWishlistPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
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
    createWishlist,
    resetWizard,
  } = useWishlistWizard()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/create')
    }
  }, [isAuthenticated, navigate])

  // Handle product URL change
  const handleUrlChange = (url: string) => {
    updateFormData({ productUrl: url })
  }

  // Handle form data changes
  const handleFormChange = (updates: Partial<typeof formData>) => {
    updateFormData(updates)
  }

  // Handle wishlist creation
  const handleCreateWishlist = async () => {
    const wishlist = await createWishlist()
    if (wishlist) {
      // Generate slug for the created wishlist
      const slug = wishlistService.generateSlug(formData.eventTitle)
      setCreatedWishlistSlug(slug)
    }
  }

  // Navigate to dashboard
  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  // Create another wishlist
  const handleCreateAnother = () => {
    resetWizard()
    setCreatedWishlistSlug('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wizard Steps Indicator */}
      <WizardSteps 
        currentStep={currentStep} 
        onStepClick={goToStep}
        allowNavigation={currentStep > 1}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Crea tu <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Wishlist</span>
            </h1>
            <p className="text-xl text-gray-600">
              En menos de 2 minutos tendrás tu página lista para compartir
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Column */}
            <div className="order-2 lg:order-1">
              <Card>
                {/* Step 1: Product URL */}
                {currentStep === 1 && (
                  <ProductStep
                    productUrl={formData.productUrl}
                    isLoading={isLoading}
                    error={error}
                    onUrlChange={handleUrlChange}
                    onLoadProduct={loadProduct}
                  />
                )}

                {/* Step 2: Event Details */}
                {currentStep === 2 && (
                  <EventDetailsStep
                    formData={formData}
                    isLoading={isLoading}
                    error={error}
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
              <div className="lg:sticky lg:top-24">
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