import { Link } from 'react-router-dom'

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
    <div className="relative h-full w-full bg-light-gray-3">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-8 px-8 lg:grid-cols-2">
        {/* Conteúdo à esquerda */}
        <div className="space-y-6 py-12">
          {badge && (
            <p className="text-sm font-bold uppercase tracking-wide text-warning">
              {badge}
            </p>
          )}

          <h1 className="text-4xl font-extrabold leading-tight text-dark-gray lg:text-5xl xl:text-6xl">
            {title}
          </h1>

          <p className="text-base leading-relaxed text-dark-gray-2 lg:text-lg">
            {description}
          </p>

          <Link
            to={buttonLink}
            className="inline-block rounded bg-primary px-8 py-3 text-base font-bold text-white transition-colors hover:bg-tertiary"
          >
            {buttonText}
          </Link>
        </div>

        {/* Imagem à direita */}
        <div className="relative flex items-center justify-center">
          <div className="relative">
            {/* Círculo decorativo de fundo */}
            <div className="absolute inset-0 -right-20 -top-10 h-[120%] w-[120%] rounded-full bg-gradient-to-br from-light-gray-3/50 to-transparent" />

            {/* Pontos decorativos */}
            <div className="absolute -right-8 top-8 grid grid-cols-6 gap-2 opacity-40">
              {[...Array(24)].map((_, i) => {
                const id = `dot-row${Math.floor(i / 6)}-col${i % 6}`
                return (
                  <div key={id} className="h-2 w-2 rounded-full bg-warning" />
                )
              })}
            </div>

            {/* Imagem do produto */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="relative z-10 h-auto w-full max-w-md object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
