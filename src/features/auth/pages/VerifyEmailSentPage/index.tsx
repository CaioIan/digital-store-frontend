import { CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { RouterLink } from '@/shared/components'

/**
 * Página de Confirmação de Envio de Email.
 *
 * Exibida após registro bem-sucedido quando verificação de email está habilitada.
 * Instruir o usuário a verificar seu email e clicar no link de confirmação.
 *
 * Se a verificação estiver desabilitada, redireciona para login.
 */
const VerifyEmailSentPage = () => {
  const navigate = useNavigate()
  const { emailVerificationRequired } = useAuth()

  useEffect(() => {
    // Se verificação não está habilitada, redireciona para login
    if (!emailVerificationRequired) {
      navigate('/login', { replace: true })
    }
  }, [emailVerificationRequired, navigate])

  // Se verificação está desabilitada, não renderiza nada (redirecionando)
  if (!emailVerificationRequired) {
    return null
  }

  return (
    <main className="flex-1 bg-[#FAFAFC] relative overflow-hidden flex flex-col items-center justify-center py-20 px-4">
      {/* Fundo decorativo leve */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(230, 228, 255, 0.5) 0%, rgba(201, 198, 245, 0.5) 50%, rgba(184, 180, 238, 0.5) 100%)'
        }}
        aria-hidden="true"
      />

      <section className="bg-white rounded-lg p-8 lg:p-12 w-full max-w-lg shadow-[0_8px_24px_rgba(0,0,0,0.08)] relative z-10 text-center animate-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#C92071]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-dark-gray mb-6">
            Cadastro Concluído!
          </h1>

          <p className="text-dark-gray-3 mb-6 leading-relaxed">
            Enviamos um link de confirmação para o seu email.
            <br />
            <strong>Você precisa validar sua conta clicando neste link</strong>{' '}
            antes de fazer login.
          </p>

          <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-lg mb-8 w-full text-left">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">
              💡 Dicas:
            </h3>
            <ul className="text-xs text-amber-800 space-y-1.5">
              <li>✓ Verifique sua caixa de entrada</li>
              <li>✓ Se não encontrar, procure na pasta de spam</li>
              <li>✓ O link é válido por 24 horas</li>
              <li>✓ Após validar, você poderá fazer login</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="h-12 w-full bg-light-gray-3 text-dark-gray font-semibold text-sm rounded-md hover:bg-light-gray-2 transition-all flex items-center justify-center mb-4"
          >
            Já validei - Ir para Login
          </button>

          <RouterLink
            to="/cadastro"
            className="text-xs text-dark-gray-3 hover:text-dark-gray hover:underline transition-colors"
          >
            Voltar ao cadastro
          </RouterLink>
        </div>
      </section>
    </main>
  )
}

export default VerifyEmailSentPage
