import RouterLink from '@/components/RouterLink'
import logoFooter from '@/assets/logo-footer.svg'
import logoHeader from '@/assets/logo-header.svg'

interface LogoProps {
  variant?: 'default' | 'white'
}

const Logo = ({ variant = 'default' }: LogoProps) => {
  const isWhite = variant === 'white'
  const logoSrc = isWhite ? logoFooter : logoHeader

  return (
    <RouterLink to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
      <img src={logoSrc} alt="Digital Store" className="h-7 lg:h-11 w-auto" />
    </RouterLink>
  )
}

export default Logo
