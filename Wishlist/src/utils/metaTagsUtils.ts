import type { PublicWishlist, WishlistMetaTags } from '../types/publicWishlistTypes'

/**
 * Generar meta tags para SEO y redes sociales
 */
export const generateMetaTags = (wishlist: PublicWishlist): WishlistMetaTags => {
  const baseUrl = window.location.origin
  const url = `${baseUrl}/w/${wishlist.slug}`
  
  const title = `${wishlist.title} - Regalo para ${wishlist.ownerName} | GiftPool`
  const description = wishlist.message.slice(0, 160) + '...'
  const image = wishlist.product.image

  return {
    title,
    description,
    image,
    url,
    siteName: 'GiftPool',
    type: 'website',
  }
}

/**
 * Actualizar meta tags en el DOM
 */
export const updateMetaTags = (tags: WishlistMetaTags): void => {
  // Title
  document.title = tags.title

  // Description
  updateMetaTag('name', 'description', tags.description)

  // Open Graph
  updateMetaTag('property', 'og:title', tags.title)
  updateMetaTag('property', 'og:description', tags.description)
  updateMetaTag('property', 'og:image', tags.image)
  updateMetaTag('property', 'og:url', tags.url)
  updateMetaTag('property', 'og:type', tags.type)
  updateMetaTag('property', 'og:site_name', tags.siteName)

  // Twitter
  updateMetaTag('name', 'twitter:card', 'summary_large_image')
  updateMetaTag('name', 'twitter:title', tags.title)
  updateMetaTag('name', 'twitter:description', tags.description)
  updateMetaTag('name', 'twitter:image', tags.image)

  // Facebook
  updateMetaTag('property', 'fb:app_id', 'YOUR_FB_APP_ID') // Reemplazar con tu FB App ID
}

/**
 * Helper para actualizar o crear meta tag
 */
function updateMetaTag(attr: string, key: string, content: string): void {
  let element = document.querySelector(`meta[${attr}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

/**
 * Limpiar meta tags al desmontar componente
 */
export const clearMetaTags = (): void => {
  // Restaurar título por defecto
  document.title = 'GiftPool - Regalos grupales hechos simples'

  // Restaurar description por defecto
  updateMetaTag(
    'name',
    'description',
    'Organiza regalos grupales con transparencia total y video-mensajes emocionales. ¡Aporta, regala, emociona!'
  )
}

/**
 * Generar datos estructurados (JSON-LD) para SEO
 */
export const generateStructuredData = (wishlist: PublicWishlist) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: wishlist.product.name,
    description: wishlist.message,
    image: wishlist.product.image,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'COP',
      lowPrice: wishlist.product.price,
      highPrice: wishlist.targetAmount,
      offerCount: wishlist.contributorsCount,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: wishlist.contributorsCount,
    },
  }
}

/**
 * Insertar JSON-LD en el DOM
 */
export const insertStructuredData = (wishlist: PublicWishlist): void => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(generateStructuredData(wishlist))
  script.id = 'wishlist-structured-data'

  // Remover script anterior si existe
  const existing = document.getElementById('wishlist-structured-data')
  if (existing) {
    existing.remove()
  }

  document.head.appendChild(script)
}

/**
 * Limpiar datos estructurados
 */
export const clearStructuredData = (): void => {
  const script = document.getElementById('wishlist-structured-data')
  if (script) {
    script.remove()
  }
}