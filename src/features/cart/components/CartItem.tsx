import { Minus, Plus } from 'lucide-react'
import { formatPrice } from '@/shared/utils'
import type { CartItem as CartItemType } from '../types/CartItem'

interface CartItemProps {
  item: CartItemType
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  variant?: 'desktop' | 'mobile'
}

/**
 * Componente que representa um item individual no carrinho.
 * 
 * Suporta dois modos de visualização (variantes):
 * - `desktop`: Layout em grid para telas grandes.
 * - `mobile`: Layout em coluna otimizado para telas pequenas.
 * 
 * @param {CartItemProps} props - Propriedades do item, funções de remoção e atualização.
 * @returns {JSX.Element} Elemento renderizado do item do carrinho.
 */
export const CartItem = ({
  item,
  onRemove,
  onUpdateQuantity,
  variant = 'desktop'
}: CartItemProps) => {
  const unitPrice = item.product.priceDiscount || item.product.price
  const itemTotal = unitPrice * item.quantity
  const hasDiscount =
    item.product.priceDiscount
    && item.product.priceDiscount < item.product.price

  if (variant === 'mobile') {
    return (
      <div className="py-6 first:pt-0 last:pb-0">
        <div className="flex gap-4 items-start mb-5">
          <div className="w-25 h-25 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0 pt-0.5">
            <p className="text-sm font-bold text-dark-gray-2 leading-snug">
              {item.product.name}
            </p>
            {item.selectedColor && (
              <span className="text-xs text-dark-gray-3 mt-1">
                Cor: {item.selectedColor}
              </span>
            )}
            {item.selectedSize && (
              <span className="text-xs text-dark-gray-3">
                Tamanho: {item.selectedSize}
              </span>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col items-center">
          <span className="text-xs font-medium text-light-gray uppercase block mb-3 self-start">
            QUANTIDADE
          </span>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-14 h-11 flex items-center justify-center border border-light-gray-2 rounded-md bg-white text-dark-gray-2 hover:bg-light-gray-3 disabled:opacity-40 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-14 h-11 flex items-center justify-center text-base font-medium text-dark-gray-2">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-14 h-11 flex items-center justify-center border border-light-gray-2 rounded-md bg-white text-dark-gray-2 hover:bg-light-gray-3 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-xs text-dark-gray-3 underline hover:text-dark-gray-2 transition-colors mt-2"
          >
            Remover item
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-4">
          <span className="text-sm font-medium text-dark-gray-3 uppercase">
            UNITÁRIO
          </span>
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-sm text-light-gray-2 line-through">
                {formatPrice(item.product.price)}
              </span>
            )}
            <span className="text-base font-bold text-dark-gray-2">
              {formatPrice(unitPrice)}
            </span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-dark-gray-3 uppercase">
            TOTAL
          </span>
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-sm text-light-gray-2 line-through">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            )}
            <span className="text-base font-bold text-dark-gray-2">
              {formatPrice(itemTotal)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-5 first:pt-0">
      <div className="grid grid-cols-[1fr_140px_120px_120px] gap-4 items-center">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-sm font-semibold text-dark-gray-2 leading-snug line-clamp-2">
              {item.product.name}
            </p>
            {item.selectedColor && (
              <span className="text-xs text-light-gray">
                Cor: {item.selectedColor}
              </span>
            )}
            {item.selectedSize && (
              <span className="text-xs text-light-gray">
                Tamanho: {item.selectedSize}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-0">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center border border-light-gray-2 rounded-l text-dark-gray-2 hover:bg-light-gray-3 disabled:opacity-40 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 h-8 flex items-center justify-center border-y border-light-gray-2 text-sm font-medium text-dark-gray-2">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-light-gray-2 rounded-r text-dark-gray-2 hover:bg-light-gray-3 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-xs text-dark-gray-3 underline hover:text-dark-gray-2 transition-colors"
          >
            Remover item
          </button>
        </div>

        <div className="text-right">
          {hasDiscount && (
            <span className="block text-xs text-light-gray-2 line-through">
              {formatPrice(item.product.price)}
            </span>
          )}
          <span className="text-sm font-bold text-dark-gray-2">
            {formatPrice(unitPrice)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-dark-gray-2">
            {formatPrice(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
