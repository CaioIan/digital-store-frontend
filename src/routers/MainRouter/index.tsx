import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import HomePage from '@/pages/HomePage'
import Layout from '@/pages/Layout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import ProductListingPage from '@/pages/ProductListingPage'
import ProductViewPage from '@/pages/ProductViewPage'
import RegisterFormPage from '@/pages/RegisterFormPage'
import RegisterPage from '@/pages/RegisterPage'

export function MainRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/register-form-page" element={<RegisterFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
