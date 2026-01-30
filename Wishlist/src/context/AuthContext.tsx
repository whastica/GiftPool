import { createContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthContextType, User, LoginCredentials, RegisterData } from '../types/authTypes'
import { authService } from '../services/authService'
import { userStorage } from '../utils/tokenUtils'

/**
 * Auth Context
 * Provee el estado de autenticación a toda la aplicación
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Auth Provider
 * Wrapper que provee el contexto de autenticación
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Inicializar sesión al cargar la app
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay sesión activa
        if (authService.hasActiveSession()) {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Si hay error, limpiar todo
        authService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  /**
   * Login
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión')
    }
  }

  /**
   * Register
   */
  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await authService.register(data)
      setUser(response.user)
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrarse')
    }
  }

  /**
   * Logout
   */
  const logout = (): void => {
    authService.logout()
    setUser(null)
  }

  /**
   * Update User (para cuando el usuario edite su perfil)
   */
  const updateUser = (updates: Partial<User>): void => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    userStorage.setUser(updatedUser)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext