/**
 * VideoPlayer Component (EPIC 7)
 * Reproductor de video para mensajes de contribuyentes
 */

import { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
  contributorName: string
  onClose?: () => void
  autoPlay?: boolean
}

const VideoPlayer = ({
  videoUrl,
  contributorName,
  onClose,
  autoPlay = false,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Toggle play/pause
   */
  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    
    setIsPlaying(!isPlaying)
  }

  /**
   * Toggle mute
   */
  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    
    setIsFullscreen(!isFullscreen)
  }

  /**
   * Handle time update
   */
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }

  /**
   * Handle loaded metadata
   */
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  /**
   * Handle seek
   */
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  /**
   * Format time MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
    >
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video object-cover"
        autoPlay={autoPlay}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Contributor Name */}
        <div className="text-white text-sm font-semibold mb-2 px-2">
          Video de {contributorName}
        </div>

        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer mb-3"
          style={{
            background: `linear-gradient(to right, #fff ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%)`,
          }}
        />

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            {/* Time */}
            <span className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Play Overlay (when paused) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer"
        >
          <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
            <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer