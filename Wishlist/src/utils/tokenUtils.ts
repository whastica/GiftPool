import type { AuthTokens } from '../types/authTypes'

const TOKEN_KEY = 'giftpool_token'
const REFRESH_TOKEN_KEY = 'giftpool_refresh_token'
const USER_KEY = 'giftpool_user'

/**
 * Token Storage Utilities
 * Maneja el almacenamiento de tokens en localStorage
 */
export const tokenStorage = {
  // Guardar tokens
  setTokens: (tokens: AuthTokens): void => {
    localStorage.setItem(TOKEN_KEY, tokens.accessToken)
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    }
  },

  // Obtener access token
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Obtener refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  // Limpiar tokens
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  // Verificar si hay token
  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}

/**
 * User Storage Utilities
 * Maneja el almacenamiento del usuario en localStorage
 */
export const userStorage = {
  // Guardar usuario
  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  // Obtener usuario
  getUser: (): any | null => {
    const userData = localStorage.getItem(USER_KEY)
    return userData ? JSON.parse(userData) : null
  },

  // Limpiar usuario
  clearUser: (): void => {
    localStorage.removeItem(USER_KEY)
  },
}

/**
 * Decodificar JWT (simple, sin validación de firma)
 * Solo para leer el payload, NO para validar seguridad
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Verificar si el token está expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true

    // exp viene en segundos, Date.now() en milisegundos
    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()

    return currentTime >= expirationTime
  } catch (error) {
    return true
  }
}

/**
 * Verificar si el token está por expirar (5 minutos antes)
 */
export const shouldRefreshToken = (token: string): boolean => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true

    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    return expirationTime - currentTime < fiveMinutes
  } catch (error) {
    return true
  }
}