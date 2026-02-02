import { useState } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface ShareStepProps {
  wishlistSlug: string
  wishlistTitle: string
  onGoToDashboard: () => void
  onCreateAnother: () => void
}

const ShareStep = ({
  wishlistSlug,
  wishlistTitle,
  onGoToDashboard,
  onCreateAnother,
}: ShareStepProps) => {
  const [copied, setCopied] = useState(false)

  const wishlistUrl = `${window.location.origin}/w/${wishlistSlug}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(wishlistUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('No se pudo copiar el enlace')
    }
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎁 ¡Ayúdame a conseguir mi regalo! ${wishlistTitle}\n\n${wishlistUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareInstagram = () => {
    // Instagram no permite deep linking directo con texto
    // Mostrar modal con instrucciones
    alert('¡Copia el link y compártelo en tu historia de Instagram!')
    copyLink()
  }

  const shareEmail = () => {
    const subject = encodeURIComponent(`🎁 ${wishlistTitle}`)
    const body = encodeURIComponent(
      `Hola,\n\n¡Ayúdame a conseguir mi regalo!\n\nMira mi wishlist aquí: ${wishlistUrl}\n\n¡Gracias!`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="text-center py-4">
          <div className="text-6xl mb-4 animate-bounce">🎊</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            ¡Tu wishlist está lista!
          </h3>
          <p className="text-green-700 text-lg">
            Ahora solo falta compartirla con tus amigos
          </p>
        </div>
      </Card>

      {/* Link Display */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🔗 Tu link único
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={wishlistUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-700 font-mono text-sm"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            onClick={copyLink}
            variant={copied ? 'secondary' : 'primary'}
            className={copied ? 'bg-green-500 border-green-500 text-white' : ''}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copiar
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Comparte este link para que tus amigos puedan colaborar
        </p>
      </div>

      {/* Share Buttons */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <Share2 className="inline w-4 h-4 mr-1" />
          Compartir en redes sociales
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center justify-center py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="text-3xl mb-2">📱</span>
            <span className="text-sm">WhatsApp</span>
          </button>

          <button
            onClick={shareInstagram}
            className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="text-3xl mb-2">📸</span>
            <span className="text-sm">Instagram</span>
          </button>

          <button
            onClick={shareEmail}
            className="flex flex-col items-center justify-center py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <span className="text-3xl mb-2">✉️</span>
            <span className="text-sm">Email</span>
          </button>
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          Próximos pasos
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">1️⃣</span>
            <span>Comparte tu wishlist con amigos y familiares</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2️⃣</span>
            <span>Ellos podrán aportar la cantidad que deseen</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3️⃣</span>
            <span>Cuando se complete el monto, compramos y te enviamos el producto</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">4️⃣</span>
            <span>¡Disfruta tu regalo y los videos de tus colaboradores! 🎉</span>
          </li>
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="secondary"
          fullWidth
          onClick={onCreateAnother}
        >
          ➕ Crear otra wishlist
        </Button>
        <Button
          fullWidth
          onClick={onGoToDashboard}
        >
          Ver mi dashboard →
        </Button>
      </div>

      {/* Stats Preview */}
      <Card className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <h3 className="font-bold text-lg mb-4">📊 ¿Sabías que...?</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold mb-1">95%</p>
            <p className="text-xs opacity-90">Tasa de éxito</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">3</p>
            <p className="text-xs opacity-90">Días promedio</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-1">12</p>
            <p className="text-xs opacity-90">Colaboradores</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ShareStep