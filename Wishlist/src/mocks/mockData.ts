// src/mocks/mockData.ts
import type { PublicWishlist } from '../types/publicWishlistTypes'

export const mockWishlist: PublicWishlist = {
  id: 'wl_mock_123',
  slug: 'maria-cumple-2025',
  title: 'Cumpleaños de María',
  ownerName: 'María',
  eventDate: '2026-02-14',
  status: 'active',
  currentAmount: 50000,
  targetAmount: 150000,
  contributorsCount: 2,

  product: {
    id: 'prod_mock_001',
    name: 'Cámara Instantánea',
    description: 'Cámara instantánea ideal para capturar momentos especiales',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop',
    url: 'https://example.com/camera',
    marketplace: 'Example Store',
    available: true,
  },

  contributors: [
    {
      id: 'contrib_001',
      name: 'Juan',
      amount: 20000,
      isAnonymous: false,
      createdAt: '2026-01-15T10:30:00Z',
    },
    {
      id: 'contrib_002',
      name: 'Ana',
      amount: 30000,
      message: '¡Con mucho cariño!',
      videoUrl: '/videos/ana.mp4',
      isAnonymous: false,
      createdAt: '2026-01-20T18:45:00Z',
    },
  ],

  message: 'Gracias por ayudarme a cumplir este sueño.',
  createdAt: '2026-01-01T09:00:00Z',
  updatedAt: '2026-02-01T12:00:00Z',
}
