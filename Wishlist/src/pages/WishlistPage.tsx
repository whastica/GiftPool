import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Share2, Copy, Heart, Video as VideoIcon, MessageCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/common/ProgressBar'
import Modal from '../components/ui/Modal'

const WishlistPage = () => {
  const { slug } = useParams()
  const [showContributeModal, setShowContributeModal] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  // Simulated wishlist data
  const wishlist = {
    title: 'Cumpleaños de María',
    eventDate: '15 de Marzo, 2025',
    message: 'Hola amigos! Siempre he querido unos audífonos de alta calidad para disfrutar mi música favorita. Estos Sony son los mejores del mercado y serían el regalo perfecto para mi cumpleaños. ¡Gracias por ayudarme a cumplir este sueño! 🎧💜',
    product: {
      name: 'Audífonos Bluetooth Sony WH-1000XM4',
      price: 899900,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      url: 'https://mercadolibre.com.co/...'
    },
    current: 810000,
    target: 900000,
    contributors: [
      { name: 'Carlos Rodríguez', initial: 'C', color: 'bg-blue-500', hasVideo: true, time: 'Hace 2 horas' },
      { name: 'Andrea López', initial: 'A', color: 'bg-pink-500', hasVideo: true, time: 'Hace 5 horas' },
      { name: 'Juan Martínez', initial: 'J', color: 'bg-purple-500', hasVideo: false, time: 'Hace 1 día' },
      { name: 'Laura Gómez', initial: 'L', color: 'bg-green-500', hasVideo: true, time: 'Hace 1 día' },
      { name: 'Anónimo', initial: '😊', color: 'bg-yellow-500', hasVideo: false, time: 'Hace 2 días' },
    ]
  }

  const percentage = (wishlist.current / wishlist.target) * 100
  const remaining = wishlist.target - wishlist.current

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('¡Link copiado!')
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`¡Ayúdame a reunir para este regalo! 🎁 ${window.location.href}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="gradient-bg py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="text-6xl mb-3">🎂</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {wishlist.title}
          </h1>
          <p className="text-xl text-white/90">{wishlist.eventDate}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Progress Card */}
              <Card className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Progreso</p>
                    <h2 className="text-4xl font-bold text-primary-600 mt-1">
                      ${wishlist.current.toLocaleString()} 
                      <span className="text-2xl text-gray-400"> / ${wishlist.target.toLocaleString()}</span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">{percentage.toFixed(0)}%</p>
                    <p className="text-sm text-gray-500">completado</p>
                  </div>
                </div>

                <ProgressBar current={wishlist.current} target={wishlist.target} showPercentage={false} />

                <div className="flex items-center justify-between text-sm mt-4">
                  <span className="text-gray-600">
                    <span className="font-bold text-primary-600">{wishlist.contributors.length} personas</span> han aportado
                  </span>
                  <span className="text-gray-600">
                    Faltan <span className="font-bold text-orange-600">${remaining.toLocaleString()}</span>
                  </span>
                </div>

                <Button fullWidth size="lg" className="mt-8" onClick={() => setShowContributeModal(true)}>
                  💝 Aportar ahora
                </Button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Al completar, compramos automáticamente y lo enviamos
                </p>
              </Card>

              {/* Product Card */}
              <Card className="animate-fade-in-up animation-delay-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">📦 El Regalo</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <img 
                    src={wishlist.product.image} 
                    alt={wishlist.product.name}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {wishlist.product.name}
                    </h4>
                    <p className="text-3xl font-bold text-primary-600 mb-4">
                      ${wishlist.product.price.toLocaleString()}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Cancelación de ruido líder
                      </p>
                      <p className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        30 horas de batería
                      </p>
                      <p className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Calidad de audio excepcional
                      </p>
                    </div>
                    <a 
                      href={wishlist.product.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-primary-600 font-semibold hover:underline"
                    >
                      Ver en MercadoLibre →
                    </a>
                  </div>
                </div>
              </Card>

              {/* Message Card */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 animate-fade-in-up animation-delay-400">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    M
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-600 mb-2">María dice:</p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {wishlist.message}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Contributors List */}
              <Card className="animate-fade-in-up animation-delay-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  💝 Colaboradores ({wishlist.contributors.length})
                </h3>
                
                <div className="space-y-4">
                  {wishlist.contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${contributor.color} rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform`}>
                          {contributor.initial}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{contributor.name}</p>
                          <p className="text-xs text-gray-500">{contributor.time}</p>
                        </div>
                      </div>
                      <span className={contributor.hasVideo ? 'text-green-600 font-bold' : 'text-gray-400'}>
                        {contributor.hasVideo ? '🎥' : '💬'}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-gray-200">
                  🎥 = Dejó video-mensaje | 💬 = Solo texto
                </p>
              </Card>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Share Card */}
              <Card className="sticky top-24">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Comparte esta wishlist
                </h3>
                
                <div className="space-y-3">
                  <Button fullWidth variant="outline" onClick={shareWhatsApp} className="bg-green-500 text-white border-green-500 hover:bg-green-600">
                    <span className="mr-2">📱</span>
                    Compartir por WhatsApp
                  </Button>
                  
                  <Button fullWidth variant="outline" onClick={copyLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar link
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium mb-2">💡 Consejo</p>
                  <p className="text-xs text-blue-700">
                    Cuantas más personas compartas, más rápido se completará el regalo
                  </p>
                </div>
              </Card>

              {/* Info Card */}
              <Card className="gradient-bg text-white">
                <h3 className="font-bold text-lg mb-4">✨ ¿Cómo funciona?</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Aportas lo que quieras (mínimo $10.000)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Opcionalmente grabas un video-mensaje</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Cuando se complete, María recibe el regalo + video compilado</span>
                  </li>
                </ul>
              </Card>

              {/* Security Badge */}
              <Card className="text-center bg-green-50 border-2 border-green-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-green-900">
                  <Heart className="w-5 h-5 text-green-600" fill="currentColor" />
                  <span className="font-medium">Pagos seguros con Wompi</span>
                </div>
              </Card>

            </div>

          </div>

        </div>
      </div>

      {/* Contribute Modal */}
      <Modal
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        title="💝 Aportar al regalo"
        size="md"
      >
        <div className="space-y-6">
          
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ¿Cuánto quieres aportar?
            </label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[20000, 50000, 100000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`
                    border-2 rounded-lg p-4 text-center transition-all
                    ${selectedAmount === amount 
                      ? 'gradient-bg text-white border-primary-600' 
                      : 'border-gray-200 hover:border-primary-600'
                    }
                  `}
                >
                  <p className="text-2xl font-bold">
                    ${(amount / 1000).toFixed(0)}k
                  </p>
                </button>
              ))}
            </div>
            <input 
              type="number"
              placeholder="O ingresa otro monto (mín $10.000)"
              className="input-field"
              min="10000"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tu nombre
            </label>
            <input 
              type="text"
              placeholder="Ej: Carlos Rodríguez"
              className="input-field"
            />
            <label className="flex items-center mt-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="mr-2" />
              Aportar anónimamente
            </label>
          </div>

          {/* Video Message */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <VideoIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">¿Quieres grabar un video-mensaje?</p>
                <p className="text-sm text-gray-600 mb-3">
                  Máximo 15 segundos. Lo compilaremos con todos los videos
                </p>
                <button className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition">
                  📹 Grabar video (opcional)
                </button>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Método de pago
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button className="border-2 border-primary-600 bg-purple-50 rounded-lg p-4 text-center font-semibold text-primary-600">
                <div className="text-2xl mb-1">💳</div>
                Nequi
              </button>
              <button className="border-2 border-gray-200 rounded-lg p-4 text-center font-semibold text-gray-600 hover:border-primary-600 hover:bg-purple-50 transition">
                <div className="text-2xl mb-1">🏦</div>
                PSE
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tu aporte:</span>
              <span className="font-semibold">${(selectedAmount || 50000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Comisión (5%):</span>
              <span className="font-semibold">${((selectedAmount || 50000) * 0.05).toLocaleString()}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary-600">${((selectedAmount || 50000) * 1.05).toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button fullWidth size="lg">
            Continuar al pago
          </Button>

          <p className="text-xs text-center text-gray-500">
            Al continuar, aceptas nuestros términos y condiciones
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default WishlistPage