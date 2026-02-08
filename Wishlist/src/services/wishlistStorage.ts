/**
 * Storage module para wishlists
 * Maneja la persistencia en localStorage
 */

import type { Wishlist } from '../types/wishlistTypes'

const STORAGE_KEY = 'giftpool_wishlists'

// ============================================
// STORAGE OPERATIONS
// ============================================

/**
 * Obtiene todas las wishlists del localStorage
 */
export const getAllWishlists = (): Wishlist[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading wishlists from localStorage:', error)
    return []
  }
}

/**
 * Obtiene wishlists de un usuario específico
 */
export const getUserWishlists = (userId: string): Wishlist[] => {
  const allWishlists = getAllWishlists()
  return allWishlists.filter((w) => w.userId === userId)
}

/**
 * Obtiene una wishlist por ID
 */
export const getWishlistById = (id: string): Wishlist | null => {
  const wishlists = getAllWishlists()
  return wishlists.find((w) => w.id === id) || null
}

/**
 * Obtiene una wishlist por slug
 */
export const getWishlistBySlug = (slug: string): Wishlist | null => {
  const wishlists = getAllWishlists()
  return wishlists.find((w) => w.slug === slug) || null
}

/**
 * Guarda una nueva wishlist
 */
export const saveWishlist = (wishlist: Wishlist): Wishlist => {
  try {
    const wishlists = getAllWishlists()
    
    // Verificar si ya existe
    const existingIndex = wishlists.findIndex((w) => w.id === wishlist.id)
    
    if (existingIndex >= 0) {
      // Actualizar existente
      wishlists[existingIndex] = {
        ...wishlist,
        updatedAt: new Date().toISOString(),
      }
    } else {
      // Agregar nueva
      wishlists.push(wishlist)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists))
    return wishlist
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error)
    throw new Error('No se pudo guardar la wishlist')
  }
}

/**
 * Actualiza una wishlist existente
 */
export const updateWishlist = (
  id: string,
  updates: Partial<Wishlist>
): Wishlist | null => {
  try {
    const wishlists = getAllWishlists()
    const index = wishlists.findIndex((w) => w.id === id)

    if (index === -1) {
      return null
    }

    wishlists[index] = {
      ...wishlists[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists))
    return wishlists[index]
  } catch (error) {
    console.error('Error updating wishlist:', error)
    return null
  }
}

/**
 * Elimina una wishlist
 */
export const deleteWishlist = (id: string): boolean => {
  try {
    const wishlists = getAllWishlists()
    const filtered = wishlists.filter((w) => w.id !== id)

    if (filtered.length === wishlists.length) {
      // No se encontró la wishlist
      return false
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting wishlist:', error)
    return false
  }
}

/**
 * Agrega un contributor a una wishlist
 */
export const addContributor = (
  wishlistId: string,
  contributor: {
    id: string
    name: string
    amount: number
    message?: string
    videoUrl?: string
    isAnonymous: boolean
    createdAt: string
  }
): Wishlist | null => {
  try {
    const wishlist = getWishlistById(wishlistId)
    if (!wishlist) return null

    const updatedWishlist = {
      ...wishlist,
      contributors: [...wishlist.contributors, contributor],
      currentAmount: wishlist.currentAmount + contributor.amount,
      updatedAt: new Date().toISOString(),
    }

    // Actualizar estado si se completó
    if (updatedWishlist.currentAmount >= updatedWishlist.targetAmount) {
      updatedWishlist.status = 'completed'
    }

    return updateWishlist(wishlistId, updatedWishlist)
  } catch (error) {
    console.error('Error adding contributor:', error)
    return null
  }
}

/**
 * Limpia todas las wishlists (útil para testing)
 */
export const clearAllWishlists = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing wishlists:', error)
  }
}

/**
 * Exporta wishlists a JSON
 */
export const exportWishlists = (): string => {
  const wishlists = getAllWishlists()
  return JSON.stringify(wishlists, null, 2)
}

/**
 * Importa wishlists desde JSON
 */
export const importWishlists = (jsonData: string): boolean => {
  try {
    const wishlists = JSON.parse(jsonData)
    if (!Array.isArray(wishlists)) {
      throw new Error('Invalid data format')
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists))
    return true
  } catch (error) {
    console.error('Error importing wishlists:', error)
    return false
  }
}