import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { MainRouter } from './routers/MainRouter'

/**
 * Componente Raiz da Aplicação.
 * Aqui definimos a hierarquia de Provedores de Estado (Contexts).
 * - AuthProvider: Gerencia login e dados do usuário.
 * - CartProvider: Gerencia itens e lógica do carrinho (depende do AuthProvider).
 * - MainRouter: Define todas as rotas da aplicação.
 */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainRouter />
      </CartProvider>
    </AuthProvider>
  )
}
