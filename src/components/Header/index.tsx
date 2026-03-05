import { Menu, Search } from 'lucide-react'
import { useCallback, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import logoHeader from '@/assets/logo-header.svg'
import miniCart from '@/assets/mini-cart.svg'
import CartModal from '@/components/CartModal'
import RouterLink from '@/components/RouterLink'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import Logo from '../Logo'
import { DesktopSearch } from './DesktopSearch'
import { MobileSearch } from './MobileSearch'
import { MobileUserProfileMenu } from './MobileUserProfileMenu'
import { UserProfileMenu } from './UserProfileMenu'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const location = useLocation()
  const { itemCount } = useCart()
  const { user, isAuthenticated } = useAuth()

  const isAuthPage =
    location.pathname === '/cadastro'
    || location.pathname === '/login'
    || location.pathname === '/register-form-page'

  const toggleCartModal = useCallback(() => {
    setCartModalOpen((prev) => !prev)
  }, [])

  const closeCartModal = useCallback(() => {
    setCartModalOpen(false)
  }, [])

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `relative inline-block py-3 text-base font-normal text-dark-gray-2 no-underline hover:text-primary transition-colors ${
      isActive
        ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary'
        : ''
    }`

  return (
    <header className="bg-white sticky top-0 z-40 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      {/* Mobile Header - altura 56px */}
      <div className="lg:hidden h-14 flex items-center justify-between px-4">
        {isAuthPage ? (
          <>
            {/* Auth page: Logo left + Entrar right */}
            <RouterLink to="/" className="flex-shrink-0">
              <img
                src={logoHeader}
                alt="Digital Store"
                className="h-7 w-auto"
              />
            </RouterLink>
            <RouterLink
              to="/login"
              className="h-10 px-6 bg-primary text-white text-sm font-bold rounded flex items-center justify-center"
            >
              Entrar
            </RouterLink>
          </>
        ) : (
          <>
            {/* Menu Hamburger - Esquerda */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="w-11 h-11 flex items-center justify-center text-dark-gray-2"
                  aria-label="Abrir menu de navegação"
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[80%] max-w-[320px] bg-white p-0 flex flex-col overflow-y-auto"
                aria-label="Menu de navegação"
              >
                {/* Cabeçalho do Sheet - Logo e Branding */}
                <SheetHeader className="p-5 border-b-0">
                  <SheetTitle className="flex items-center gap-3">
                    <img src={logoHeader} alt="" className="h-8 w-auto" />
                  </SheetTitle>
                </SheetHeader>

                {/* Seção de Navegação */}
                <nav className="flex-1 px-5 py-4" aria-label="Menu principal">
                  <span className="block text-xs font-medium text-light-gray uppercase tracking-wider mb-4">
                    Páginas
                  </span>
                  <ul className="space-y-2">
                    <li>
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          `block py-3 text-base min-h-12 flex items-center transition-opacity active:opacity-60 ${
                            isActive
                              ? 'text-primary underline underline-offset-4 decoration-primary decoration-2'
                              : 'text-dark-gray-2'
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/products"
                        className={({ isActive }) =>
                          `block py-3 text-base min-h-12 flex items-center transition-opacity active:opacity-60 ${
                            isActive
                              ? 'text-primary underline underline-offset-4 decoration-primary decoration-2'
                              : 'text-dark-gray-2'
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Produtos
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/categorias"
                        className={({ isActive }) =>
                          `block py-3 text-base min-h-12 flex items-center transition-opacity active:opacity-60 ${
                            isActive
                              ? 'text-primary underline underline-offset-4 decoration-primary decoration-2'
                              : 'text-dark-gray-2'
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Categorias
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/meus-pedidos"
                        className={({ isActive }) =>
                          `block py-3 text-base min-h-12 flex items-center transition-opacity active:opacity-60 ${
                            isActive
                              ? 'text-primary underline underline-offset-4 decoration-primary decoration-2'
                              : 'text-dark-gray-2'
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Meus Pedidos
                      </NavLink>
                    </li>
                  </ul>
                </nav>

                {/* Separador Visual */}
                <div className="mx-5 border-t border-light-gray-3" />

                {/* Área de Autenticação */}
                <div className="p-5 space-y-4 mt-auto">
                  {isAuthenticated ? (
                    <MobileUserProfileMenu
                      onCloseMobileMenu={() => setMobileMenuOpen(false)}
                    />
                  ) : (
                    <>
                      <RouterLink
                        to="/login"
                        className="w-full h-12 bg-primary text-white text-base font-bold rounded-lg flex items-center justify-center hover:bg-tertiary active:brightness-90 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Entrar
                      </RouterLink>
                      <RouterLink
                        to="/cadastro"
                        className="block text-center text-base text-dark-gray-2 underline hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Cadastre-se
                      </RouterLink>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo - Centro */}
            <RouterLink to="/" className="flex-shrink-0">
              <img
                src={logoHeader}
                alt="Digital Store"
                className="h-7 w-auto"
              />
            </RouterLink>

            {/* Ícones - Direita */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="w-11 h-11 flex items-center justify-center text-dark-gray-2"
                aria-label="Pesquisar"
              >
                <Search size={20} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCartModal()
                  }}
                  className="w-11 h-11 flex items-center justify-center relative cursor-pointer bg-transparent border-none"
                  aria-label="Abrir carrinho"
                  aria-expanded={cartModalOpen}
                >
                  <img src={miniCart} alt="" className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 bg-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
                <CartModal isOpen={cartModalOpen} onClose={closeCartModal} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Search Expandido */}
      {!isAuthPage && mobileSearchOpen && (
        <MobileSearch
          onSearchComplete={() => {
            setMobileMenuOpen(false)
            setMobileSearchOpen(false)
          }}
        />
      )}

      {/* Desktop Header */}
      <div className="hidden lg:block py-6 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-[100px] flex items-center gap-10">
          <Logo />
          {!isAuthPage && <DesktopSearch />}
          {isAuthPage ? (
            <div className="ml-auto">
              <RouterLink
                to="/login"
                className="w-[114px] h-10 bg-primary text-white text-sm font-bold rounded flex items-center justify-center"
              >
                Entrar
              </RouterLink>
            </div>
          ) : (
            <div className="flex items-center ml-[232px] gap-[29px]">
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCartModal()
                  }}
                  className="relative cursor-pointer bg-transparent border-none"
                  aria-label="Abrir carrinho"
                  aria-expanded={cartModalOpen}
                >
                  <img src={miniCart} alt="" className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-error text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
                <CartModal isOpen={cartModalOpen} onClose={closeCartModal} />
              </div>
              {isAuthenticated ? (
                <UserProfileMenu />
              ) : (
                <>
                  <RouterLink
                    to="/cadastro"
                    className="text-base text-dark-gray-2 underline"
                  >
                    Cadastre-se
                  </RouterLink>
                  <RouterLink
                    to="/login"
                    className="w-[114px] h-10 bg-primary text-white text-sm font-bold rounded flex items-center justify-center"
                  >
                    Entrar
                  </RouterLink>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation - hidden on auth pages */}
      {!isAuthPage && (
        <nav className="hidden lg:block bg-white">
          <div className="max-w-[1440px] mx-auto px-6 xl:px-[100px] flex gap-8">
            <NavLink to="/" className={navLinkClassName}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClassName}>
              Produtos
            </NavLink>
            <NavLink to="/categorias" className={navLinkClassName}>
              Categorias
            </NavLink>
            <NavLink to="/meus-pedidos" className={navLinkClassName}>
              Meus Pedidos
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header
