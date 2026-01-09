import { useParams } from 'react-router-dom'
import { Gallery } from '@/components/Gallery'
import ProductCard from '@/components/ProductCard'
import Section from '@/components/Section'

// Imagens do produto para a galeria (Seção 7.1)
const productImages = [
  { src: '/product-image-1.jpeg', alt: 'Produto - Vista frontal' },
  { src: '/product-image-2.jpeg', alt: 'Produto - Vista lateral' },
  { src: '/product-image-3.jpeg', alt: 'Produto - Vista traseira' },
  { src: '/product-image-4.jpeg', alt: 'Produto - Detalhe' },
  { src: '/product-image-5.jpeg', alt: 'Produto - Em uso' }
]

// Produtos recomendados mockados
const relatedProducts = [
  {
    id: '1',
    name: 'Tênis Nike Revolution 6',
    image: '/product-thumb-1.jpeg',
    price: 219.0,
    priceDiscount: 149.9,
    category: 'Esporte'
  },
  {
    id: '2',
    name: 'Tênis Adidas Ultraboost',
    image: '/product-thumb-2.jpeg',
    price: 499.0,
    priceDiscount: 399.0,
    category: 'Esporte'
  },
  {
    id: '3',
    name: 'Tênis Puma RS-X',
    image: '/product-thumb-3.jpeg',
    price: 349.0,
    category: 'Casual'
  },
  {
    id: '4',
    name: 'Tênis New Balance 574',
    image: '/product-thumb-4.jpeg',
    price: 399.0,
    priceDiscount: 299.0,
    category: 'Casual'
  }
]

export default function ProductViewPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 space-y-16">
      {/* Área do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery com Thumbnails - Modo Produto (Seção 7.1) */}
        <Gallery
          slides={productImages}
          showThumbs={true}
          width="700px"
          height="570px"
          radius="4px"
          className="w-full"
        />

        {/* BuyBox (será implementado em outra task) */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-dark-gray">
              Tênis Nike Revolution 6 Next Nature Masculino
            </h1>
            <p className="text-sm text-dark-gray-3">Ref: {id}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-warning px-3 py-1 rounded">
              <span className="text-sm font-bold text-white">4.7</span>
              <svg
                className="w-4 h-4 fill-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Estrela de avaliação"
              >
                <title>Avaliação</title>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-sm text-light-gray">(90 avaliações)</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-sm text-light-gray-2 line-through">
                R$ 219,00
              </span>
              <span className="text-3xl font-bold text-dark-gray-2">
                R$ 149,90
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-dark-gray-2">Descrição</h3>
            <p className="text-sm text-dark-gray-2 leading-relaxed">
              O Tênis Nike Revolution 6 Next Nature oferece conforto e estilo
              para o dia a dia. Feito com materiais sustentáveis, possui
              amortecimento macio e design moderno perfeito para corridas leves
              e uso casual.
            </p>
          </div>

          <button
            type="button"
            className="w-full bg-warning text-white font-bold py-3 px-6 rounded hover:bg-warning/90 transition-colors"
          >
            COMPRAR
          </button>
        </div>
      </div>

      {/* Produtos Recomendados (Seção 7.4) */}
      <Section
        title="Produtos recomendados"
        titleAlign="left"
        link={{ text: 'Ver todos', href: '/products' }}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-8 gap-y-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              priceDiscount={product.priceDiscount}
              category={product.category}
            />
          ))}
        </div>
      </Section>
    </div>
  )
}
