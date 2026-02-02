import type { ReactNode } from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away'
  className?: string
  fallback?: ReactNode
}

const Avatar = ({ 
  src, 
  alt, 
  name,
  size = 'md',
  status,
  className = '',
  fallback
}: AvatarProps) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  }

  const getInitials = (name?: string): string => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getColorFromName = (name?: string): string => {
    if (!name) return 'bg-gray-400'
    
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ]
    
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${sizes[size]}
          rounded-full
          flex items-center justify-center
          font-bold text-white
          overflow-hidden
          ${!src ? getColorFromName(name) : 'bg-gray-200'}
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si la imagen no carga
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : fallback ? (
          fallback
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            w-3 h-3 rounded-full border-2 border-white
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  )
}

export default Avatar