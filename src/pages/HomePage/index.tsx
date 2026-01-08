import { useEffect, useState } from 'react'
import { Gallery } from '@/components/Gallery'
import { HeroSlide } from '@/components/HeroSlide'
import ProductCard from '@/components/ProductCard'
import Section from '@/components/Section'
import { getProducts } from '@/services/productService'
import type { Product } from '@/types/Product'

// Dados do Hero Banner (Seção 5.1)
const heroSlides = [
  {
    src: '/home-slide-1.jpeg',
    alt: 'Queima de estoque Nike',
    badge: 'Melhores ofertas personalizadas',
    title: 'Queima de estoque Nike 🔥',
    description:
      'Consequat culpa exercitation mollit nisi excepteur do do tempor laboris eiusmod irure consectetur.',
    buttonText: 'Ver Ofertas',
    buttonLink: '/products',
    imageSrc: '/produc-image-5.jpeg'
  },
  {
    src: '/home-slide-2.jpeg',
    alt: 'Nova coleção de verão',
    badge: 'Lançamento exclusivo',
    title: 'Nova coleção de verão ☀️',
    description:
      'Descubra as últimas tendências em calçados esportivos com design moderno e conforto incomparável.',
    buttonText: 'Comprar Agora',
    buttonLink: '/products',
    imageSrc: '/produc-image-5.jpeg'
  },
  {
    src: '/home-slide-3.jpeg',
    alt: 'Tênis de corrida profissional',
    badge: 'Performance máxima',
    title: 'Tênis de alta performance 🏃',
    description:
      'Tecnologia de ponta para atletas que buscam superar seus limites e alcançar novos recordes.',
    buttonText: 'Conhecer Mais',
    buttonLink: '/products',
    imageSrc: '/produc-image-5.jpeg'
  }
]

// Coleções em destaque (Seção 5.2)
const collections = [
  { src: '/collection-1.png', alt: 'Coleção Casual' },
  { src: '/collection-2.png', alt: 'Coleção Esportiva' },
  { src: '/collection-3.png', alt: 'Coleção Premium' }
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data.slice(0, 8))
        setError(null)
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente mais tarde.')
        console.error('Erro ao buscar produtos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="space-y-16">
      {/* Hero Banner com Gallery - Modo Autoplay (Seção 5.1) */}
      <Gallery
        slides={heroSlides.map((slide) => ({ src: slide.src, alt: slide.alt }))}
        width="100%"
        height="681px"
        radius="0px"
        autoplay={true}
        autoplayDelay={4000}
        showDots={true}
        className="w-full"
      >
        {(_slide, index) => (
          <HeroSlide
            badge={heroSlides[index].badge}
            title={heroSlides[index].title}
            description={heroSlides[index].description}
            buttonText={heroSlides[index].buttonText}
            buttonLink={heroSlides[index].buttonLink}
            imageSrc={heroSlides[index].imageSrc}
            imageAlt={heroSlides[index].alt}
          />
        )}
      </Gallery>

      <div className="max-w-7xl mx-auto px-8 space-y-16">
        {/* Coleções em Destaque (Seção 5.2) */}
        <Section title="Coleções em destaque" titleAlign="left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <div
                key={`collection-${collection.src}`}
                className="overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={collection.src}
                  alt={collection.alt}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Produtos em Alta (Seção 5.3) */}
        <Section
          title="Produtos em Alta"
          link={{ text: 'Ver Todos', href: '/products' }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-light-gray">Carregando produtos...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-error">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-8 gap-y-6">
              {products.map((product) => (
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
          )}
        </Section>
      </div>
    </div>
  )
}
