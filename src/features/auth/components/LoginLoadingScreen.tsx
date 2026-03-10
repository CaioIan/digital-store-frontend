import logoHeader from '@/assets/logo-header.svg'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Tela de carregamento exibida após login bem-sucedido.
 * Mostra a logo com animações premium por ~2s e depois redireciona à homepage.
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
