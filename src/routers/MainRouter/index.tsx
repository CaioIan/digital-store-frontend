import { ScrollToTop } from '@/components/ScrollToTop'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterFormPage from '@/features/auth/pages/RegisterFormPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import HomePage from '@/pages/HomePage'
import Layout from '@/pages/Layout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import OrderSuccessPage from '@/pages/OrderSuccessPage'
import ProductListingPage from '@/pages/ProductListingPage'
import ProductViewPage from '@/pages/ProductViewPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

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
            <Route
              path="/perfil"
              element={
                <div className="p-12 text-center text-primary font-bold text-2xl">
                  Meu Perfil Protegido! 🔒
                </div>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
