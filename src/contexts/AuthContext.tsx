import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState
} from 'react'

export interface User {
  id: string
  firstname: string
  surname: string
  cpf: string
  phone: string
  email: string
  address?: string
  neighborhood?: string
  city?: string
  state?: string
  cep?: string
  complement?: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  logout: () => void
}

/**
 * Contexto de Autenticação da Digital Store.
 * Centraliza o estado do usuário logado, persistência no localStorage 
 * e métodos de login/logout para toda a aplicação.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider que envolve a aplicação para prover dados de autenticação.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Tenta recuperar os dados do usuário do localStorage ao inicializar
    const storedUser = localStorage.getItem('@DigitalStore:user')
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('@DigitalStore:user', JSON.stringify(user))
      } else {
        localStorage.removeItem('@DigitalStore:user')
      }
    } catch (e) {
      console.warn('Erro ao acessar localStorage', e)
    }
  }, [user])

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('@DigitalStore:user')
    } catch (e) {
      // Ignora erro
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated: !!user, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook customizado para acessar os dados e funções de autenticação.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
