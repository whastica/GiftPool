import { Video, MessageSquare, Users } from 'lucide-react'
import Card from '../ui/Card'
import Avatar from '../common/Avatar'
import type { PublicContributor } from '../../types/publicWishlistTypes'

interface ContributorsListProps {
  contributors: PublicContributor[]
  total: number
  className?: string
}

const ContributorsList = ({ contributors, total, className = '' }: ContributorsListProps) => {
  /**
   * Formatear tiempo relativo
   */
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
    } else {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
    }
  }

  if (contributors.length === 0) {
    return (
      <Card className={className}>
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¡Sé el primero en colaborar!
          </h3>
          <p className="text-gray-600">
            Ayuda a cumplir este sueño siendo el primer colaborador
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary-600" />
          Colaboradores
        </h3>
        <span className="text-lg font-semibold text-gray-600">
          {total} {total === 1 ? 'persona' : 'personas'}
        </span>
      </div>

      {/* Contributors List */}
      <div className="space-y-4">
        {contributors.map((contributor) => (
          <div
            key={contributor.id}
            className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0"
          >
            {/* Avatar */}
            <Avatar
              name={contributor.isAnonymous ? 'Anónimo' : contributor.name}
              src={contributor.avatar}
              size="lg"
              fallback={contributor.isAnonymous ? '😊' : undefined}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-bold text-gray-900 truncate">
                  {contributor.isAnonymous ? 'Colaborador Anónimo' : contributor.name}
                </h4>
                <span className="text-lg font-bold text-primary-600 flex-shrink-0">
                  ${contributor.amount.toLocaleString()}
                </span>
              </div>

              {/* Time */}
              <p className="text-xs text-gray-500 mb-2">
                {getTimeAgo(contributor.createdAt)}
              </p>

              {/* Message */}
              {contributor.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-2">
                  <p className="text-sm text-gray-700 italic">
                    "{contributor.message}"
                  </p>
                </div>
              )}

              {/* Media Indicators */}
              <div className="flex items-center gap-3 text-sm">
                {contributor.videoUrl && (
                  <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                    <Video className="w-4 h-4" />
                    Video-mensaje
                  </span>
                )}
                {contributor.message && !contributor.videoUrl && (
                  <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                    <MessageSquare className="w-4 h-4" />
                    Mensaje
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-900 text-center">
            <Video className="w-4 h-4 inline mr-1" />
            <span className="font-semibold">
              {contributors.filter(c => c.videoUrl).length} personas
            </span>
            {' '}dejaron video-mensaje para el destinatario 🎥
          </p>
        </div>
      </div>
    </Card>
  )
}

export default ContributorsList