import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '../components/Footer'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
