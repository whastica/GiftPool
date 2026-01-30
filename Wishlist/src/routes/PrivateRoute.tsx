import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // Actualizamos la ruta del hook useAuth

/**
 * PrivateRoute
 * 
 * Componente que protege rutas privadas.
 * Si el usuario no está autenticado, redirige a login.
 */

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation()
  const { isAuthenticated } = useAuth() // Usamos el estado de autenticación del contexto

  if (!isAuthenticated) {
    // Guardamos la ubicación a la que el usuario intentaba acceder
    // para redirigirlo después del login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default PrivateRoute