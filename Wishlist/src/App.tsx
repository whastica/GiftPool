import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateWishlist from './pages/CreateWishlist'
import WishlistPage from './pages/WishlistPage'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/Notfound'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear-wishlist" element={<CreateWishlist />} />
        <Route path="/w/:slug" element={<WishlistPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App