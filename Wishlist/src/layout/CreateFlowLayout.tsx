import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

/**
 * CreateFlowLayout
 * 
 * Layout especial para flujos de creación (wizards, formularios multi-paso)
 * Incluye: Navbar + contenido
 * NO incluye: Footer (para evitar distracciones)
 * 
 * Usado en: CreateWishlist, cualquier otro flujo de creación
 */
const CreateFlowLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar transparent={false} />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Intencionalmente SIN Footer - mantener al usuario enfocado en el flujo */}
    </div>
  )
}

export default CreateFlowLayout