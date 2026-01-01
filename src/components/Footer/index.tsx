import facebookIcon from '@/assets/facebook.svg'
import instagramIcon from '@/assets/instagram.svg'
import twitterIcon from '@/assets/twitter.svg'
import Logo from '../Logo'
import FooterInformation from './FooterInformation'

const Footer = () => {
  const informacaoData = [
    { text: 'Sobre Drip Store', link: '/about' },
    { text: 'Segurança', link: '/security' },
    { text: 'Wishlist', link: '/wishlist' },
    { text: 'Blog', link: '/blog' },
    { text: 'Trabalhe conosco', link: '/careers' },
    { text: 'Meus Pedidos', link: '/orders' }
  ]

  const categoriasData = [
    { text: 'Camisetas', link: '/category/camisetas' },
    { text: 'Calças', link: '/category/calcas' },
    { text: 'Bonés', link: '/category/bones' },
    { text: 'Headphones', link: '/category/headphones' },
    { text: 'Tênis', link: '/category/tenis' }
  ]

  const contatoData = [
    {
      text: 'Av. Santos Dumont, 1510 - 1 andar - Aldeota, Fortaleza - CE, 60150-161',
      link: '#'
    },
    { text: '(85) 3051-3411', link: 'tel:+558530513411' }
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-gray text-white">
      <div className="max-w-[1440px] mx-auto px-[100px] py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-6">
            <Logo variant="white" />
            <p className="text-white text-base leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore.
            </p>
            <div className="flex gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img src={twitterIcon} alt="Twitter" className="w-6 h-6" />
              </a>
            </div>
          </div>

          <FooterInformation title="Informação" informations={informacaoData} />

          <FooterInformation title="Categorias" informations={categoriasData} />

          <FooterInformation title="Contato" informations={contatoData} />
        </div>

        <hr className="border-t border-white/20 my-6" />

        <p className="text-white text-sm text-center">
          © {currentYear} Digital Store
        </p>
      </div>
    </footer>
  )
}

export default Footer
