/**
 * Hook para compartir wishlists
 * Maneja copiar link, compartir en WhatsApp y otras redes sociales
 */

import { useState, useCallback } from 'react'

interface UseShareWishlistReturn {
  isCopied: boolean
  copyLink: (slug: string) => Promise<boolean>
  shareWhatsApp: (slug: string, title: string) => void
  shareFacebook: (slug: string) => void
  shareTwitter: (slug: string, title: string) => void
  shareEmail: (slug: string, title: string) => void
  getShareUrl: (slug: string) => string
}

const BASE_URL = window.location.origin

export const useShareWishlist = (): UseShareWishlistReturn => {
  const [isCopied, setIsCopied] = useState(false)

  /**
   * Genera la URL completa de la wishlist
   */
  const getShareUrl = useCallback((slug: string): string => {
    return `${BASE_URL}/w/${slug}`
  }, [])

  /**
   * Copia el link al portapapeles
   */
  const copyLink = useCallback(
    async (slug: string): Promise<boolean> => {
      const url = getShareUrl(slug)

      try {
        await navigator.clipboard.writeText(url)
        setIsCopied(true)

        // Reset después de 2 segundos
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)

        return true
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        
        // Fallback para navegadores que no soportan clipboard API
        try {
          const textArea = document.createElement('textarea')
          textArea.value = url
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 2000)
          
          return true
        } catch (fallbackError) {
          console.error('Fallback copy failed:', fallbackError)
          return false
        }
      }
    },
    [getShareUrl]
  )

  /**
   * Comparte en WhatsApp
   */
  const shareWhatsApp = useCallback(
    (slug: string, title: string) => {
      const url = getShareUrl(slug)
      const text = encodeURIComponent(
        `🎁 ¡Ayúdame a reunir para "${title}"!\n\n${url}`
      )
      const whatsappUrl = `https://wa.me/?text=${text}`
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    },
    [getShareUrl]
  )

  /**
   * Comparte en Facebook
   */
  const shareFacebook = useCallback(
    (slug: string) => {
      const url = getShareUrl(slug)
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`
      window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
    },
    [getShareUrl]
  )

  /**
   * Comparte en Twitter
   */
  const shareTwitter = useCallback(
    (slug: string, title: string) => {
      const url = getShareUrl(slug)
      const text = encodeURIComponent(
        `🎁 ¡Ayúdame a reunir para "${title}"! ${url}`
      )
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`
      window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
    },
    [getShareUrl]
  )

  /**
   * Comparte por Email
   */
  const shareEmail = useCallback(
    (slug: string, title: string) => {
      const url = getShareUrl(slug)
      const subject = encodeURIComponent(`🎁 Ayúdame con: ${title}`)
      const body = encodeURIComponent(
        `Hola,\n\n¡Necesito tu ayuda para reunir este regalo!\n\n${title}\n\nPuedes contribuir aquí: ${url}\n\n¡Gracias! 🎉`
      )
      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
      window.location.href = mailtoUrl
    },
    [getShareUrl]
  )

  return {
    isCopied,
    copyLink,
    shareWhatsApp,
    shareFacebook,
    shareTwitter,
    shareEmail,
    getShareUrl,
  }
}

export default useShareWishlist