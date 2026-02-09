import { ShoppingCart } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/types/Product'

interface BuyBoxProps {
  productId: string
  name: string
  image: string
  reference: string
  stars: number
  rating: number
  price: number
  priceDiscount?: number
  description: string
  selectedColor?: string
  selectedSize?: string
  children?: ReactNode
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

export function BuyBox({
  productId,
  name,
  image,
  reference,
  stars,
  rating,
  price,
  priceDiscount,
  description,
  selectedColor,
  selectedSize,
  children
}: BuyBoxProps) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const buildProduct = (): Product => ({
    id: productId,
    name,
    image,
    price,
    priceDiscount,
    description,
    reference,
    stars,
    rating
  })

  const validate = (): boolean => {
    if (!selectedColor || !selectedSize) {
      setValidationError('Selecione a cor e o tamanho antes de continuar.')
      setTimeout(() => setValidationError(null), 4000)
      return false
    }
    setValidationError(null)
    return true
  }

  const handleBuyClick = () => {
    if (!validate()) return
    addToCart(buildProduct(), 1, selectedColor, selectedSize)
    navigate('/carrinho')
  }

  const handleAddToCart = () => {
    if (!validate()) return
    addToCart(buildProduct(), 1, selectedColor, selectedSize)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho: Nome, Referência e Avaliação */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl lg:text-[32px] font-bold text-dark-gray leading-tight">
          {name}
        </h1>
        <span className="text-xs text-dark-gray-3">
          Casual | {reference.split(':')[0]} | REF:
          {reference.split(':')[1] || reference}
        </span>

        <div className="flex items-center gap-3 mt-2">
          {/* Estrelas de Avaliação */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(stars)
                    ? 'fill-warning'
                    : 'fill-light-gray-2'
                }`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label={`${star <= Math.floor(stars) ? 'Estrela preenchida' : 'Estrela vazia'}`}
              >
                <title>
                  {star <= Math.floor(stars)
                    ? 'Estrela preenchida'
                    : 'Estrela vazia'}
                </title>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>

          {/* Badge com Nota */}
          <div className="bg-warning px-3 py-1.5 rounded flex items-center gap-1.5">
            <span className="text-sm font-bold text-white">{stars}</span>
            <svg
              className="w-4 h-4 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Estrela de avaliação"
            >
              <title>Avaliação</title>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>

          <span className="text-sm text-light-gray">
            ({rating} {rating === 1 ? 'avaliação' : 'avaliações'})
          </span>
        </div>
      </div>

      {/* Preços */}
      <div className="flex items-center gap-3">
        {priceDiscount && priceDiscount < price ? (
          <>
            <span className="text-sm lg:text-base text-light-gray-2 line-through">
              {formatPrice(price)}
            </span>
            <span className="text-xl lg:text-[32px] font-bold text-dark-gray-2">
              {formatPrice(priceDiscount)}
            </span>
          </>
        ) : (
          <span className="text-xl lg:text-[32px] font-bold text-dark-gray-2">
            {formatPrice(price)}
          </span>
        )}
      </div>

      {/* Descrição do Produto */}
      <div>
        <h2 className="text-sm font-bold text-dark-gray-2 mb-2">
          Descrição do produto
        </h2>
        <p className="text-sm text-dark-gray-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Opções de Produto (Tamanho/Cor - children) */}
      {children && <div className="space-y-4">{children}</div>}

      {/* Notificação de validação */}
      {validationError && (
        <div className="bg-error/10 border border-error/30 text-error text-sm font-medium px-4 py-3 rounded-lg">
          {validationError}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Comprar → adiciona ao carrinho e navega */}
        <button
          type="button"
          onClick={handleBuyClick}
          className="w-full sm:w-auto sm:min-w-45 h-12 bg-warning text-white font-bold text-base rounded-xl hover:brightness-90 active:brightness-75 transition-all uppercase tracking-wide cursor-pointer min-h-11"
        >
          Comprar
        </button>

        {/* Adicionar ao carrinho → adiciona e permanece na página */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full sm:w-auto sm:min-w-45 h-12 border-2 border-warning text-warning font-bold text-sm rounded-xl hover:bg-warning/10 active:brightness-75 transition-all uppercase tracking-wide cursor-pointer min-h-11 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          {addedFeedback ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
        </button>
      </div>
    </div>
  )
}
