import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Define types for API methods
interface RegisterPayload {
  name: string
  email: string
  password: string
}

interface WishlistPayload {
  title: string
  description?: string
}

interface ContributionPayload {
  amount: number
  message?: string
}

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: RegisterPayload) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// Wishlist endpoints
export const wishlistAPI = {
  create: (data: WishlistPayload) => api.post('/wishlists', data),
  getAll: () => api.get('/wishlists'),
  getBySlug: (slug: string) => api.get(`/wishlists/${slug}`),
  update: (id: string, data: Partial<WishlistPayload>) => api.patch(`/wishlists/${id}`, data),
  delete: (id: string) => api.delete(`/wishlists/${id}`),
  scrapeProduct: (url: string) => api.post('/wishlists/scrape-product', { url }),
}

// Contribution endpoints
export const contributionAPI = {
  create: (wishlistId: string, data: ContributionPayload) => api.post(`/wishlists/${wishlistId}/contributions`, data),
  getByWishlist: (wishlistId: string) => api.get(`/wishlists/${wishlistId}/contributions`),
}

export default api