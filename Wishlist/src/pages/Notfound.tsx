import { useNavigate } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import Button from '../components/common/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-9xl mb-6 animate-float">
          🎁
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white/90 mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="bg-white text-primary-600 hover:bg-white/90"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al inicio
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/crear-wishlist')}
            className="bg-white/20 backdrop-blur-sm text-white border-white hover:bg-white/30"
          >
            <Search className="w-5 h-5 mr-2" />
            Crear Wishlist
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound