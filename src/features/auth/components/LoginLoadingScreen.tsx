import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoHeader from '@/assets/images/logo-header.svg'

/**
 * Tela de carregamento exibida após login bem-sucedido.
 * 
 * Este componente mostra a logo da Digital Store com animações premium 
 * por aproximadamente 2 segundos e depois redireciona o usuário para a 
 * homepage automaticamente. É utilizado para dar feedback visual de sucesso.
 * 
 * @returns {JSX.Element} Tela de overlay com animação de loading.
 */
const LoginLoadingScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="login-loading-overlay">
      {/* Conteúdo centralizado */}
      <div className="login-loading-content">
        {/* Logo com animação fadeInUp */}
        <img
          src={logoHeader}
          alt="Digital Store"
          className="login-loading-logo"
        />

        {/* Texto de status */}
        <p className="login-loading-text">Entrando na sua conta...</p>

        {/* Barra de progresso */}
        <div className="login-loading-bar-track">
          <div className="login-loading-bar-fill" />
        </div>
      </div>
    </div>
  )
}

export default LoginLoadingScreen
