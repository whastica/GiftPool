import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from '../layout/PublicLayout'
import AuthLayout from '../layout/AuthLayout'
import CreateFlowLayout from '../layout/CreateFlowLayout'

// Route Guards
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

// Pages - Public
import Home from '../pages/Home'
import WishlistPage from '../pages/WishlistPage'
import CreateWishlist from '../pages/CreateWishlist'
import NotFound from '../pages/Notfound'

// Pages - Auth (TODO: Crear en EPIC 3)
import Login from '../pages/Login'
import Register from '../pages/Register'

// Pages - Private
import Dashboard from '../pages/Dashboard'

/**
 * AppRoutes
 * 
 * Configuración centralizada de todas las rutas de la aplicación.
 * Organizado en cuatro grupos:
 * 
 * 1. Rutas Públicas (con PublicLayout)
 *    - Home
 *    - Ver wishlists compartidas
 * 
 * 2. Rutas de Creación (con CreateFlowLayout - sin footer)
 *    - Crear wishlist (accesible sin login)
 * 
 * 3. Rutas de Autenticación (sin layout, restringidas si ya está logueado)
 *    - Login
 *    - Register
 * 
 * 4. Rutas Privadas (con AuthLayout, requieren autenticación)
 *    - Dashboard
 *    - Perfil
 * 
 * 5. Rutas Especiales
 *    - 404 NotFound
 *    - Redirects
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* ============================================
          RUTAS PÚBLICAS (con PublicLayout)
          ============================================ */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        {/* Página pública para ver wishlists compartidas */}
        <Route
          path="/w/:slug"
          element={
            <PublicRoute>
              <WishlistPage />
            </PublicRoute>
          }
        />
      </Route>

      {/* ============================================
          RUTAS DE CREACIÓN (con CreateFlowLayout)
          Sin footer para mantener foco en el flujo
          ============================================ */}
      <Route element={<CreateFlowLayout />}>
        <Route
          path="/crear-wishlist"
          element={
            <PublicRoute>
              <CreateWishlist />
            </PublicRoute>
          }
        />
      </Route>

      {/* ============================================
          RUTAS DE AUTENTICACIÓN (sin layout)
          Restringidas: usuarios autenticados son redirigidos al dashboard
          ============================================ */}
      <Route
        path="/login"
        element={
          <PublicRoute restricted={true}>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute restricted={true}>
            <Register />
          </PublicRoute>
        }
      />

      {/* ============================================
          RUTAS PRIVADAS (con AuthLayout)
          Requieren autenticación
          ============================================ */}
      <Route
        element={
          <PrivateRoute>
            <AuthLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rutas adicionales que puedes crear después */}
        <Route path="/mis-wishlists" element={<div>Mis Wishlists - TODO</div>} />
        <Route path="/perfil" element={<div>Perfil - TODO</div>} />
        <Route path="/configuracion" element={<div>Configuración - TODO</div>} />
      </Route>

      {/* ============================================
          RUTAS ESPECIALES
          ============================================ */}
      
      {/* 404 - Not Found */}
      <Route path="/404" element={<NotFound />} />
      
      {/* Catch all - redirige a 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRoutes