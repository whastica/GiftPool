import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, User, LogOut, Gift } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

/**
 * AuthLayout
 * 
 * Layout para páginas privadas (requieren autenticación)
 * Incluye: Sidebar/Header de navegación + contenido principal
 * 
 * Usado en: Dashboard, Profile, Settings, CreateWishlist (si es privado)
 */
const AuthLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  // Función para verificar si una ruta está activa
  const isActive = (path: string) => location.pathname === path

  // Handler para logout
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar para usuarios autenticados */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <span className="text-3xl group-hover:scale-110 transition-transform">🎁</span>
              <span className="text-2xl font-bold gradient-text">GiftPool</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/mis-wishlists"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/mis-wishlists')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span>Mis Wishlists</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/perfil"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline font-medium">{user?.name || 'Perfil'}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer minimalista para páginas autenticadas */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p>© 2025 GiftPool. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary-600 transition">Ayuda</a>
              <a href="#" className="hover:text-primary-600 transition">Términos</a>
              <a href="#" className="hover:text-primary-600 transition">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuthLayout