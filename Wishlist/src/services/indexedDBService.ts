/**
 * IndexedDB Service (EPIC 7)
 * Servicio para almacenar videos en IndexedDB con persistencia local
 */

const DB_NAME = 'GiftPoolVideos'
const DB_VERSION = 1
const STORE_NAME = 'videos'

interface VideoRecord {
  contributionId: string
  blob: Blob
  url: string
  uploadedAt: string
}

/**
 * Inicializar base de datos IndexedDB
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('❌ Error opening IndexedDB:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      console.log('✅ IndexedDB opened successfully')
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Crear object store si no existe
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'contributionId',
        })
        
        objectStore.createIndex('uploadedAt', 'uploadedAt', { unique: false })
        
        console.log('🗄️ Object store created:', STORE_NAME)
      }
    }
  })
}

/**
 * Guardar video en IndexedDB
 */
export const saveVideoToIndexedDB = async (
  contributionId: string,
  blob: Blob
): Promise<boolean> => {
  try {
    const db = await initDB()
    
    const url = URL.createObjectURL(blob)
    
    const videoRecord: VideoRecord = {
      contributionId,
      blob,
      url,
      uploadedAt: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.put(videoRecord)

      request.onsuccess = () => {
        console.log('✅ Video saved to IndexedDB:', contributionId)
        resolve(true)
      }

      request.onerror = () => {
        console.error('❌ Error saving video:', request.error)
        reject(request.error)
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error('❌ Error in saveVideoToIndexedDB:', error)
    return false
  }
}

/**
 * Obtener video desde IndexedDB
 */
export const getVideoFromIndexedDB = async (
  contributionId: string
): Promise<VideoRecord | null> => {
  try {
    const db = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.get(contributionId)

      request.onsuccess = () => {
        const result = request.result as VideoRecord | undefined
        
        if (result) {
          console.log('✅ Video retrieved from IndexedDB:', contributionId)
          resolve(result)
        } else {
          console.log('⚠️ Video not found in IndexedDB:', contributionId)
          resolve(null)
        }
      }

      request.onerror = () => {
        console.error('❌ Error retrieving video:', request.error)
        reject(request.error)
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error('❌ Error in getVideoFromIndexedDB:', error)
    return null
  }
}

/**
 * Obtener múltiples videos desde IndexedDB
 */
export const getMultipleVideosFromIndexedDB = async (
  contributionIds: string[]
): Promise<Record<string, string>> => {
  try {
    const db = await initDB()
    const videoUrls: Record<string, string> = {}

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)

      let completed = 0
      
      contributionIds.forEach((id) => {
        const request = objectStore.get(id)

        request.onsuccess = () => {
          const result = request.result as VideoRecord | undefined
          
          if (result) {
            // Crear nuevo URL para el blob
            videoUrls[id] = URL.createObjectURL(result.blob)
          }
          
          completed++
          
          if (completed === contributionIds.length) {
            console.log(`✅ Retrieved ${Object.keys(videoUrls).length} videos from IndexedDB`)
            resolve(videoUrls)
          }
        }

        request.onerror = () => {
          console.error(`❌ Error retrieving video ${id}:`, request.error)
          completed++
          
          if (completed === contributionIds.length) {
            resolve(videoUrls)
          }
        }
      })

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error('❌ Error in getMultipleVideosFromIndexedDB:', error)
    return {}
  }
}

/**
 * Eliminar video de IndexedDB
 */
export const deleteVideoFromIndexedDB = async (
  contributionId: string
): Promise<boolean> => {
  try {
    const db = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.delete(contributionId)

      request.onsuccess = () => {
        console.log('✅ Video deleted from IndexedDB:', contributionId)
        resolve(true)
      }

      request.onerror = () => {
        console.error('❌ Error deleting video:', request.error)
        reject(request.error)
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error('❌ Error in deleteVideoFromIndexedDB:', error)
    return false
  }
}

/**
 * Limpiar toda la base de datos (útil para testing)
 */
export const clearAllVideos = async (): Promise<boolean> => {
  try {
    const db = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.clear()

      request.onsuccess = () => {
        console.log('🗑️ All videos cleared from IndexedDB')
        resolve(true)
      }

      request.onerror = () => {
        console.error('❌ Error clearing videos:', request.error)
        reject(request.error)
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error('❌ Error in clearAllVideos:', error)
    return false
  }
}

/**
 * Verificar si un video existe
 */
export const videoExistsInIndexedDB = async (
  contributionId: string
): Promise<boolean> => {
  const video = await getVideoFromIndexedDB(contributionId)
  return video !== null
}

/**
 * Obtener tamaño total de videos almacenados
 */
export const getTotalVideoSize = async (): Promise<number> => {
  try {
    const db = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.getAll()

      request.onsuccess = () => {
        const records = request.result as VideoRecord[]
        const totalSize = records.reduce((sum, record) => sum + record.blob.size, 0)
        
        console.log(`📊 Total video storage: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
        resolve(totalSize)
      }

      request.onerror = () => {
        console.error('❌ Error getting total size:', request.error)
        reject(request.error)
      }

      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error('❌ Error in getTotalVideoSize:', error)
    return 0
  }
}