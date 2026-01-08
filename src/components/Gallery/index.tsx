import Autoplay from 'embla-carousel-autoplay'
import { type ReactNode, useEffect, useState } from 'react'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

export interface GallerySlide {
  src: string
  alt?: string
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
}

export function Gallery({
  slides,
  showThumbs = false,
  showDots = false,
  className,
  width,
  height,
  radius = '4px',
  autoplay = false,
  autoplayDelay = 3000,
  children
}: GalleryProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // Configurar plugin de autoplay se necessário
  const plugins = autoplay
    ? [
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: true
        })
      ]
    : []

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

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
                className="relative overflow-hidden bg-light-gray-3"
                style={{
                  width: width || '100%',
                  height: height || 'auto',
                  borderRadius: radius
                }}
              >
                {children ? (
                  children(slide, index)
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.alt || `Slide ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Setas de navegação */}
        <CarouselPrevious
          className={cn(
            'left-4 h-12 w-12 border-2 border-white bg-white/80 backdrop-blur-sm hover:bg-white disabled:opacity-50',
            'text-dark-gray-2 hover:text-primary'
          )}
        />
        <CarouselNext
          className={cn(
            'right-4 h-12 w-12 border-2 border-white bg-white/80 backdrop-blur-sm hover:bg-white disabled:opacity-50',
            'text-dark-gray-2 hover:text-primary'
          )}
        />

        {/* Indicadores de Slide (Dots) */}
        {showDots && slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.src}-${index}`}
                type="button"
                onClick={() => scrollTo(index)}
                className={cn(
                  'h-3 w-3 rounded-full transition-all duration-300',
                  current === index
                    ? 'bg-primary w-8'
                    : 'bg-light-gray-2 hover:bg-light-gray'
                )}
                aria-label={`Ir para slide ${index + 1}`}
                aria-current={current === index ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </Carousel>

      {/* Thumbnails (Modo Produto - Seção 7.1) */}
      {showThumbs && slides.length > 1 && (
        <div className="flex gap-4 justify-center flex-wrap">
          {slides.map((slide, index) => (
            <button
              key={`thumb-${slide.src}-${index}`}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                'cursor-pointer overflow-hidden transition-all duration-200',
                'h-24 w-24 shrink-0',
                current === index
                  ? 'border-2 border-primary ring-2 ring-primary/20'
                  : 'border-2 border-transparent hover:border-light-gray-2'
              )}
              style={{
                borderRadius: radius
              }}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={current === index ? 'true' : 'false'}
            >
              <img
                src={slide.src}
                alt={slide.alt || `Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
