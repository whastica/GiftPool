/**
 * Servicio para wishlists públicas
 * Maneja la carga y visualización de wishlists sin autenticación
 * ACTUALIZADO: Ahora carga datos reales desde localStorage
 */

import type { PublicWishlist } from '../types/publicWishlistTypes'
import type { Wishlist } from '../types/wishlistTypes'
import * as storage from './wishlistStorage'

// ============================================
// TRANSFORMACIONES
// ============================================

/**
 * Convierte Wishlist a PublicWishlist
 * (Formato específico para la vista pública)
 */
const wishlistToPublicWishlist = (wishlist: Wishlist): PublicWishlist => {
  return {
    id: wishlist.id,
    slug: wishlist.slug,
    title: wishlist.title,
    message: wishlist.message,
    eventDate: wishlist.eventDate,
    product: wishlist.product,
    targetAmount: wishlist.targetAmount,
    currentAmount: wishlist.currentAmount,
    status: wishlist.status,
    contributors: wishlist.contributors,
    contributorsCount: wishlist.contributors.length,
    createdAt: wishlist.createdAt,
    expiresAt: wishlist.expiresAt,
    // Datos adicionales para vista pública
    ownerName: 'Usuario', // TODO: obtener nombre real del usuario
    views: 0, // TODO: implementar tracking de vistas
  }
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Obtiene una wishlist pública por slug
 */
const getBySlug = async (slug: string): Promise<PublicWishlist> => {
  try {
    // Intentar cargar desde localStorage/storage
    const wishlist = storage.getWishlistBySlug(slug)

    if (!wishlist) {
      throw new Error('Wishlist no encontrada')
    }

    // Convertir a formato público
    const publicWishlist = wishlistToPublicWishlist(wishlist)

    return publicWishlist
  } catch (error: any) {
    console.error('Error loading public wishlist:', error)
    throw new Error(
      error.message || 'No se pudo cargar la wishlist. Verifica el link.'
    )
  }
}

/**
 * Registra una vista de la wishlist
 * (Para analytics - implementación futura)
 */
const trackView = (wishlistId: string): void => {
  try {
    // TODO: Implementar tracking de vistas
    // Por ahora solo logueamos
    console.log(`📊 View tracked for wishlist: ${wishlistId}`)

    // En el futuro aquí se podría:
    // 1. Incrementar contador en localStorage
    // 2. Enviar evento a analytics
    // 3. Guardar en backend
  } catch (error) {
    console.error('Error tracking view:', error)
    // No lanzar error - el tracking no debe romper la app
  }
}

/**
 * Obtiene wishlists relacionadas (recomendaciones)
 * Por ahora retorna array vacío - feature futura
 */
const getRelated = async (
  wishlistId: string,
  limit: number = 3
): Promise<PublicWishlist[]> => {
  try {
    // TODO: Implementar algoritmo de recomendación
    // Por ahora retornar array vacío
    return []
  } catch (error) {
    console.error('Error getting related wishlists:', error)
    return []
  }
}

// ============================================
// EXPORTS
// ============================================

export const publicWishlistService = {
  getBySlug,
  trackView,
  getRelated,
}

export default publicWishlistService