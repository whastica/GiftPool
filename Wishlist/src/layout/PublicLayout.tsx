import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

/**
 * PublicLayout
 * 
 * Layout para páginas públicas (accesibles sin autenticación)
 * Incluye: Navbar transparente + contenido + Footer
 * 
 * Usado en: Home, Login, Register, páginas públicas de wishlists
 */
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent={true} />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

export default PublicLayout