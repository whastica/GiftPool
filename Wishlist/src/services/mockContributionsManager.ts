/**
 * Mock Contributions Manager (EPIC 6 + EPIC 7)
 * Gestión de contribuciones simuladas en localStorage
 */

import { saveVideoToIndexedDB } from './indexedDBService'

const MOCK_CONTRIBUTIONS_KEY = 'giftpool_mock_contributions'

export interface MockContribution {
  id: string
  name: string
  amount: number
  message: string
  isAnonymous: boolean
  createdAt: string
  videoUrl?: string
}

/**
 * Guardar contribución mock en localStorage
 */
export const saveMockContribution = async (
  wishlistId: string,
  contribution: MockContribution,
  videoBlob?: Blob
): Promise<boolean> => {
  try {
    // ✅ EPIC 7: Guardar video en IndexedDB si existe
    let videoUrl: string | undefined = undefined
    
    if (videoBlob) {
      console.log('🎥 Saving video to IndexedDB...')
      
      const saved = await saveVideoToIndexedDB(contribution.id, videoBlob)
      
      if (saved) {
        videoUrl = `indexeddb://${contribution.id}`
        console.log('✅ Video saved to IndexedDB')
      } else {
        console.warn('⚠️ Failed to save video')
      }
    }

    // Guardar contribución con videoUrl
    const contributionWithVideo = {
      ...contribution,
      videoUrl,
    }

    const stored = localStorage.getItem(MOCK_CONTRIBUTIONS_KEY)
    const contributions: Record<string, MockContribution[]> = stored ? JSON.parse(stored) : {}
    
    if (!contributions[wishlistId]) {
      contributions[wishlistId] = []
    }
    
    contributions[wishlistId].push(contributionWithVideo)
    
    localStorage.setItem(MOCK_CONTRIBUTIONS_KEY, JSON.stringify(contributions))
    
    console.log('✅ Mock contribution saved:', contributionWithVideo)
    return true
  } catch (error) {
    console.error('❌ Error saving mock contribution:', error)
    return false
  }
}

/**
 * Obtener contribuciones de una wishlist
 */
export const getMockContributions = (wishlistId: string): MockContribution[] => {
  try {
    const stored = localStorage.getItem(MOCK_CONTRIBUTIONS_KEY)
    if (!stored) return []
    
    const contributions: Record<string, MockContribution[]> = JSON.parse(stored)
    return contributions[wishlistId] || []
  } catch (error) {
    console.error('❌ Error loading mock contributions:', error)
    return []
  }
}

/**
 * Limpiar todas las contribuciones
 */
export const clearMockContributions = (): void => {
  localStorage.removeItem(MOCK_CONTRIBUTIONS_KEY)
  console.log('🗑️ Mock contributions cleared')
}