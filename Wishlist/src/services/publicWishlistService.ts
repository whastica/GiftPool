import api from './api'
import type { PublicWishlist, ContributeFormData } from '../types/publicWishlistTypes'

/**
 * Servicio para operaciones públicas de wishlists
 * No requieren autenticación
 */
export const publicWishlistService = {
  /**
   * Obtener wishlist pública por slug
   */
  getBySlug: async (slug: string): Promise<PublicWishlist> => {
    try {
      const response = await api.get(`/wishlists/public/${slug}`)
      return response.data.wishlist
    } catch (error: any) {
      console.error('Error fetching wishlist:', error)
      
      // En modo desarrollo, retornar datos mock
      if (import.meta.env.DEV) {
        return getMockWishlist(slug)
      }
      
      throw new Error(error.response?.data?.message || 'No se pudo cargar la wishlist')
    }
  },

  /**
   * Crear contribución a una wishlist
   */
  contribute: async (
    wishlistId: string, 
    data: ContributeFormData
  ): Promise<{ success: boolean; contributionId?: string }> => {
    try {
      const response = await api.post(`/wishlists/${wishlistId}/contribute`, data)
      return {
        success: true,
        contributionId: response.data.contribution.id,
      }
    } catch (error: any) {
      console.error('Error creating contribution:', error)
      
      // En modo desarrollo, simular éxito
      if (import.meta.env.DEV) {
        return {
          success: true,
          contributionId: `contrib_${Date.now()}`,
        }
      }
      
      throw new Error(error.response?.data?.message || 'Error al realizar la contribución')
    }
  },

  /**
   * Registrar visualización de wishlist (analytics)
   */
  trackView: async (wishlistId: string): Promise<void> => {
    try {
      await api.post(`/wishlists/${wishlistId}/view`)
    } catch (error) {
      // Silent fail - no es crítico
      console.debug('Error tracking view:', error)
    }
  },
}

/**
 * Mock data para desarrollo
 */
function getMockWishlist(slug: string): PublicWishlist {
  const now = new Date()
  const eventDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 días adelante
  
  return {
    id: 'wl_mock_123',
    slug: slug,
    title: 'Cumpleaños de María',
    eventDate: eventDate.toISOString(),
    message: 'Hola amigos! Siempre he querido unos audífonos de alta calidad para disfrutar mi música favorita. Estos Sony son los mejores del mercado y serían el regalo perfecto para mi cumpleaños. ¡Gracias por ayudarme a cumplir este sueño! 🎧💜',
    ownerName: 'María García',
    ownerAvatar: undefined,
    product: {
      id: 'prod_123',
      name: 'Audífonos Bluetooth Sony WH-1000XM5',
      description: 'Audífonos inalámbricos con cancelación de ruido líder en la industria',
      price: 899900,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      url: 'https://mercadolibre.com.co/...',
      marketplace: 'MercadoLibre',
      available: true,
    },
    targetAmount: 944895, // Precio + 5% comisión
    currentAmount: 680000,
    status: 'active',
    contributorsCount: 8,
    contributors: [
      {
        id: '1',
        name: 'Carlos Rodríguez',
        amount: 150000,
        message: '¡Feliz cumpleaños María! Que disfrutes mucho tu regalo 🎉',
        videoUrl: 'https://example.com/video1.mp4',
        isAnonymous: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        name: 'Andrea López',
        amount: 100000,
        message: 'Te quiero mucho amiga, espero que llegues a tu meta pronto 💕',
        videoUrl: 'https://example.com/video2.mp4',
        isAnonymous: false,
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        name: 'Juan Martínez',
        amount: 80000,
        isAnonymous: false,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        name: 'Laura Gómez',
        amount: 120000,
        message: '¡Muchas felicidades! 🎊',
        videoUrl: 'https://example.com/video4.mp4',
        isAnonymous: false,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        name: 'Anónimo',
        amount: 50000,
        isAnonymous: true,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        name: 'Pedro Silva',
        amount: 70000,
        message: 'Que lo disfrutes mucho!',
        isAnonymous: false,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '7',
        name: 'Sofía Ramírez',
        amount: 60000,
        isAnonymous: false,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '8',
        name: 'Anónimo',
        amount: 50000,
        isAnonymous: true,
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: eventDate.toISOString(),
  }
}

export default publicWishlistService