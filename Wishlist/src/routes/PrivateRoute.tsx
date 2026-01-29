import { Navigate, useLocation } from 'react-router-dom'

/**
 * PrivateRoute
 * 
 * Componente que protege rutas privadas.
 * Si el usuario no está autenticado, redirige a login.
 * 
 * TODO: En EPIC 3, integrar con useAuth hook
 */

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation()
  
  // TODO: Reemplazar con useAuth() en EPIC 3
  // Por ahora, simulamos que el usuario NO está autenticado
  const isAuthenticated = false // Cambiar a: const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    // Guardamos la ubicación a la que el usuario intentaba acceder
    // para redirigirlo después del login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default PrivateRoute