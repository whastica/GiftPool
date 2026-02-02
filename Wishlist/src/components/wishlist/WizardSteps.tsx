import { CheckCircle2 } from 'lucide-react'
import type { WizardStep } from '../../types/wishlistTypes'

interface WizardStepsProps {
  currentStep: WizardStep
  onStepClick?: (step: WizardStep) => void
  allowNavigation?: boolean
}

const STEPS = [
  { number: 1, label: 'Producto' },
  { number: 2, label: 'Detalles' },
  { number: 3, label: 'Compartir' },
] as const

const WizardSteps = ({ 
  currentStep, 
  onStepClick,
  allowNavigation = false 
}: WizardStepsProps) => {
  const handleStepClick = (stepNumber: WizardStep) => {
    if (allowNavigation && onStepClick && stepNumber <= currentStep) {
      onStepClick(stepNumber)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center max-w-2xl mx-auto">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step Circle */}
              <button
                onClick={() => handleStepClick(step.number as WizardStep)}
                disabled={!allowNavigation || step.number > currentStep}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold 
                  transition-all duration-300 relative
                  ${currentStep > step.number 
                    ? 'bg-green-500 text-white scale-100' 
                    : ''
                  }
                  ${currentStep === step.number 
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white scale-110 shadow-lg' 
                    : ''
                  }
                  ${currentStep < step.number 
                    ? 'bg-gray-200 text-gray-500 scale-100' 
                    : ''
                  }
                  ${allowNavigation && step.number <= currentStep 
                    ? 'cursor-pointer hover:scale-105' 
                    : 'cursor-default'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 size={20} />
                ) : (
                  step.number
                )}
                
                {/* Pulse animation for current step */}
                {currentStep === step.number && (
                  <span className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-25"></span>
                )}
              </button>

              {/* Step Label */}
              <span
                className={`
                  ml-2 font-medium transition-colors duration-300
                  ${currentStep >= step.number 
                    ? 'text-primary-600' 
                    : 'text-gray-400'
                  }
                `}
              >
                {step.label}
              </span>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    w-16 md:w-24 h-1 mx-3 transition-all duration-500
                    ${currentStep > step.number 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                    }
                  `}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WizardSteps