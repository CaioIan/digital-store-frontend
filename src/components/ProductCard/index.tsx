import { Link } from 'react-router-dom'

interface ProductCardProps {
  id: string
  name: string
  image: string
  price: number
  priceDiscount?: number
  category?: string
}

export const ProductCard = ({
  id,
  name,
  image,
  price,
  priceDiscount,
  category = 'Tênis'
}: ProductCardProps) => {
  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)

  const calculateDiscount = () => {
    if (!priceDiscount) return 0
    return Math.round(((price - priceDiscount) / price) * 100)
  }

  return (
    <Link
      to={`/product/${id}`}
      className="group block w-[310px] rounded-lg transition-shadow hover:shadow-sm"
    >
      {/* Container da Imagem com Badge de Desconto */}
      <div className="relative flex h-[321px] w-full items-center justify-center p-2">
        <img
          src={image}
          alt={name}
          className="h-full w-full rounded object-contain shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge de Desconto (só aparece se tiver desconto) */}
        {priceDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-warning px-4 py-1.5 text-sm font-bold text-dark-gray">
            {calculateDiscount()}% OFF
          </span>
        )}
      </div>

      {/* Área de Informações do Produto */}
      <div className="p-4">
        {/* Categoria */}
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-light-gray">
          {category}
        </span>

        {/* Nome do Produto (limitado a 2 linhas) */}
        <h3
          className="mb-2 line-clamp-2 text-[24px] font-normal leading-[38px] tracking-[0.75px] text-dark-gray-2"
          title={name}
        >
          {name}
        </h3>

        {/* Área de Preços */}
        <div className="flex items-baseline gap-2">
          {priceDiscount ? (
            <>
              {/* Preço Antigo (riscado) */}
              <span className="text-xl text-light-gray line-through decoration-light-gray-2 decoration-2">
                {formatPrice(price)}
              </span>
              {/* Preço com Desconto */}
              <span className="text-2xl font-bold text-dark-gray">
                {formatPrice(priceDiscount)}
              </span>
            </>
          ) : (
            /* Preço Normal (sem desconto) */
            <span className="text-2xl font-bold text-dark-gray">
              {formatPrice(price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
