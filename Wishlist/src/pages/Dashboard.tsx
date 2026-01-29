import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Target,
  CheckCircle2,
  DollarSign,
  Video,
  TrendingUp,
  ExternalLink,
  Copy,
  Share2,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/common/ProgressBar';

type User = {
  name: string;
  email: string;
  avatar: string;
};

type Stats = {
  activeWishlists: number;
  completed: number;
  totalRaised: number;
  videosReceived: number;
  totalContributors: number;
};

type Product = {
  name: string;
  image: string;
};

type Wishlist = {
  id: number;
  slug: string;
  title: string;
  eventDate: string;
  product: Product;
  current: number;
  target: number;
  contributors: number;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  completedAt?: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  // Simulated user data
  const user: User = {
    name: 'María',
    email: 'maria@example.com',
    avatar: 'M',
  };

  const stats: Stats = {
    activeWishlists: 2,
    completed: 1,
    totalRaised: 2100000,
    videosReceived: 18,
    totalContributors: 25,
  };

  const wishlists: Wishlist[] = [
    {
      id: 1,
      slug: 'maria-cumple-2025',
      title: 'Cumpleaños de María',
      eventDate: '2025-03-15',
      product: {
        name: 'Audífonos Bluetooth Sony WH-1000XM4',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      },
      current: 810000,
      target: 900000,
      contributors: 12,
      status: 'active',
      createdAt: '2025-01-20',
    },
    {
      id: 2,
      slug: 'laptop-juan',
      title: 'Laptop para Juan (Graduación)',
      eventDate: '2025-04-10',
      product: {
        name: 'Laptop HP Pavilion 15"',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      },
      current: 450000,
      target: 2500000,
      contributors: 8,
      status: 'active',
      createdAt: '2025-01-25',
    },
    {
      id: 3,
      slug: 'bicicleta-ana',
      title: 'Bicicleta para Ana',
      eventDate: '2025-01-10',
      product: {
        name: 'Bicicleta de Montaña Trek',
        image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=300&h=300&fit=crop',
      },
      current: 850000,
      target: 850000,
      contributors: 15,
      status: 'completed',
      createdAt: '2024-12-15',
      completedAt: '2025-01-08',
    },
  ];

  const filteredWishlists = wishlists.filter((w) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return w.status === 'active';
    if (activeTab === 'completed') return w.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: Wishlist['status']) => {
    const badges = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activa' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completada' },
      expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Expirada' },
    };
    const badge = badges[status];
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    );
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`https://giftpool.co/w/${slug}`);
    alert('¡Link copiado!');
  };

  const shareWhatsApp = (slug: string) => {
    const text = encodeURIComponent(
      `¡Ayúdame a reunir para este regalo! 🎁 https://giftpool.co/w/${slug}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="gradient-bg py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-bold text-white mb-2">
                Hola, {user.name} 👋
              </h1>
              <p className="text-xl text-white/90">
                Gestiona todas tus wishlists desde aquí
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/crear-wishlist')}
              className="bg-white text-primary-600 hover:bg-white/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Wishlist
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
              <Target className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.activeWishlists}</p>
              <p className="text-sm opacity-90">Activas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm opacity-90">Completadas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">${(stats.totalRaised / 1000000).toFixed(1)}M</p>
              <p className="text-sm opacity-90">Recaudado</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
              <Video className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.videosReceived}</p>
              <p className="text-sm opacity-90">Videos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.totalContributors}</p>
              <p className="text-sm opacity-90">Colaboradores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Tabs */}
        <Card className="mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Todas las wishlists ({wishlists.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'active'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Activas ({wishlists.filter((w) => w.status === 'active').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'completed'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Completadas ({wishlists.filter((w) => w.status === 'completed').length})
            </button>
          </div>
        </Card>

        {/* Wishlists Grid */}
        <div className="space-y-6">
          {filteredWishlists.map((wishlist) => {
            return (
              <Card key={wishlist.id} hover className="animate-fade-in-up">
                <div className="grid md:grid-cols-12 gap-6">
                  {/* Product Image */}
                  <div className="md:col-span-2">
                    <img
                      src={wishlist.product.image}
                      alt={wishlist.product.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="md:col-span-7">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {wishlist.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {wishlist.product.name}
                        </p>
                      </div>
                      {getStatusBadge(wishlist.status)}
                    </div>

                    <div className="mt-4">
                      <ProgressBar
                        current={wishlist.current}
                        target={wishlist.target}
                        showPercentage={true}
                      />
                    </div>

                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {wishlist.contributors} colaboradores
                      </span>
                      <span>•</span>
                      <span>
                        Evento: {new Date(wishlist.eventDate).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-3 flex flex-col space-y-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => navigate(`/w/${wishlist.slug}`)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver wishlist
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => copyLink(wishlist.slug)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => shareWhatsApp(wishlist.slug)}
                      className="bg-green-500 text-white border-green-500 hover:bg-green-600"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir
                    </Button>

                    {wishlist.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        className="text-purple-600"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Ver video
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredWishlists.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No tienes wishlists {activeTab === 'active' ? 'activas' : 'completadas'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'active'
                ? 'Crea tu primera wishlist para empezar a recaudar'
                : 'Las wishlists completadas aparecerán aquí'}
            </p>
            {activeTab === 'active' && (
              <Button onClick={() => navigate('/crear-wishlist')}>
                <Plus className="w-5 h-5 mr-2" />
                Crear Wishlist
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;