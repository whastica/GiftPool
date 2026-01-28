import { useNavigate } from 'react-router-dom'
import { Video, Shield, Sparkles } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Button from '../components/common/Button'
import Card from '../components/common/Card'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 -bottom-20 -right-20"></div>
          <div className="absolute w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 top-1/2 left-1/2"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Emoji Icon */}
            <div className="animate-float mb-6">
              <span className="text-8xl">🎉</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Regalos grupales <br />
              <span className="font-handwritten text-yellow-300">hechos simples</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-up animation-delay-200">
              Aporta, regala, emociona. <br />
              Organiza vacas con transparencia total y un toque emocional único.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-400">
              <Button
                size="lg"
                onClick={() => navigate('/crear-wishlist')}
                className="bg-white text-primary-600 hover:bg-white/90"
              >
                🎁 Crear mi Wishlist gratis
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm text-white border-white hover:bg-white/30"
              >
                Ver demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 animate-fade-in-up animation-delay-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-yellow-300" />
                <span className="font-medium">100% Transparente</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-green-300" />
                <span className="font-medium">Pagos seguros</span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-pink-300" />
                <span className="font-medium">+ Video emocional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Cómo Funciona Section */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Tan fácil como 1, 2, 3</span>
            </h2>
            <p className="text-xl text-gray-600">Organiza tu regalo grupal en minutos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <Card hover className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 text-center">
              <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-900">1. Elige tu regalo</h3>
              <p className="text-gray-700 leading-relaxed">
                Pega el link del producto de MercadoLibre que quieres y personaliza tu wishlist con un mensaje especial.
              </p>
            </Card>

            {/* Step 2 */}
            <Card hover className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-900">2. Comparte con todos</h3>
              <p className="text-gray-700 leading-relaxed">
                Envía el link por WhatsApp, Instagram o donde quieras. Tus amigos aportan fácil con Nequi o tarjeta.
              </p>
            </Card>

            {/* Step 3 */}
            <Card hover className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 text-center">
              <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-900">3. Recibe + Video</h3>
              <p className="text-gray-700 leading-relaxed">
                Cuando se complete, compramos automáticamente. PLUS: Recibes un video con los mensajes de todos.
              </p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/crear-wishlist')}>
              Empezar ahora - Es gratis 🚀
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Por qué elegir <span className="gradient-text">GiftPool</span>
            </h2>
            <p className="text-xl text-gray-600">Más que una vaca, una experiencia completa</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} hover>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section id="testimonios" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Lo que dicen nuestros <span className="gradient-text">usuarios</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-purple-50 border-2 border-purple-100">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {testimonial.initial}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                <div className="flex">
                  <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para hacer regalos inolvidables?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a cientos de personas que ya están organizando sus regalos grupales de forma simple y emocional.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/crear-wishlist')}
            className="bg-white text-primary-600 hover:bg-white/90"
          >
            Crear mi primera Wishlist 🎁
          </Button>
          <p className="text-white/80 mt-4">Gratis para siempre · Sin tarjeta de crédito</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Data
const features = [
  {
    icon: '💸',
    title: 'Transparencia Total',
    description: 'Ve en tiempo real cuánto se ha recaudado y quién ha aportado.'
  },
  {
    icon: '🎥',
    title: 'Video-Mensajes',
    description: 'Cada persona deja un video que se compila en un regalo emocional.'
  },
  {
    icon: '🤖',
    title: 'Compra Automática',
    description: 'Al completar la meta, compramos y enviamos automáticamente.'
  },
  {
    icon: '🔒',
    title: 'Pagos Seguros',
    description: 'Nequi, Daviplata, PSE o tarjeta. 100% seguro con Wompi.'
  },
  {
    icon: '📊',
    title: 'Dashboard Personal',
    description: 'Gestiona todas tus wishlists desde un solo lugar.'
  },
  {
    icon: '📲',
    title: 'Fácil de Compartir',
    description: 'Un solo link para WhatsApp, Instagram, email o QR code.'
  },
  {
    icon: '⚡',
    title: 'Sin Registro Obligatorio',
    description: 'Los colaboradores aportan sin crear cuenta.'
  },
  {
    icon: '🎉',
    title: 'Para Toda Ocasión',
    description: 'Cumpleaños, baby showers, despedidas, graduaciones y más.'
  }
]

const testimonials = [
  {
    name: 'María García',
    location: 'Bogotá',
    initial: 'M',
    color: 'bg-purple-600',
    quote: 'Organizar el regalo de cumpleaños de mi esposo fue súper fácil. El video con los mensajes de todos lo hizo llorar. ¡Increíble!'
  },
  {
    name: 'Carlos Rodríguez',
    location: 'Medellín',
    initial: 'C',
    color: 'bg-blue-600',
    quote: 'Para el baby shower de mi hermana fue perfecto. 25 personas aportaron en 3 días. Mucho mejor que andar pidiendo por WhatsApp.'
  },
  {
    name: 'Andrea López',
    location: 'Cali',
    initial: 'A',
    color: 'bg-pink-600',
    quote: 'Me encantó poder aportar con Nequi. Todo transparente, vi exactamente cuánto faltaba. La experiencia fue muy profesional.'
  }
]

export default Home