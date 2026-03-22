import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Componente de proteção de rotas (HOC/Wrapper).
 * 
 * Verifica o estado de autenticação global através do `useAuth`.
 * - Se estiver carregando o estado inicial, não renderiza nada (null).
 * - Se o usuário NÃO estiver autenticado, redireciona para `/login`.
 * - Se o usuário ESTIVER autenticado, renderiza as rotas filhas (`<Outlet />`).
 * 
 * @returns {JSX.Element | null} As rotas protegidas ou link de redirecionamento.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isInitialLoading } = useAuth()

  if (isInitialLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
