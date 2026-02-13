import RouterLink from '@/components/RouterLink'

interface HeroSlideProps {
  badge?: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  imageSrc: string
  imageAlt: string
}

export function HeroSlide({
  badge,
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
  imageAlt
}: HeroSlideProps) {
  return (
    <div className="relative h-full w-full bg-light-gray-3 overflow-hidden">
      {/* Pontos decorativos - canto superior direito */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8 grid grid-cols-5 gap-1.5 md:gap-2 opacity-60 z-0">
        {[...Array(25)].map((_, i) => {
          const id = `dot-row${Math.floor(i / 5)}-col${i % 5}`
          return (
            <div
              key={id}
              className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-warning"
            />
          )
        })}
      </div>

      {/* Container principal - Mobile First (vertical) */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center px-4 py-6 md:px-8 lg:flex-row lg:items-center lg:gap-8 lg:py-12">
        {/* Área da Imagem do Produto */}
        <div className="relative flex w-full items-center justify-center lg:w-1/2 lg:order-2">
          <div className="relative flex items-center justify-center">
            {/* Imagem do produto */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="relative z-10 h-auto w-full max-w-70 object-contain drop-shadow-2xl sm:max-w-80 md:max-w-95 lg:max-w-md"
            />
          </div>
        </div>

        {/* Conteúdo Textual - Centralizado no mobile */}
        <div className="flex w-full flex-col items-center space-y-4 text-center lg:w-1/2 lg:items-start lg:space-y-6 lg:text-left lg:order-1">
          {/* Eyebrow text */}
          {badge && (
            <p className="text-sm font-medium tracking-wide text-primary md:text-base">
              {badge}
            </p>
          )}

          {/* Título Principal */}
          <h1 className="text-3xl font-extrabold leading-tight text-dark-gray sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
            {title}
          </h1>

          {/* Descrição */}
          <p className="max-w-xs text-sm leading-relaxed text-dark-gray-3 sm:max-w-sm sm:text-base md:max-w-md lg:max-w-lg lg:text-lg">
            {description}
          </p>

          {/* Botão CTA - quadrado, largo no mobile */}
          <RouterLink
            to={buttonLink}
            className="mt-2 w-full max-w-xs rounded-md bg-primary px-8 py-4 text-center text-base font-bold text-white transition-all duration-200 hover:bg-tertiary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:max-w-sm md:w-auto md:px-12 md:py-4"
          >
            {buttonText}
          </RouterLink>
        </div>
      </div>
    </div>
  )
}
