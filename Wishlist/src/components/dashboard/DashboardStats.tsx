/**
 * Estadísticas del Dashboard
 * Muestra cards con las métricas principales del usuario
 */

import { Target, CheckCircle2, DollarSign, Video, TrendingUp } from 'lucide-react'
import type { DashboardStats as StatsType } from '../../types/wishlistTypes'
import { formatCurrencyCompact } from '../../utils/wishlistUtils'

interface DashboardStatsProps {
  stats: StatsType
  isLoading?: boolean
}

interface StatCardProps {
  icon: React.ElementType
  value: string | number
  label: string
  delay: number
  color?: 'primary' | 'green' | 'blue' | 'purple' | 'orange'
}

const StatCard = ({ icon: Icon, value, label, delay, color = 'primary' }: StatCardProps) => {
  const colors = {
    primary: 'bg-primary-500/10 text-primary-600',
    green: 'bg-green-500/10 text-green-600',
    blue: 'bg-blue-500/10 text-blue-600',
    purple: 'bg-purple-500/10 text-purple-600',
    orange: 'bg-orange-500/10 text-orange-600',
  }

  return (
    <div
      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center animate-scale-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${colors[color]} flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  )
}

const DashboardStats = ({ stats, isLoading = false }: DashboardStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/20 skeleton-shimmer" />
            <div className="h-8 bg-white/20 rounded mb-2 skeleton-shimmer" />
            <div className="h-4 bg-white/20 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        icon={Target}
        value={stats.activeWishlists}
        label="Activas"
        delay={0}
        color="primary"
      />
      
      <StatCard
        icon={CheckCircle2}
        value={stats.completed}
        label="Completadas"
        delay={0.1}
        color="green"
      />
      
      <StatCard
        icon={DollarSign}
        value={formatCurrencyCompact(stats.totalRaised)}
        label="Recaudado"
        delay={0.2}
        color="blue"
      />
      
      <StatCard
        icon={Video}
        value={stats.videosReceived}
        label="Videos"
        delay={0.3}
        color="purple"
      />
      
      <StatCard
        icon={TrendingUp}
        value={stats.totalContributors}
        label="Colaboradores"
        delay={0.4}
        color="orange"
      />
    </div>
  )
}

export default DashboardStats