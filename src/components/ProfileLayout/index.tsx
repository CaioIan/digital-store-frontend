import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

/* ─── Sidebar Links ─── */

const sidebarLinks = [
  { to: '/perfil', label: 'Meu Perfil' },
  { to: '/meus-pedidos', label: 'Meus Pedidos' },
  { to: '/minhas-informacoes', label: 'Minhas Informações' },
  { to: '/metodos-pagamento', label: 'Métodos de Pagamento' }
]

/* ─── Profile Layout ─── */

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth)
    }
  }

  useEffect(() => {
    checkScroll() // Verificação inicial
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 xl:px-[100px] py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-8">
        {/* Sidebar Card - Desktop */}
        <aside className="hidden lg:block w-[260px] shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <nav aria-label="Menu do perfil">
              <ul className="space-y-0">
                {sidebarLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `block py-4 text-sm border-b border-light-gray-3 last:border-b-0 transition-colors ${
                          isActive
                            ? 'text-primary font-bold'
                            : 'text-dark-gray-2 hover:text-primary'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Sidebar - Mobile (horizontal tabs) */}
        <div className="lg:hidden relative -mx-4 px-4 flex items-center mb-4">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F9F8FE] via-[#F9F8FE]/80 to-transparent pointer-events-none flex items-center justify-start z-10 pb-3">
              <button
                type="button"
                className="pointer-events-auto h-7 w-7 rounded-full bg-white shadow-md flex items-center justify-center text-primary ml-2 hover:bg-light-gray-3 transition-colors"
                onClick={() => scrollBy(-150)}
                aria-label="Rolar menu para a esquerda"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onScroll={checkScroll}
          >
            <nav
              className="flex gap-6 border-b border-light-gray-3 min-w-max px-2"
              aria-label="Menu do perfil"
            >
              {sidebarLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `pb-3 text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-primary font-bold border-b-2 border-primary'
                        : 'text-dark-gray-2 hover:text-primary relative -bottom-px'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F9F8FE] via-[#F9F8FE]/80 to-transparent pointer-events-none flex items-center justify-end z-10 pb-3">
              <button
                type="button"
                className="pointer-events-auto h-7 w-7 rounded-full bg-white shadow-md flex items-center justify-center text-primary mr-2 hover:bg-light-gray-3 transition-colors"
                onClick={() => scrollBy(150)}
                aria-label="Rolar menu para a direita"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Content Card */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 min-h-[650px] flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
