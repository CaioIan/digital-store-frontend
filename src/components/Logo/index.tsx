import { Link } from 'react-router-dom'
import logoFooter from '@/assets/logo-footer.svg'
import logoHeader from '@/assets/logo-header.svg'

interface LogoProps {
  variant?: 'default' | 'white'
}

const Logo = ({ variant = 'default' }: LogoProps) => {
  const isWhite = variant === 'white'
  const logoSrc = isWhite ? logoFooter : logoHeader

  return (
    <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
      <img src={logoSrc} alt="Digital Store" className="h-7 lg:h-11 w-auto" />
    </Link>
  )
}

export default Logo
