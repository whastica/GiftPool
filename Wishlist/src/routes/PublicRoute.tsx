import { Navigate } from 'react-router-dom'

/**
 * PublicRoute
 * 
 * Componente para rutas públicas.
 * Si el usuario ya está autenticado y accede a login/register,
 * lo redirige al dashboard.
 * 
 * TODO: En EPIC 3, integrar con useAuth hook
 */

interface PublicRouteProps {
  children: React.ReactNode
  restricted?: boolean // Si true, usuarios autenticados no pueden acceder
}

const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  // TODO: Reemplazar con useAuth() en EPIC 3
  const isAuthenticated = false // Cambiar a: const { isAuthenticated } = useAuth()

  if (isAuthenticated && restricted) {
    // Si está autenticado e intenta acceder a login/register,
    // redirigir al dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default PublicRoute