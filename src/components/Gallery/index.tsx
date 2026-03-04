import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'

export interface GallerySlide {
  src: string
  alt?: string
  style?: CSSProperties
}

interface GalleryProps {
  slides: GallerySlide[]
  showThumbs?: boolean
  showDots?: boolean
  className?: string
  width?: string
  height?: string
  radius?: string
  autoplay?: boolean
  autoplayDelay?: number
  children?: (slide: GallerySlide, index: number) => ReactNode
  onApiReady?: (api: CarouselApi) => void // Callback para expor a API
  objectFit?: 'contain' | 'cover' // Estratégia de ajuste da imagem
  imagePadding?: string // Padding ao redor da imagem (ex: 'p-8', 'p-0')
  dotsPosition?: 'absolute' | 'relative' // Posição dos dots: absolute (sobre o conteúdo) ou relative (abaixo)
  dotsClassName?: string // Classes customizadas para os dots container
}

export function Gallery({
  slides,
  showThumbs = false,
  showDots = false,
  className,
  width = '100%',
  height = 'auto',
  radius = '4px',
  autoplay = false,
  autoplayDelay = 3000,
  children,
  onApiReady,
  objectFit = 'cover',
  imagePadding = 'p-0',
  dotsPosition = 'absolute',
  dotsClassName
}: GalleryProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const thumbContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true) // Assumindo verdadeiro inicialmente se houver muitas

  const checkScroll = () => {
    if (thumbContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth)
    }
  }

  // Verificar o scroll na inicialização e resize
  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [slides.length])

  const scrollThumbs = (direction: 'left' | 'right') => {
    if (thumbContainerRef.current) {
      const scrollAmount = 250 // Scroll distance in pixels
      thumbContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Configurar plugin de autoplay se necessário
  const plugins = autoplay
    ? [
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: true
        })
      ]
    : []

  // Converter radius para classes Tailwind quando possível
  const getRadiusClass = (radiusValue: string) => {
    const radiusMap: Record<string, string> = {
      '0px': 'rounded-none',
      '2px': 'rounded-sm',
      '4px': 'rounded',
      '6px': 'rounded-md',
      '8px': 'rounded-lg',
      '12px': 'rounded-xl',
      '16px': 'rounded-2xl',
      '24px': 'rounded-3xl',
      '9999px': 'rounded-full'
    }
    return radiusMap[radiusValue] || 'rounded'
  }

  const radiusClass = getRadiusClass(radius)

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    // Expõe a API para o componente pai
    if (onApiReady) {
      onApiReady(api)
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    const onReInit = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    api.on('reInit', onReInit)

    return () => {
      api.off('select', onSelect)
      api.off('reInit', onReInit)
    }
  }, [api, onApiReady])

  const scrollTo = (index: number) => {
    api?.scrollTo(index)
  }

  return (
    <div className={cn('relative flex flex-col gap-4', className)}>
      {/* Carrossel Principal */}
      <Carousel
        setApi={setApi}
        plugins={plugins}
        className="w-full"
        opts={{
          loop: true,
          align: 'start'
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={`slide-${slide.src}-${index}`}>
              <div
                className={cn(
                  'relative overflow-hidden flex items-center justify-center',
                  radiusClass
                )}
                style={{
                  width: width,
                  height: height,
                  backgroundColor: slide.style?.backgroundColor || '#F5F5F5',
                  ...slide.style
                }}
              >
                {children ? (
                  children(slide, index)
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.alt || `Slide ${index + 1}`}
                    className={`max-w-full max-h-full object-${objectFit} ${imagePadding}`}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Indicadores de Slide (Dots) */}
        {showDots && slides.length > 1 && (
          <div
            className={cn(
              'z-20 flex gap-2',
              dotsPosition === 'absolute'
                ? 'absolute bottom-6 left-1/2 -translate-x-1/2'
                : 'relative mt-6 justify-center',
              dotsClassName
            )}
          >
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.src}-${index}`}
                type="button"
                onClick={() => scrollTo(index)}
                className={cn(
                  'h-3 w-3 rounded-full transition-all duration-300',
                  current === index
                    ? 'bg-primary'
                    : 'bg-light-gray-2 hover:bg-light-gray'
                )}
                aria-label={`Ir para slide ${index + 1}`}
                aria-current={current === index ? true : undefined}
              />
            ))}
          </div>
        )}
      </Carousel>

      {/* Thumbnails (Modo Produto - Seção 7.1) */}
      {showThumbs && slides.length > 1 && (
        <div className="relative group mt-2 flex items-center">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-ui-background via-ui-background/80 to-transparent pointer-events-none flex items-center justify-start z-10 pb-4">
              <button
                type="button"
                onClick={() => scrollThumbs('left')}
                className="pointer-events-auto h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white shadow flex items-center justify-center text-dark-gray-2 hover:text-primary hover:bg-light-gray-3 transition-colors ml-1 lg:-ml-2"
                aria-label="Rolar miniaturas para esquerda"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          )}

          <div 
            ref={thumbContainerRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth px-1 w-full"
            style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: '#cccccc transparent' 
            }}
          >
            {slides.map((slide, index) => (
              <button
                key={`thumb-${slide.src}-${index}`}
                type="button"
                onClick={() => scrollTo(index)}
                className={cn(
                  'cursor-pointer overflow-hidden transition-all duration-200 flex items-center justify-center snap-center',
                  'h-20 w-20 sm:h-24 sm:w-24 shrink-0',
                  radiusClass,
                  current === index
                    ? 'border-2 border-primary ring-2 ring-primary/20'
                    : 'border-2 border-transparent hover:border-light-gray-2'
                )}
                style={{
                  backgroundColor: slide.style?.backgroundColor || '#F5F5F5'
                }}
                aria-label={`Ver imagem ${index + 1}`}
                aria-current={current === index ? true : undefined}
              >
                <img
                  src={slide.src}
                  alt={slide.alt || `Miniatura ${index + 1}`}
                  className={`h-full w-full object-${objectFit} p-1`}
                />
              </button>
            ))}
          </div>

          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-ui-background via-ui-background/80 to-transparent pointer-events-none flex items-center justify-end z-10 pb-4">
              <button
                type="button"
                onClick={() => scrollThumbs('right')}
                className="pointer-events-auto h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white shadow flex items-center justify-center text-dark-gray-2 hover:text-primary hover:bg-light-gray-3 transition-colors mr-1 lg:-mr-2"
                aria-label="Rolar miniaturas para direita"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
