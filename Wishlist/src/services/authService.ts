import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/authTypes'
import { tokenStorage, userStorage } from '../utils/tokenUtils'

/**
 * Auth Service
 * 
 * MODO MOCK: Simula llamadas al backend
 * Cuando tengas backend real, solo cambia MOCK_MODE a false
 * y las funciones usarán el API real
 */

const MOCK_MODE = true // ← Cambiar a false cuando tengas backend

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generar token JWT simulado
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    userId,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expira en 24 horas
    iat: Math.floor(Date.now() / 1000)
  }))
  const signature = btoa('mock-signature')
  return `${header}.${payload}.${signature}`
}

// Base de datos simulada de usuarios
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@giftpool.co',
    name: 'Usuario Demo',
    avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=7c3aed&color=fff',
    createdAt: new Date().toISOString(),
  }
]

/**
 * Mock API Functions
 */
const mockAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(1000) // Simular latencia de red

    // Validación simple
    if (credentials.email === 'demo@giftpool.co' && credentials.password === 'demo123') {
      const user = mockUsers[0]
      const tokens = {
        accessToken: generateMockToken(user.id),
        refreshToken: generateMockToken(user.id + '-refresh')
      }

      return { user, tokens }
    }

    // Buscar en usuarios registrados mock
    const user = mockUsers.find(u => u.email === credentials.email)
    if (user) {
      const tokens = {
        accessToken: generateMockToken(user.id),
        refreshToken: generateMockToken(user.id + '-refresh')
      }
      return { user, tokens }
    }

    throw new Error('Credenciales inválidas')
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    await delay(1500) // Simular latencia de red

    // Verificar si el email ya existe
    if (mockUsers.some(u => u.email === data.email)) {
      throw new Error('Este email ya está registrado')
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=7c3aed&color=fff`,
      createdAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    const tokens = {
      accessToken: generateMockToken(newUser.id),
      refreshToken: generateMockToken(newUser.id + '-refresh')
    }

    return { user: newUser, tokens }
  },

  getCurrentUser: async (): Promise<User> => {
    await delay(500)
    
    const token = tokenStorage.getAccessToken()
    if (!token) {
      throw new Error('No token found')
    }

    // En mock, devolver el usuario guardado en localStorage
    const user = userStorage.getUser()
    if (!user) {
      throw new Error('No user found')
    }

    return user
  },

  logout: async (): Promise<void> => {
    await delay(300)
    // En mock, solo limpiamos el storage
    tokenStorage.clearTokens()
    userStorage.clearUser()
  }
}

/**
 * Real API Functions (para cuando tengas backend)
 */
const realAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Importar tu api.ts
    const { authAPI } = await import('./api')
    const response = await authAPI.login(credentials.email, credentials.password)
    return response.data
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { authAPI } = await import('./api')
    const response = await authAPI.register(data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const { authAPI } = await import('./api')
    const response = await authAPI.me()
    return response.data
  },

  logout: async (): Promise<void> => {
    const { authAPI } = await import('./api')
    await authAPI.logout()
    tokenStorage.clearTokens()
    userStorage.clearUser()
  }
}

/**
 * Auth Service - Usa mock o real según MOCK_MODE
 */
export const authService = {
  /**
   * Login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const api = MOCK_MODE ? mockAPI : realAPI
    const response = await api.login(credentials)
    
    // Guardar tokens y usuario
    tokenStorage.setTokens(response.tokens)
    userStorage.setUser(response.user)
    
    return response
  },

  /**
   * Register
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const api = MOCK_MODE ? mockAPI : realAPI
    const response = await api.register(data)
    
    // Guardar tokens y usuario
    tokenStorage.setTokens(response.tokens)
    userStorage.setUser(response.user)
    
    return response
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    const api = MOCK_MODE ? mockAPI : realAPI
    await api.logout()
  },

  /**
   * Get Current User
   */
  getCurrentUser: async (): Promise<User> => {
    const api = MOCK_MODE ? mockAPI : realAPI
    return await api.getCurrentUser()
  },

  /**
   * Verificar si hay sesión activa
   */
  hasActiveSession: (): boolean => {
    return tokenStorage.hasToken()
  }
}

export default authService

  /**
   * Email: demo@giftpool.co
   * Password: demo123
   */