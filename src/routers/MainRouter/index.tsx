import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import HomePage from '@/pages/HomePage'
import Layout from '@/pages/Layout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import ProductListingPage from '@/pages/ProductListingPage'
import ProductViewPage from '@/pages/ProductViewPage'

export function MainRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductViewPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
