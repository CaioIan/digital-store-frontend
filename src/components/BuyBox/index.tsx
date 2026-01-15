import { type ReactNode } from 'react'

interface BuyBoxProps {
  name: string
  reference: string
  stars: number
  rating: number
  price: number
  priceDiscount?: number
  description: string
  children?: ReactNode // Aqui entrarão os ProductOptions
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

export function BuyBox({
  name,
  reference,
  stars,
  rating,
  price,
  priceDiscount,
  description,
  children
}: BuyBoxProps) {
  return (
    <div className="space-y-6">
      {/* Cabeçalho: Nome, Referência e Avaliação */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-bold text-dark-gray leading-tight">
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
            <span className="text-base text-light-gray-2 line-through">
              {formatPrice(price)}
            </span>
            <span className="text-[32px] font-bold text-dark-gray-2">
              {formatPrice(priceDiscount)}
            </span>
          </>
        ) : (
          <span className="text-[32px] font-bold text-dark-gray-2">
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

      {/* Botão Comprar (Call to Action) */}
      <button
        type="button"
        className="w-[220px] h-12 bg-warning text-white font-bold text-base rounded-[8px] hover:brightness-90 active:brightness-75 transition-all uppercase tracking-wide cursor-pointer"
      >
        Comprar
      </button>
    </div>
  )
}
