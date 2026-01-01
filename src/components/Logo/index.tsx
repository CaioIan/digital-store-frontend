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
    <Link
      to="/"
      className="flex items-center gap-2 no-underline w-[253px] h-11"
    >
      <img src={logoSrc} alt="Digital Store" className="w-[253px] h-11" />
    </Link>
  )
}

export default Logo
