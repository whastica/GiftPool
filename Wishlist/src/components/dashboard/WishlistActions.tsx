import { useState } from 'react'
import { ExternalLink, Copy, Share2, Video, Trash2, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import useShareWishlist from '../../hooks/useShareWishlist'
import type { WishlistListItem } from '../../types/wishlistTypes'

interface WishlistActionsProps {
  wishlist: WishlistListItem
  onDelete?: (id: string) => void
}

const WishlistActions = ({ wishlist, onDelete }: WishlistActionsProps) => {
  const navigate = useNavigate()
  const { isCopied, copyLink, shareWhatsApp } = useShareWishlist()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleCopy = async () => {
    await copyLink(wishlist.slug)
  }

  const handleShare = () => {
    shareWhatsApp(wishlist.slug, wishlist.title)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(wishlist.id)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Ver wishlist */}
      <Button
        variant="secondary"
        size="sm"
        fullWidth
        onClick={() => navigate(`/w/${wishlist.slug}`)} // ✅ FIX: Paréntesis
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Ver wishlist
      </Button>

      {/* Copiar link */}
      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={handleCopy}
        className={isCopied ? 'bg-green-50 border-green-500 text-green-600' : ''}
      >
        {isCopied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            ¡Copiado!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copiar link
          </>
        )}
      </Button>

      {/* Compartir WhatsApp - ✅ YA TIENE COLOR VERDE */}
      <Button
        variant="success"
        size="sm"
        fullWidth
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Compartir
      </Button>

      {/* Ver videos (solo si hay videos) */}
      {wishlist.status === 'completed' && wishlist.hasVideos && (
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          className="text-purple-600 hover:bg-purple-50"
          onClick={() => navigate(`/w/${wishlist.slug}#videos`)} // ✅ FIX: Paréntesis
        >
          <Video className="w-4 h-4 mr-2" />
          Ver videos
        </Button>
      )}

      {/* Eliminar (solo si no está completada) */}
      {wishlist.status !== 'completed' && !showDeleteConfirm && (
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          className="text-red-600 hover:bg-red-50 mt-2"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Eliminar
        </Button>
      )}

      {/* Confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
          <p className="text-sm text-red-800 font-medium">
            ¿Seguro que quieres eliminar?
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              fullWidth
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WishlistActions