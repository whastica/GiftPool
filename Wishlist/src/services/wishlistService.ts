import axios from 'axios'
import type {
  Product,
  ProductValidation,
  WishlistFormData,
  WishlistCreationResponse,
} from '../types/wishlistTypes'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Servicio para operaciones de Wishlist
 */
export const wishlistService = {
  /**
   * Valida y extrae información de un producto desde su URL
   */
  validateProductUrl: async (url: string): Promise<ProductValidation> => {
    try {
      // Validar formato de URL de MercadoLibre
      const isMercadoLibre = /mercadolibre\.com\.(co|mx|ar|br|cl)/.test(url)
      
      if (!isMercadoLibre) {
        return {
          isValid: false,
          error: 'Por ahora solo soportamos productos de MercadoLibre',
        }
      }

      // Llamar al backend para hacer scraping
      const response = await axios.post(`${API_URL}/products/scrape`, { url })

      return {
        isValid: true,
        product: response.data.product,
      }
    } catch (error: any) {
      console.error('Error validating product:', error)
      
      // Si falla el backend, usar datos de prueba en desarrollo
      if (import.meta.env.DEV) {
        return {
          isValid: true,
          product: {
            name: 'Producto de ejemplo - Audífonos Bluetooth',
            price: 899900,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            url: url,
            available: true,
            marketplace: 'mercadolibre',
            description: 'Audífonos inalámbricos con cancelación de ruido',
          },
        }
      }

      return {
        isValid: false,
        error: error.response?.data?.message || 'No pudimos cargar el producto. Verifica el link.',
      }
    }
  },

  /**
   * Calcula el monto objetivo incluyendo comisión
   */
  calculateTargetAmount: (productPrice: number, commissionRate: number = 0.05): number => {
    return Math.ceil(productPrice * (1 + commissionRate))
  },

  /**
   * Crea una nueva wishlist
   */
  createWishlist: async (data: WishlistFormData): Promise<WishlistCreationResponse> => {
    try {
      const response = await axios.post(`${API_URL}/wishlists`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      return {
        success: true,
        wishlist: response.data.wishlist,
      }
    } catch (error: any) {
      console.error('Error creating wishlist:', error)

      // Modo desarrollo: simular respuesta exitosa
      if (import.meta.env.DEV) {
        const mockWishlist = {
          id: `wl_${Date.now()}`,
          userId: 'user_123',
          slug: data.eventTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
          title: data.eventTitle,
          eventDate: data.eventDate,
          message: data.message,
          product: {} as Product, // Se llenará con los datos del producto
          targetAmount: 0,
          currentAmount: 0,
          status: 'active' as const,
          contributors: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        return {
          success: true,
          wishlist: mockWishlist,
        }
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear la wishlist. Intenta de nuevo.',
      }
    }
  },

  /**
   * Genera un slug único para la wishlist
   */
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno solo
      .substring(0, 50) // Limitar longitud
  },
}