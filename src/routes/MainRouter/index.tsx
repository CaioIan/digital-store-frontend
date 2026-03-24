import { Route, Routes } from 'react-router-dom'
import {
  LoginPage,
  ProtectedRoute,
  RegisterFormPage,
  RegisterPage,
  VerifyEmailPage,
  VerifyEmailSentPage
} from '@/features/auth'
import { CartPage } from '@/features/cart'
import { CheckoutPage } from '@/features/checkout'
import {
  MyOrdersPage,
  OrderDetailPage,
  OrderSuccessPage
} from '@/features/orders'
import {
  CategoryPage,
  ProductListingPage,
  ProductViewPage
} from '@/features/products'
import {
  MyInfoPage,
  MyPaymentMethodsPage,
  MyProfilePage
} from '@/features/user'
import HomePage from '@/pages/HomePage'
import Layout from '@/pages/Layout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ScrollToTop } from '@/shared/components'

/**
 * Componente principal de roteamento.
 * Utiliza o React Router DOM para gerenciar a navegação.
 * As rotas são divididas entre Públicas (acessíveis a todos)
 * e Protegidas (exigem login ativo).
 */
export function MainRouter() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias" element={<CategoryPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-form-page" element={<RegisterFormPage />} />
          <Route path="/verify-email-sent" element={<VerifyEmailSentPage />} />
          <Route path="/verificar-email" element={<VerifyEmailPage />} />

          {/* Rotas Seguras (Exigem Cookie Válido/Autenticação) */}
          {/* O componente ProtectedRoute encapsula as rotas que precisam de proteção */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/order/:id/success" element={<OrderSuccessPage />} />
            <Route path="/meus-pedidos" element={<MyOrdersPage />} />
            <Route path="/meus-pedidos/:id" element={<OrderDetailPage />} />
            <Route path="/minhas-informacoes" element={<MyInfoPage />} />
            <Route
              path="/metodos-pagamento"
              element={<MyPaymentMethodsPage />}
            />
            <Route path="/perfil" element={<MyProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </>
  )
}
