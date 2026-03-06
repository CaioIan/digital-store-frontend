import { Gallery } from '@/components/Gallery'
import { HeroSlide } from '@/components/HeroSlide'
import ProductCard from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import RouterLink from '@/components/RouterLink'
import Section from '@/components/Section'
import { Skeleton } from '@/components/ui/skeleton'
import { getProducts } from '@/services/productService'
import { useQuery } from '@tanstack/react-query'

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
    imageSrc: '/tenis-nike.webp'
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
    imageSrc: '/tenis-nike.webp'
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
    imageSrc: '/tenis-nike.webp'
  }
]

// Coleções em destaque (Seção 5.2)
const collections = [
  { src: '/collection-1.webp', alt: 'Coleção Casual' },
  { src: '/collection-2.webp', alt: 'Coleção Esportiva' },
  { src: '/collection-3.webp', alt: 'Coleção Premium' }
]

/**
 * Página Inicial (Home).
 * Contém o Hero Banner (Gallery), Coleções em Destaque, 
 * Categorias Rápidas e a vitrine de "Produtos em Alta" buscados via API.
 */
export default function HomePage() {
  const {
    data: products = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      try {
        const response = await getProducts({ limit: 8 })
        return response.data
      } catch {
        throw new Error(
          'Erro ao carregar produtos. Tente novamente mais tarde.'
        )
      }
    }
  })

  return (
    <div className="space-y-8 lg:space-y-16">
      {/* Hero Banner Skeleton (while loading) or Gallery */}
      {isLoading ? (
        <div className="w-full h-[500px] md:h-[600px] lg:h-[700px]">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      ) : (
        <Gallery
          slides={heroSlides.map((slide) => ({
            src: slide.src,
            alt: slide.alt
          }))}
          width="100%"
          height="auto"
          radius="0px"
          autoplay={true}
          autoplayDelay={4000}
          showDots={true}
          dotsPosition="relative"
          dotsClassName="pb-6"
          className="w-full bg-light-gray-3"
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
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 lg:space-y-16">
        {/* Coleções em Destaque (Seção 5.2) */}
        <Section title="Coleções em destaque" titleAlign="left">
          <div className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <div
                key={`collection-${collection.src}`}
                className="overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={collection.src}
                  alt={collection.alt}
                  className="w-full h-32 min-[500px]:h-24 sm:h-28 md:h-36 lg:h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Categorias em Destaque */}
        <Section title="Coleções em destaque" titleAlign="center">
          <div className="flex justify-start min-[546px]:justify-center items-center gap-6 min-[546px]:gap-12 overflow-x-auto pb-4 -mx-4 px-4 min-[546px]:mx-0 min-[546px]:px-0 min-[546px]:overflow-visible min-[546px]:flex-wrap scrollbar-hide">
            {/* Camisetas */}
            <button
              type="button"
              onClick={() => {}}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-light-gray-3 flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-all overflow-hidden duration-300">
                <img
                  src="/cat_tshirt_minimal.svg"
                  alt="Camisetas"
                  className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-dark-gray-2 text-sm font-medium group-hover:text-primary transition-colors">
                Camisetas
              </span>
            </button>

            {/* Calças */}
            <button
              type="button"
              onClick={() => {}}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-light-gray-3 flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-all overflow-hidden duration-300">
                <img
                  src="/cat_pants_minimal.svg"
                  alt="Calças"
                  className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-dark-gray-2 text-sm font-medium group-hover:text-primary transition-colors">
                Calças
              </span>
            </button>

            {/* Bonés */}
            <button
              type="button"
              onClick={() => {}}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-light-gray-3 flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-all overflow-hidden duration-300">
                <img
                  src="/cat_cap_minimal.svg"
                  alt="Bonés"
                  className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-dark-gray-2 text-sm font-medium group-hover:text-primary transition-colors">
                Bonés
              </span>
            </button>

            {/* Headphones */}
            <button
              type="button"
              onClick={() => {}}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-light-gray-3 flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-all overflow-hidden duration-300">
                <img
                  src="/cat_headphones_minimal.svg"
                  alt="Headphones"
                  className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-dark-gray-2 text-sm font-medium group-hover:text-primary transition-colors">
                Headphones
              </span>
            </button>

            {/* Tênis */}
            <button
              type="button"
              onClick={() => {}}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-light-gray-3 flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-all overflow-hidden duration-300">
                <img
                  src="/cat_sneakers_minimal.svg"
                  alt="Tênis"
                  className="w-full h-full object-contain p-4 mix-blend-multiply group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-dark-gray-2 text-sm font-medium group-hover:text-primary transition-colors">
                Tênis
              </span>
            </button>
          </div>
        </Section>

        {/* Produtos em Alta (Seção 5.3) */}
        <Section
          title="Produtos em Alta"
          link={{ text: 'Ver Todos', href: '/products' }}
        >
          {error ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-error">
                {error instanceof Error
                  ? error.message
                  : 'Erro ao buscar produtos'}
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-x-8 lg:gap-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-full w-full">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-x-8 lg:gap-y-6">
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

        {/* Seção Oferta Especial - Air Jordan */}
        <section className="py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Imagem do Tênis com Eclipse de fundo */}
            <div className="flex-1 flex justify-center relative">
              {/* Eclipse de fundo */}
              <div 
                className="absolute inset-x-0 -top-4 bottom-0 z-0 flex items-center justify-center opacity-70"
                aria-hidden="true"
              >
                <img
                  src="/ellipse.webp"
                  alt=""
                  className="w-full h-auto max-w-[466px] object-contain"
                />
              </div>

              {/* Tênis em destaque */}
              <img
                src="/air-jordan-collection-oferta.webp"
                alt="Air Jordan edição de colecionador"
                className="relative z-10 max-w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 space-y-4 flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                Oferta especial
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-dark-gray">
                Air Jordan edição de colecionador
              </h2>
              <p className="text-dark-gray-2 text-base leading-relaxed text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip
              </p>
              <RouterLink
                to="/products"
                className="inline-block bg-primary text-white font-bold text-sm px-8 py-3 rounded hover:bg-tertiary transition-colors mt-4"
              >
                Ver Oferta
              </RouterLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
