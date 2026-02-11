import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, clearCart, subtotal } = useCart()
  const modalRef = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora do modal (desktop)
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = () => {
      onClose()
    }

    // Usa bubble phase – cliques dentro do modal não chegam aqui
    // porque o container do modal faz stopPropagation
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 10)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Fecha com Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Previne scroll do body quando modal está aberto no mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    if (isOpen && isMobile) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const isEmpty = items.length === 0

  return (
    <>
      {/* Overlay mobile */}
      <div
        className="fixed inset-0 bg-black/40 z-999 lg:hidden"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-label="Meu Carrinho"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        className={`
          fixed z-1000
          /* Mobile: bottom sheet */
          inset-x-0 bottom-0 rounded-t-2xl
          max-h-[85vh]
          /* Desktop: dropdown ancorado */
          lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:mt-2
          lg:w-95 lg:rounded-lg lg:max-h-120
          bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]
          flex flex-col
          animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-top-2 duration-200
        `}
      >
        {/* Título */}
        <div className="px-5 pt-5 pb-0 shrink-0">
          <h2 className="text-base font-semibold text-dark-gray-2">
            Meu Carrinho
          </h2>
          <div className="h-px bg-light-gray-2 mt-3" />
        </div>

        {/* Conteúdo */}
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 gap-4">
            <p className="text-sm text-light-gray">Seu carrinho está vazio</p>
            <Link
              to="/products"
              onClick={onClose}
              className="h-10 px-6 bg-primary text-white text-sm font-semibold rounded-full flex items-center justify-center hover:bg-tertiary transition-colors"
            >
              Continuar comprando
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de produtos (scroll) */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </div>

            {/* Divisor + Total + Ações (fixo no bottom) */}
            <div className="shrink-0 px-5 pb-5">
              <div className="h-px bg-light-gray-2 mb-4" />

              {/* Total */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-dark-gray">
                  Valor total:
                </span>
                <span className="text-[15px] font-bold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearCart()
                  }}
                  className="text-sm text-dark-gray-2 underline underline-offset-2 hover:text-dark-gray transition-colors cursor-pointer bg-transparent border-none"
                >
                  Esvaziar
                </button>
                <Link
                  to="/carrinho"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="h-10 px-6 bg-primary text-white text-sm font-semibold rounded-[5px] flex items-center justify-center hover:bg-tertiary transition-colors"
                >
                  Ver Carrinho
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

/* ─── Item individual do carrinho ─── */

import type { CartItem } from '@/types/CartItem'

function CartItemRow({ item }: { item: CartItem }) {
  const { product, quantity } = item
  const hasDiscount =
    product.priceDiscount && product.priceDiscount < product.price

  const displayPrice = hasDiscount
    ? (product.priceDiscount as number)
    : product.price
  const totalItemPrice = displayPrice * quantity

  return (
    <div className="flex items-start gap-3">
      {/* Thumbnail */}
      <div className="w-14 h-14 shrink-0 rounded-md bg-secondary/20 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-dark-gray leading-snug">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-dark-gray">
            {formatPrice(totalItemPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-light-gray-2 line-through">
              {formatPrice(product.price * quantity)}
            </span>
          )}
        </div>
      </div>

      {/* Quantidade */}
      {quantity > 1 && (
        <span className="shrink-0 self-center text-[11px] text-light-gray font-medium">
          x{quantity}
        </span>
      )}
    </div>
  )
}
