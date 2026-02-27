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
      className="group block rounded-lg border border-light-gray-2/40 bg-white transition-all hover:shadow-md overflow-hidden"
      aria-label={`Ver detalhes de ${name}`}
    >
      {/* Área da Imagem — fundo cinza claro, imagem centralizada */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-[240px] lg:h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
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
      <div className="px-2 pt-3 pb-4">
        {/* Categoria */}
        <span className="block text-xs font-medium text-light-gray tracking-wide mb-1">
          {category}
        </span>

        {/* Nome do Produto */}
        <h3
          className="line-clamp-2 text-sm lg:text-base font-medium leading-snug text-dark-gray-2 mb-2"
          title={name}
        >
          {name}
        </h3>

        {/* Preços — na mesma linha */}
        <div className="flex items-baseline gap-2">
          {priceDiscount ? (
            <>
              <span className="text-sm text-light-gray line-through">
                {formatPrice(price)}
              </span>
              <span className="text-base font-bold text-dark-gray">
                {formatPrice(priceDiscount)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-dark-gray">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </RouterLink>
  )
}
