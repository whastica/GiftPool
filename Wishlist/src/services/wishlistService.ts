/**
 * Servicio para operaciones de Wishlist
 * Maneja validación de productos, creación y gestión de wishlists
 */

import axios from 'axios'
import type {
  Product,
  ProductValidation,
  WishlistFormData,
  WishlistCreationResponse,
  Wishlist,
  DashboardStats,
} from '../types/wishlistTypes'
import {
  generateWishlistId,
  generateSlug,
  calculateDashboardStats,
  getWishlistStatus,
} from '../utils/wishlistUtils'
import * as storage from './wishlistStorage'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ============================================
// PRODUCT VALIDATION
// ============================================

/**
 * Valida y extrae información de un producto desde su URL
 */
const validateProductUrl = async (url: string): Promise<ProductValidation> => {
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
      // Importar productos mock
      const {
        detectCategoryFromUrl,
        getMockProductByCategory,
        mockProductToProduct,
      } = await import('./mockProducts')

      // Detectar categoría desde la URL
      const category = detectCategoryFromUrl(url)
      
      // Obtener producto aleatorio de esa categoría
      const mockProduct = getMockProductByCategory(category)
      
      // Convertir a formato Product
      const product = mockProductToProduct(mockProduct, url)

      return {
        isValid: true,
        product: product,
      }
    }

    return {
      isValid: false,
      error:
        error.response?.data?.message ||
        'No pudimos cargar el producto. Verifica el link.',
    }
  }
}

/**
 * Calcula el monto objetivo incluyendo comisión
 */
const calculateTargetAmount = (
  productPrice: number,
  commissionRate: number = 0.05
): number => {
  return Math.ceil(productPrice * (1 + commissionRate))
}

// ============================================
// WISHLIST CREATION
// ============================================

/**
 * Crea una nueva wishlist
 */
const createWishlist = async (
  data: WishlistFormData,
  userId: string,
  productData: Product
): Promise<WishlistCreationResponse> => {
  try {
    // En desarrollo, crear wishlist localmente
    if (import.meta.env.DEV) {
      const newWishlist: Wishlist = {
        id: generateWishlistId(),
        userId: userId,
        slug: generateSlug(data.eventTitle, userId),
        title: data.eventTitle,
        eventDate: data.eventDate,
        message: data.message,
        product: productData,
        targetAmount: data.targetAmount || calculateTargetAmount(productData.price),
        currentAmount: 0,
        status: 'active',
        contributors: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Guardar en localStorage
      const savedWishlist = storage.saveWishlist(newWishlist)

      return {
        success: true,
        wishlist: savedWishlist,
      }
    }

    // En producción, llamar al backend
    const response = await axios.post(`${API_URL}/wishlists`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    // También guardar en localStorage para cache
    storage.saveWishlist(response.data.wishlist)

    return {
      success: true,
      wishlist: response.data.wishlist,
    }
  } catch (error: any) {
    console.error('Error creating wishlist:', error)

    return {
      success: false,
      error:
        error.response?.data?.message ||
        'Error al crear la wishlist. Intenta de nuevo.',
    }
  }
}

// ============================================
// WISHLIST QUERIES
// ============================================

/**
 * Obtiene todas las wishlists de un usuario
 */
const getUserWishlists = async (userId: string): Promise<Wishlist[]> => {
  try {
    // En desarrollo, obtener de localStorage
    if (import.meta.env.DEV) {
      const wishlists = storage.getUserWishlists(userId)
      
      // Actualizar estados automáticamente
      return wishlists.map((wishlist) => ({
        ...wishlist,
        status: getWishlistStatus(wishlist),
      }))
    }

    // En producción, llamar al backend
    const response = await axios.get(`${API_URL}/wishlists/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    // Guardar en localStorage para cache
    response.data.wishlists.forEach((w: Wishlist) => storage.saveWishlist(w))

    return response.data.wishlists
  } catch (error: any) {
    console.error('Error fetching user wishlists:', error)
    
    // Fallback a localStorage en caso de error
    return storage.getUserWishlists(userId)
  }
}

/**
 * Obtiene una wishlist por ID
 */
const getWishlistById = async (id: string): Promise<Wishlist | null> => {
  try {
    // Primero intentar desde localStorage
    const cached = storage.getWishlistById(id)
    if (cached && import.meta.env.DEV) {
      return {
        ...cached,
        status: getWishlistStatus(cached),
      }
    }

    // En producción, llamar al backend
    const response = await axios.get(`${API_URL}/wishlists/${id}`)
    
    // Guardar en cache
    storage.saveWishlist(response.data.wishlist)
    
    return response.data.wishlist
  } catch (error: any) {
    console.error('Error fetching wishlist:', error)
    return storage.getWishlistById(id)
  }
}

/**
 * Obtiene una wishlist pública por slug
 */
const getWishlistBySlug = async (slug: string): Promise<Wishlist | null> => {
  try {
    // Intentar desde localStorage primero
    const cached = storage.getWishlistBySlug(slug)
    if (cached && import.meta.env.DEV) {
      return {
        ...cached,
        status: getWishlistStatus(cached),
      }
    }

    // En producción, llamar al backend
    const response = await axios.get(`${API_URL}/wishlists/public/${slug}`)
    
    return response.data.wishlist
  } catch (error: any) {
    console.error('Error fetching public wishlist:', error)
    return storage.getWishlistBySlug(slug)
  }
}

// ============================================
// WISHLIST UPDATES
// ============================================

/**
 * Actualiza una wishlist
 */
const updateWishlist = async (
  id: string,
  updates: Partial<Wishlist>
): Promise<Wishlist | null> => {
  try {
    // En desarrollo, actualizar localStorage
    if (import.meta.env.DEV) {
      return storage.updateWishlist(id, updates)
    }

    // En producción, llamar al backend
    const response = await axios.patch(`${API_URL}/wishlists/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    // Actualizar cache
    storage.updateWishlist(id, response.data.wishlist)

    return response.data.wishlist
  } catch (error: any) {
    console.error('Error updating wishlist:', error)
    return null
  }
}

/**
 * Elimina una wishlist
 */
const deleteWishlist = async (id: string): Promise<boolean> => {
  try {
    // En desarrollo, eliminar de localStorage
    if (import.meta.env.DEV) {
      return storage.deleteWishlist(id)
    }

    // En producción, llamar al backend
    await axios.delete(`${API_URL}/wishlists/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    // Eliminar de cache
    storage.deleteWishlist(id)

    return true
  } catch (error: any) {
    console.error('Error deleting wishlist:', error)
    return false
  }
}

// ============================================
// STATISTICS
// ============================================

/**
 * Obtiene estadísticas del dashboard
 */
const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
  try {
    const wishlists = await getUserWishlists(userId)
    return calculateDashboardStats(wishlists)
  } catch (error: any) {
    console.error('Error calculating stats:', error)
    return {
      activeWishlists: 0,
      completed: 0,
      expired: 0,
      totalRaised: 0,
      videosReceived: 0,
      totalContributors: 0,
    }
  }
}

// ============================================
// EXPORTS
// ============================================

export const wishlistService = {
  // Product validation
  validateProductUrl,
  calculateTargetAmount,
  
  // CRUD operations
  createWishlist,
  getUserWishlists,
  getWishlistById,
  getWishlistBySlug,
  updateWishlist,
  deleteWishlist,
  
  // Statistics
  getDashboardStats,
  
  // Utilities
  generateSlug,
}