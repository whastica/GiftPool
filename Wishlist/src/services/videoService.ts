/**
 * Video Service (EPIC 6)
 * Servicio para grabar, previsualizar y subir video-mensajes
 *
 * Implementación actual:
 * - Grabación vía MediaRecorder
 * - Preview vía Blob URL
 * - Upload simulado
 *
 * Producción:
 * - Cloudinary / S3 / Azure Blob Storage
 */

import type { VideoConfig } from '../types/contributeTypes'

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */
export interface UploadVideoParams {
  contributionId: string
  video: Blob
  onProgress?: (progress: number) => void
}

export const VIDEO_CONFIG: VideoConfig = {
  maxDuration: 30, // segundos
  maxSize: 50 * 1024 * 1024, // 50 MB
  allowedFormats: ['video/webm', 'video/mp4'],
}

/* -------------------------------------------------------------------------- */
/*                            FEATURE DETECTION                               */
/* -------------------------------------------------------------------------- */

/**
 * Verifica soporte real de grabación de video
 */
export const isVideoRecordingSupported = (): boolean => {
  return (
    'mediaDevices' in navigator &&
    'getUserMedia' in navigator.mediaDevices &&
    'MediaRecorder' in window
  )
}

/* -------------------------------------------------------------------------- */
/*                           MEDIA PERMISSIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Solicita permisos de cámara y micrófono
 */
export const requestMediaPermissions = async (): Promise<MediaStream | null> => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
      },
      audio: true,
    })
  } catch (error) {
    console.error('[VideoService] Permission error:', error)
    return null
  }
}

/**
 * Detiene completamente un MediaStream
 */
export const stopMediaStream = (stream: MediaStream | null): void => {
  stream?.getTracks().forEach((track) => track.stop())
}

/* -------------------------------------------------------------------------- */
/*                             MEDIA RECORDER                                  */
/* -------------------------------------------------------------------------- */

/**
 * Crea un MediaRecorder configurado
 */
export const createMediaRecorder = (
  stream: MediaStream,
  onStop: (blob: Blob) => void,
  onError: (error: Error) => void
): MediaRecorder | null => {
  try {
    const mimeType = getSupportedMimeType()

    if (!mimeType) {
      throw new Error('No supported video format found')
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 2_500_000, // 2.5 Mbps
    })

    const chunks: BlobPart[] = []

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType })
      onStop(blob)
    }

    recorder.onerror = (event: Event) => {
      const error =
        (event as any)?.error ??
        new Error('Unknown recording error')

      onError(error instanceof Error ? error : new Error(String(error)))
    }

    return recorder
  } catch (error) {
    console.error('[VideoService] Recorder error:', error)
    onError(error as Error)
    return null
  }
}

/**
 * Detecta MIME type soportado por el navegador
 */
const getSupportedMimeType = (): string | null => {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ]

  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? null
}

/* -------------------------------------------------------------------------- */
/*                                 VALIDATION                                  */
/* -------------------------------------------------------------------------- */

/**
 * Valida tamaño máximo de video
 */
export const validateVideoSize = (blob: Blob): boolean => {
  return blob.size <= VIDEO_CONFIG.maxSize
}

/**
 * Obtiene duración real del video
 */
export const getVideoDuration = (blob: Blob): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }

    video.onerror = () => {
      reject(new Error('Unable to load video metadata'))
    }

    video.src = URL.createObjectURL(blob)
  })
}

/* -------------------------------------------------------------------------- */
/*                              PREVIEW UTILS                                  */
/* -------------------------------------------------------------------------- */

/**
 * Crea URL temporal para preview
 */
export const createVideoPreviewUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob)
}

/**
 * Revoca URL de preview
 */
export const revokeVideoPreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url)
}

/* -------------------------------------------------------------------------- */
/*                               UPLOAD (MOCK)                                 */
/* -------------------------------------------------------------------------- */

/**
 * Sube video (mock)
 * Producción: POST /api/videos/upload
 */
export const uploadVideo = async ({
  video,
  contributionId,
  onProgress,
}: UploadVideoParams): Promise<string | null> => {
  try {
    if (!validateVideoSize(video)) {
      throw new Error('Video exceeds max allowed size')
    }

    if (onProgress) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await delay(150)
        onProgress(progress)
      }
    }

    return `https://cdn.giftpool.com/videos/${contributionId}_${Date.now()}.webm`
  } catch (error) {
    console.error('[VideoService] Upload error:', error)
    return null
  }
}

/**
 * Elimina video (mock)
 */
export const deleteVideo = async (videoUrl: string): Promise<boolean> => {
  try {
    console.info('[VideoService] Video deleted:', videoUrl)
    return true
  } catch (error) {
    console.error('[VideoService] Delete error:', error)
    return false
  }
}

/* -------------------------------------------------------------------------- */
/*                                   UTILS                                    */
/* -------------------------------------------------------------------------- */

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                    */
/* -------------------------------------------------------------------------- */

export default {
  VIDEO_CONFIG,
  isVideoRecordingSupported,
  requestMediaPermissions,
  stopMediaStream,
  createMediaRecorder,
  validateVideoSize,
  getVideoDuration,
  createVideoPreviewUrl,
  revokeVideoPreviewUrl,
  uploadVideo,
  deleteVideo,
}
