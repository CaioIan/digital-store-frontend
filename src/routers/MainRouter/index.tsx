import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterFormPage from '@/features/auth/pages/RegisterFormPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import HomePage from '@/pages/HomePage'
import Layout from '@/pages/Layout'
import MyInfoPage from '@/pages/MyInfoPage'
import MyOrdersPage from '@/pages/MyOrdersPage'
import MyPaymentMethodsPage from '@/pages/MyPaymentMethodsPage'
import MyProfilePage from '@/pages/MyProfilePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import OrderSuccessPage from '@/pages/OrderSuccessPage'
import ProductListingPage from '@/pages/ProductListingPage'
import ProductViewPage from '@/pages/ProductViewPage'

export function MainRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-form-page" element={<RegisterFormPage />} />

          {/* Rotas Seguras (Exigem Cookie Válido) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/order/:id/success" element={<OrderSuccessPage />} />
            <Route path="/meus-pedidos" element={<MyOrdersPage />} />
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
    </BrowserRouter>
  )
}
