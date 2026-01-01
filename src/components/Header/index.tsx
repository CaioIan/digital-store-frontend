import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import miniCart from '@/assets/mini-cart.svg'
import Logo from '../Logo'

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?filter=${encodeURIComponent(searchTerm)}`)
    }
  }

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `relative inline-block py-6 text-base font-normal text-[#474747] no-underline hover:text-primary transition-colors ${
      isActive
        ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary'
        : ''
    }`

  return (
    <header className="bg-white shadow-sm">
      <div className="py-5 bg-white">
        <div className="max-w-[1440px] mx-auto px-[100px] flex items-center gap-10">
          <Logo />

          <form
            className="flex-1 max-w-[560px] relative"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Pesquisar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[60px] px-5 pr-[50px] rounded-lg bg-[#F5F5F5] text-base text-[#474747] placeholder:text-[#CCCCCC] outline-none focus:bg-[#EEEEEE]"
            />
            <button
              type="submit"
              className="absolute right-[15px] top-1/2 -translate-y-1/2 p-2 text-[#8F8F8F] hover:text-primary transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
          </form>

          <div className="flex items-center gap-6">
            <Link
              to="/cadastro"
              className="text-base text-[#474747] underline font-normal hover:text-primary transition-colors"
            >
              Cadastre-se
            </Link>
            <Link
              to="/login"
              className="w-[114px] h-10 bg-primary text-white text-sm font-bold rounded flex items-center justify-center no-underline hover:bg-tertiary transition-colors"
            >
              Entrar
            </Link>
            <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
              <img src={miniCart} alt="Carrinho" className="w-6 h-6" />
              <span className="absolute -top-2 -right-3 bg-error text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                2
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="border-t border-[#F5F5F5] bg-white">
        <div className="max-w-[1440px] mx-auto px-[100px] flex gap-[60px]">
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
    </header>
  )
}

export default Header
