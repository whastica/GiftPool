import type { ShareOptions } from '../types/publicWishlistTypes'

/**
 * Compartir en WhatsApp
 */
export const shareOnWhatsApp = ({ url, title, text }: ShareOptions): void => {
  const message = `${title}\n\n${text}\n\n${url}`
  const encoded = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/?text=${encoded}`
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

/**
 * Compartir en Facebook
 */
export const shareOnFacebook = ({ url }: ShareOptions): void => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  
  window.open(
    facebookUrl,
    'facebook-share-dialog',
    'width=800,height=600,left=200,top=100'
  )
}

/**
 * Compartir en Twitter
 */
export const shareOnTwitter = ({ url, title, text }: ShareOptions): void => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}&hashtags=GiftPool,RegaloGrupal`
  
  window.open(
    twitterUrl,
    'twitter-share-dialog',
    'width=800,height=600,left=200,top=100'
  )
}

/**
 * Compartir por Email
 */
export const shareByEmail = ({ url, title, text }: ShareOptions): void => {
  const subject = encodeURIComponent(title)
  const body = encodeURIComponent(`${text}\n\n${url}`)
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
  
  window.location.href = mailtoUrl
}

/**
 * Copiar al portapapeles
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    
    // Fallback para navegadores antiguos
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      return success
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
      return false
    }
  }
}

/**
 * Usar Web Share API si está disponible
 */
export const nativeShare = async ({ url, title, text }: ShareOptions): Promise<boolean> => {
  if (!navigator.share) {
    console.warn('Web Share API not supported')
    return false
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    })
    return true
  } catch (error: any) {
    // Usuario canceló o error
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error)
    }
    return false
  }
}

/**
 * Compartir con opción automática (nativo o fallback)
 */
export const share = async (options: ShareOptions): Promise<void> => {
  // Intentar usar API nativa primero (móviles)
  const nativeShareSuccess = await nativeShare(options)
  
  if (!nativeShareSuccess) {
    // Fallback: abrir menú de opciones o WhatsApp por defecto
    shareOnWhatsApp(options)
  }
}

/**
 * Generar mensaje de compartir personalizado
 */
export const generateShareMessage = (
  wishlistTitle: string,
  ownerName: string,
  progress: number,
  url: string
): ShareOptions => {
  const progressEmoji = progress >= 100 ? '🎉' : progress >= 75 ? '🔥' : progress >= 50 ? '💪' : '🎁'
  
  return {
    title: `${wishlistTitle} - GiftPool`,
    text: `${progressEmoji} ¡Ayúdame a reunir para el regalo de ${ownerName}!\n\nYa llevamos ${progress.toFixed(0)}% completado.\n\n¡Tu aporte hace la diferencia! 💝`,
    url,
  }
}