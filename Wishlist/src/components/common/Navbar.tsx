import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ transparent = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navClass = transparent 
    ? 'fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20'
    : 'bg-white border-b border-gray-200 sticky top-0 z-50';

  const linkClass = transparent
    ? 'text-white hover:text-white/80'
    : 'text-gray-700 hover:text-primary-600';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={navClass}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')} 
            className="flex items-center space-x-2 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">🎁</span>
            <span className={`text-2xl font-bold ${transparent ? 'text-white' : 'gradient-text'}`}>
              GiftPool
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`${linkClass} font-medium transition-colors`}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className={
                    transparent
                      ? 'px-4 py-2 text-white border border-white rounded-full hover:bg-white/10 transition-all'
                      : 'btn-secondary'
                  }
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <a href="#como-funciona" className={`${linkClass} font-medium transition-colors`}>
                  Cómo funciona
                </a>
                <a href="#features" className={`${linkClass} font-medium transition-colors`}>
                  Features
                </a>
                <a href="#testimonios" className={`${linkClass} font-medium transition-colors`}>
                  Testimonios
                </a>
                <button
                  onClick={() => navigate('/login')}
                  className={
                    transparent
                      ? 'px-4 py-2 text-white border border-white rounded-full hover:bg-white/10 transition-all'
                      : 'btn-secondary'
                  }
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className={
                    transparent
                      ? 'px-4 py-2 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-500 transition-all'
                      : 'btn-primary'
                  }
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden ${transparent ? 'text-white' : 'text-gray-700'}`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-secondary"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <a
                  href="#como-funciona"
                  className={`block ${linkClass} font-medium py-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cómo funciona
                </a>
                <a
                  href="#features"
                  className={`block ${linkClass} font-medium py-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#testimonios"
                  className={`block ${linkClass} font-medium py-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonios
                </a>
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-secondary"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;