import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth' // Actualizamos la ruta del hook useAuth

/**
 * PublicRoute
 * 
 * Componente para rutas públicas.
 * Si el usuario ya está autenticado y accede a login/register,
 * lo redirige al dashboard.
 */

interface PublicRouteProps {
  children: React.ReactNode
  restricted?: boolean // Si true, usuarios autenticados no pueden acceder
}

const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth() // Usamos el estado de autenticación del contexto

  if (isAuthenticated && restricted) {
    // Si está autenticado e intenta acceder a login/register,
    // redirigir al dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default PublicRoute