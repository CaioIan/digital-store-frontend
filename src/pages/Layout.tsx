import type { ReactNode } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout min-h-screen flex flex-col">
      <Header />
      <main className="layout-content flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
