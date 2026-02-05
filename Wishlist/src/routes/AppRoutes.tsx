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
import WishlistPage from '../pages/PublicWishlistPage'
import CreateWishlist from '../pages/CreateWishlist'
import CreateWishlistPage from '../pages/CreateWishlist'
import NotFound from '../pages/Notfound'

// Pages - Auth
import Login from '../pages/Login'
import Register from '../pages/Register'

// Pages - Private
import Dashboard from '../pages/Dashboard'

// Pages - Contribute (EPIC 6)
import ContributePage from '../pages/ContributePage'
import ContributeSuccessPage from '../pages/ContributeSuccessPage'

/**
 * AppRoutes - ACTUALIZADO CON EPIC 6
 * 
 * NUEVAS RUTAS AGREGADAS:
 * - /contribute/checkout/:contributionId - Página de checkout
 * - /contribute/success/:contributionId - Página de confirmación
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
        
        {/* ============================================
            RUTAS DE CONTRIBUCIÓN (EPIC 6)
            Públicas - no requieren autenticación
            ============================================ */}
        
        {/* Checkout de contribución */}
        <Route
          path="/contribute/checkout/:contributionId"
          element={
            <PublicRoute>
              <ContributePage />
            </PublicRoute>
          }
        />
        
        {/* Confirmación de contribución exitosa */}
        <Route
          path="/contribute/success/:contributionId"
          element={
            <PublicRoute>
              <ContributeSuccessPage />
            </PublicRoute>
          }
        />
      </Route>

      {/* ============================================
          RUTAS DE CREACIÓN (con CreateFlowLayout)
          Sin footer para mantener foco en el flujo
          ============================================ */}
      <Route element={<CreateFlowLayout />}>
        {/* DEPRECATED: Versión antigua sin wizard completo */}
        <Route
          path="/crear-wishlist"
          element={
            <PublicRoute>
              <CreateWishlist />
            </PublicRoute>
          }
        />
        
        {/* NUEVO: Wizard completo de creación (EPIC 4) - Requiere autenticación */}
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateWishlistPage />
            </PrivateRoute>
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
        
        {/* Rutas adicionales */}
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