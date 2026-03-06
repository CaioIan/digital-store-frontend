import RouterLink from '@/components/RouterLink'

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

/**
 * Componente de Card de Produto.
 * Exibe a imagem, categoria, nome e preços (com ou sem desconto).
 * Calcula automaticamente a porcentagem de desconto para exibição do Badge.
 */
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
    <RouterLink
      to={`/product/${id}`}
      className="group flex flex-col w-full max-w-[292px] transition-transform duration-300 mx-auto h-full"
      aria-label={`Ver detalhes de ${name}`}
    >
      {/* Área da Imagem — Mobile: 163x179px | Desktop: 292x321px */}
      <div 
        className="relative w-full flex items-center justify-center shrink-0"
        style={{ aspectRatio: 'var(--img-ratio)' }}
      >
        <style>{`
          .group .relative { --img-ratio: 163/179; }
          @media (min-width: 1024px) { .group .relative { --img-ratio: 292/321; } }
        `}</style>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.03)] transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge de Desconto */}
        {discountPercentage > 0 && (
          <span
            className="absolute left-3 top-3 rounded-full bg-warning px-3 py-1 text-xs font-bold text-white"
            role="img"
            aria-label={`${discountPercentage} percent discount`}
          >
            {discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Área de Informações */}
      <div className="pt-2 lg:pt-4 flex flex-col justify-between flex-1">
        <div>
          {/* Categoria */}
          <span className="block text-[10px] lg:text-xs font-bold text-light-gray tracking-wide mb-1 lg:mb-2 uppercase">
            {category}
          </span>

          {/* Nome do Produto */}
          <h3
            className="line-clamp-2 text-xs lg:text-base font-normal leading-snug text-dark-gray-2 mb-2 lg:mb-4"
            title={name}
          >
            {name}
          </h3>
        </div>

        {/* Preços — na mesma linha */}
        <div className="flex items-baseline gap-2 mt-auto">
          {priceDiscount && priceDiscount < price ? (
            <>
              <span className="text-xs lg:text-sm text-light-gray line-through">
                {formatPrice(price)}
              </span>
              <span className="text-sm lg:text-xl font-bold text-dark-gray">
                {formatPrice(priceDiscount)}
              </span>
            </>
          ) : (
            <span className="text-sm lg:text-xl font-bold text-dark-gray">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </RouterLink>
  )
}
