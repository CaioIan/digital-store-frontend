import { Link } from 'react-router-dom'

interface ProductCardProps {
  id: string
  name: string
  image: string
  price: number
  priceDiscount?: number
  category?: string
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

export default function ProductCard({
  id,
  name,
  image,
  price,
  priceDiscount,
  category = 'Tênis'
}: ProductCardProps) {
  const calculateDiscount = () => {
    if (!priceDiscount || priceDiscount >= price || price <= 0) return 0
    return Math.round(((price - priceDiscount) / price) * 100)
  }

  const discountPercentage = calculateDiscount()

  return (
    <Link
      to={`/product/${id}`}
      className="group block rounded-lg transition-shadow hover:shadow-sm"
      aria-label={`Ver detalhes de ${name}`}
    >
      {/* Container da Imagem com Badge de Desconto */}
      <div className="relative flex aspect-[3/4] w-full items-center justify-center p-1 sm:p-2">
        <img
          src={image}
          alt={name}
          className="h-full w-full rounded object-contain shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge de Desconto (só aparece se tiver desconto) */}
        {discountPercentage > 0 && (
          <span
            className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-warning px-2 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-dark-gray"
            role="img"
            aria-label={`${discountPercentage} percent discount`}
          >
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Área de Informações do Produto */}
      <div className="p-2 sm:p-4">
        {/* Categoria */}
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-light-gray">
          {category}
        </span>

        {/* Nome do Produto (limitado a 2 linhas) */}
        <h3
          className="mb-2 line-clamp-2 text-sm md:text-[24px] font-normal leading-tight md:leading-9.5 tracking-[0.75px] text-dark-gray-2"
          title={name}
        >
          {name}
        </h3>

        {/* Área de Preços */}
        <div className="flex flex-col gap-1">
          {priceDiscount ? (
            <>
              {/* Preço Antigo (riscado) */}
              <span className="text-xs md:text-base text-light-gray line-through decoration-light-gray-2 decoration-2">
                {formatPrice(price)}
              </span>
              {/* Preço com Desconto */}
              <span className="text-base md:text-xl font-bold text-dark-gray">
                {formatPrice(priceDiscount)}
              </span>
            </>
          ) : (
            /* Preço Normal (sem desconto) */
            <span className="text-base md:text-xl font-bold text-dark-gray">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
