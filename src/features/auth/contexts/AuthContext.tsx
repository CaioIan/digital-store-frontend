import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { CONFIG } from '@/core'

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
  isInitialLoading: boolean
  logout: () => void
  emailVerificationRequired: boolean
  setEmailVerificationRequired: (value: boolean) => void
}

/**
 * Contexto de Autenticação da Digital Store.
 *
 * Centraliza o estado do usuário logado (`user`), a persistência automática
 * no `sessionStorage`, o estado de carregamento inicial (`isInitialLoading`)
 * e métodos utilitários como `logout`.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEYS = {
  EMAIL_VERIFICATION_REQUIRED: 'emailVerificationRequired'
}

/**
 * Provider de Autenticação.
 *
 * Deve envolver a raiz da aplicação ou o roteador principal para prover
 * o contexto de autenticação a todos os componentes filhos. Sincroniza
 * o estado do usuário com o `sessionStorage` no carregamento e em mudanças.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {ReactNode} props.children - Elementos React que serão envolvidos.
 * @returns {JSX.Element} Provider do contexto de autenticação.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [emailVerificationRequired, setEmailVerificationRequired] =
    useState(true)

  // Sincronização inicial com o sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem(CONFIG.STORAGE_KEYS.USER)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        // Erro silencioso ao restaurar usuário
      }
    }

    // Restaura o estado de verificação de email
    const storedEmailVerification = sessionStorage.getItem(
      STORAGE_KEYS.EMAIL_VERIFICATION_REQUIRED
    )
    if (storedEmailVerification !== null) {
      try {
        setEmailVerificationRequired(JSON.parse(storedEmailVerification))
      } catch {
        // Erro silencioso ao restaurar verificação de email
      }
    }

    setIsInitialLoading(false)
  }, [])

  // Atualiza o sessionStorage sempre que o objeto user mudar
  useEffect(() => {
    // Evita rodar antes do loading inicial estar pronto para não limpar o storage acidentalmente
    if (isInitialLoading) return

    try {
      if (user) {
        sessionStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user))
      } else {
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.USER)
      }
    } catch {
      // Erro silencioso ao acessar sessionStorage
    }
  }, [user, isInitialLoading])

  // Sincroniza o estado de verificação de email com sessionStorage
  useEffect(() => {
    if (isInitialLoading) return

    try {
      sessionStorage.setItem(
        STORAGE_KEYS.EMAIL_VERIFICATION_REQUIRED,
        JSON.stringify(emailVerificationRequired)
      )
    } catch {
      // Erro silencioso ao acessar sessionStorage
    }
  }, [emailVerificationRequired, isInitialLoading])

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        isInitialLoading,
        logout,
        emailVerificationRequired,
        setEmailVerificationRequired
      }}
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
