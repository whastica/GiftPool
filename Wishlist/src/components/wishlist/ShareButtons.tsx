import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import {
  shareOnWhatsApp,
  shareOnFacebook,
  shareOnTwitter,
  shareByEmail,
  copyToClipboard,
  share as nativeShare,
  generateShareMessage,
} from '../../utils/shareUtils'
import type { ShareOptions } from '../../types/publicWishlistTypes'

interface ShareButtonsProps {
  url: string
  title: string
  ownerName: string
  progress: number
  className?: string
}

const ShareButtons = ({ 
  url, 
  title, 
  ownerName, 
  progress, 
  className = '' 
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false)

  const shareOptions: ShareOptions = generateShareMessage(title, ownerName, progress, url)

  /**
   * Copiar link al portapapeles
   */
  const handleCopy = async () => {
    const success = await copyToClipboard(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  /**
   * Compartir usando API nativa o fallback
   */
  const handleNativeShare = () => {
    nativeShare(shareOptions)
  }

  return (
    <Card className={className}>
      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-primary-600" />
        Comparte esta wishlist
      </h3>

      {/* URL Display & Copy */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🔗 Link único
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            readOnly
            onClick={(e) => e.currentTarget.select()}
            className="flex-1 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-700 font-mono text-sm"
          />
          <Button
            onClick={handleCopy}
            variant={copied ? 'secondary' : 'outline'}
            className={copied ? 'bg-green-500 border-green-500 text-white hover:bg-green-600' : ''}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copiar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Compartir en:
        </p>

        {/* WhatsApp */}
        <button
          onClick={() => shareOnWhatsApp(shareOptions)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          <span className="text-2xl">📱</span>
          <span className="flex-1 text-left">WhatsApp</span>
        </button>

        {/* Facebook */}
        <button
          onClick={() => shareOnFacebook(shareOptions)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          <span className="text-2xl">📘</span>
          <span className="flex-1 text-left">Facebook</span>
        </button>

        {/* Twitter */}
        <button
          onClick={() => shareOnTwitter(shareOptions)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          <span className="text-2xl">🐦</span>
          <span className="flex-1 text-left">Twitter</span>
        </button>

        {/* Email */}
        <button
          onClick={() => shareByEmail(shareOptions)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          <span className="text-2xl">✉️</span>
          <span className="flex-1 text-left">Email</span>
        </button>

        {/* Native Share (Solo móviles) */}
        <button
          onClick={handleNativeShare}
          className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg md:hidden"
        >
          <Share2 className="w-5 h-5" />
          <span className="flex-1 text-left">Más opciones</span>
        </button>
      </div>

      {/* Tips */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900 font-medium mb-1">
          💡 Consejo
        </p>
        <p className="text-xs text-blue-700">
          Cuantas más personas compartas, más rápido se completará el regalo
        </p>
      </div>
    </Card>
  )
}

export default ShareButtons