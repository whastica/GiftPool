/**
 * VideoRecorder Component - MEJORADO (EPIC 6)
 * Permite grabar video O subir desde galería
 */

import { useState, useRef, useEffect } from 'react'
import {
  Video,
  VideoOff,
  Circle,
  Square,
  RotateCcw,
  Check,
  AlertCircle,
  Play,
  Pause,
  Upload,
  Film,
} from 'lucide-react'
import Button from '../ui/Button'
import {
  isVideoRecordingSupported,
  requestMediaPermissions,
  stopMediaStream,
  createMediaRecorder,
  createVideoPreviewUrl,
  revokeVideoPreviewUrl,
  getVideoDuration,
  VIDEO_CONFIG,
} from '../../services/videoService'

interface VideoRecorderProps {
  onVideoReady: (blob: Blob, url: string) => void
  onSkip: () => void
}

type RecordingMode = 'idle' | 'camera' | 'upload'

const VideoRecorder = ({ onVideoReady, onSkip }: VideoRecorderProps) => {
  const [mode, setMode] = useState<RecordingMode>('idle')
  const [isSupported, setIsSupported] = useState(true)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<number | null>(null)

  // Verificar soporte al montar
  useEffect(() => {
    setIsSupported(isVideoRecordingSupported())
  }, [])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stopRecording()
      if (streamRef.current) {
        stopMediaStream(streamRef.current)
      }
      if (recordedUrl) {
        revokeVideoPreviewUrl(recordedUrl)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [recordedUrl])

  /**
   * Iniciar modo cámara
   */
  const startCameraMode = async () => {
    setError(null)
    setMode('camera')
    const stream = await requestMediaPermissions()

    if (!stream) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
      setMode('idle')
      return
    }

    streamRef.current = stream
    setPermissionGranted(true)

    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
    }
  }

  /**
   * Iniciar modo upload
   */
  const startUploadMode = () => {
    setError(null)
    setMode('upload')
    fileInputRef.current?.click()
  }

  /**
   * Manejar archivo seleccionado
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setMode('idle')
      return
    }

    // Validar tipo
    if (!file.type.startsWith('video/')) {
      setError('Por favor selecciona un archivo de video válido')
      setMode('idle')
      return
    }

    // Validar tamaño
    if (file.size > VIDEO_CONFIG.maxSize) {
      setError(`El video no puede exceder ${VIDEO_CONFIG.maxSize / (1024 * 1024)} MB`)
      setMode('idle')
      return
    }

    setIsValidating(true)

    try {
      // Convertir a Blob
      const blob = new Blob([file], { type: file.type })
      
      // Validar duración
      const videoDuration = await getVideoDuration(blob)
      
      if (videoDuration > VIDEO_CONFIG.maxDuration) {
        setError(`El video no puede durar más de ${VIDEO_CONFIG.maxDuration} segundos`)
        setMode('idle')
        setIsValidating(false)
        return
      }

      // Todo bien, guardar video
      const url = createVideoPreviewUrl(blob)
      setRecordedBlob(blob)
      setRecordedUrl(url)
      setDuration(Math.floor(videoDuration))

      // Mostrar preview
      if (previewRef.current) {
        previewRef.current.src = url
      }
    } catch (err) {
      console.error('Error validating video:', err)
      setError('Error al procesar el video. Intenta con otro archivo.')
      setMode('idle')
    } finally {
      setIsValidating(false)
    }
  }

  /**
   * Iniciar grabación
   */
  const startRecording = () => {
    if (!streamRef.current) return

    const recorder = createMediaRecorder(
      streamRef.current,
      handleDataAvailable,
      (err) => setError(err.message)
    )

    if (!recorder) {
      setError('Error al iniciar la grabación')
      return
    }

    recorderRef.current = recorder
    recorder.start()
    setIsRecording(true)
    setDuration(0)

    // Timer para actualizar duración
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        const newDuration = prev + 1
        // Auto-stop al llegar al límite
        if (newDuration >= VIDEO_CONFIG.maxDuration) {
          stopRecording()
        }
        return newDuration
      })
    }, 1000)
  }

  /**
   * Pausar/resumir grabación
   */
  const togglePause = () => {
    if (!recorderRef.current) return

    if (isPaused) {
      recorderRef.current.resume()
      setIsPaused(false)
      // Reanudar timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1
          if (newDuration >= VIDEO_CONFIG.maxDuration) {
            stopRecording()
          }
          return newDuration
        })
      }, 1000)
    } else {
      recorderRef.current.pause()
      setIsPaused(true)
      // Pausar timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  /**
   * Detener grabación
   */
  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    setIsRecording(false)
    setIsPaused(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  /**
   * Manejar datos grabados
   */
  const handleDataAvailable = (blob: Blob) => {
    const url = createVideoPreviewUrl(blob)
    setRecordedBlob(blob)
    setRecordedUrl(url)

    // Mostrar preview
    if (previewRef.current) {
      previewRef.current.src = url
    }

    // Detener stream
    if (streamRef.current) {
      stopMediaStream(streamRef.current)
      streamRef.current = null
    }
  }

  /**
   * Reiniciar (grabar de nuevo)
   */
  const reset = async () => {
    if (recordedUrl) {
      revokeVideoPreviewUrl(recordedUrl)
    }
    setRecordedBlob(null)
    setRecordedUrl(null)
    setDuration(0)
    setError(null)
    setMode('idle')
    setPermissionGranted(false)
  }

  /**
   * Confirmar y continuar
   */
  const handleConfirm = () => {
    if (recordedBlob && recordedUrl) {
      onVideoReady(recordedBlob, recordedUrl)
    }
  }

  /**
   * Formatear tiempo MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // UI: No soportado
  if (!isSupported) {
    return (
      <div className="card bg-yellow-50 border-2 border-yellow-200 text-center">
        <VideoOff className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
        <h3 className="font-bold text-yellow-900 mb-2">
          Grabación no disponible
        </h3>
        <p className="text-sm text-yellow-800 mb-4">
          Tu navegador no soporta grabación de video. Puedes subir un video desde tu galería.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={startUploadMode} variant="secondary">
            <Upload className="w-5 h-5 mr-2" />
            Subir video
          </Button>
          <Button onClick={onSkip} variant="secondary">
            Continuar sin video
          </Button>
        </div>
      </div>
    )
  }

  // UI: Validando archivo
  if (isValidating) {
    return (
      <div className="card text-center">
        <div className="spinner mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Validando video...
        </h3>
        <p className="text-gray-600">
          Verificando duración y tamaño del archivo
        </p>
      </div>
    )
  }

  // UI: Vista inicial (selección de modo)
  if (mode === 'idle' && !recordedBlob) {
    return (
      <div className="text-center space-y-6 animate-fade-in-up">
        <div className="w-24 h-24 mx-auto gradient-bg rounded-full flex items-center justify-center">
          <Video className="w-12 h-12 text-white" />
        </div>
        
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">
            ¿Quieres agregar un video-mensaje?
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Puedes grabar un video de hasta {VIDEO_CONFIG.maxDuration} segundos o subir uno desde tu galería
          </p>
        </div>

        {error && (
          <div className="card bg-red-50 border-2 border-red-200 max-w-md mx-auto animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-900 font-semibold">{error}</p>
          </div>
        )}

        {/* Opciones */}
        <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={startCameraMode}
            className="card card-hover border-2 border-primary-200 hover:border-primary-600 p-6 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              <Film className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Grabar ahora</h4>
            <p className="text-sm text-gray-600">Usa tu cámara para grabar</p>
          </button>

          <button
            onClick={startUploadMode}
            className="card card-hover border-2 border-secondary-200 hover:border-secondary-600 p-6 text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center group-hover:bg-secondary-600 transition-colors">
              <Upload className="w-8 h-8 text-secondary-600 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Subir video</h4>
            <p className="text-sm text-gray-600">Desde tu galería</p>
          </button>
        </div>

        {/* Input oculto para archivos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button onClick={onSkip} variant="secondary" size="lg">
          Omitir video
        </Button>

        {/* Tips */}
        <div className="card bg-blue-50 border-2 border-blue-200 max-w-md mx-auto text-left">
          <p className="font-bold text-blue-900 mb-2">💡 Consejos:</p>
          <ul className="text-blue-800 space-y-1 list-disc list-inside text-sm">
            <li>Máximo {VIDEO_CONFIG.maxDuration} segundos de duración</li>
            <li>Asegúrate de tener buena iluminación</li>
            <li>Sé auténtico, tu mensaje será muy especial</li>
          </ul>
        </div>
      </div>
    )
  }

  // UI: Vista de preview/grabación (modo cámara)
  if (mode === 'camera' && permissionGranted && !recordedBlob) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Video Preview */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover mirror"
          />

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-bold animate-pulse">
              <Circle className="w-3 h-3" fill="currentColor" />
              REC {formatTime(duration)}
            </div>
          )}

          {/* Time Remaining */}
          {isRecording && (
            <div className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full font-bold backdrop-blur-sm">
              {formatTime(VIDEO_CONFIG.maxDuration - duration)} restantes
            </div>
          )}

          {/* Paused Overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <div className="text-white text-2xl font-black">⏸ PAUSADO</div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <>
              <Button onClick={startRecording} size="lg" className="px-8 btn-primary">
                <Circle className="w-5 h-5 mr-2" fill="currentColor" />
                Grabar
              </Button>
              <Button onClick={reset} variant="secondary" size="lg">
                Volver
              </Button>
            </>
          ) : (
            <>
              <Button onClick={togglePause} variant="secondary" size="lg">
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Continuar
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                )}
              </Button>
              <Button onClick={stopRecording} size="lg" className="btn-primary">
                <Square className="w-5 h-5 mr-2" />
                Detener
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  // UI: Vista de preview del video grabado/subido
  if (recordedBlob && recordedUrl) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-900 px-4 py-2 rounded-full font-bold mb-4">
            <Check className="w-5 h-5" />
            Video listo ({formatTime(duration)})
          </div>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={previewRef}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button onClick={handleConfirm} size="lg" className="px-8 btn-primary">
            <Check className="w-5 h-5 mr-2" />
            ¡Perfecto, continuar!
          </Button>
          <Button onClick={reset} variant="secondary" size="lg">
            <RotateCcw className="w-5 h-5 mr-2" />
            Elegir otro video
          </Button>
        </div>
      </div>
    )
  }

  return null
}

export default VideoRecorder