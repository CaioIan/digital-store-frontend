import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { verifyEmail } from '../../api/userService'
import { RouterLink } from '@/shared/components'

/**
 * Página de Verificação de E-mail.
 * Captura o token da URL e faz a validação silenciosa com a API.
 */
const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    let isMounted = true

    const validateToken = async () => {
      try {
        await verifyEmail(token)
        if (isMounted) setStatus('success')
      } catch (_error) {
        if (isMounted) setStatus('error')
      }
    }

    validateToken()

    return () => {
      isMounted = false
    }
  }, [token])

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
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-dark-gray mb-3">
              Validando seu cadastro...
            </h1>
            <p className="text-dark-gray-3">
              Aguarde um instante enquanto confirmamos seu e-mail.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-[#C92071]/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-dark-gray mb-3">
              E-mail verificado com sucesso!
            </h1>
            <p className="text-dark-gray-3 mb-8">
              Sua conta foi ativada. Agora você já pode acessar a plataforma
              com seus dados.
            </p>
            <RouterLink
              to="/login"
              className="h-12 w-full bg-primary text-white font-semibold text-sm rounded-md hover:brightness-90 transition-all flex items-center justify-center"
            >
              Fazer Login
            </RouterLink>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-[#C92071]" />
            </div>
            <h1 className="text-2xl font-bold text-dark-gray mb-3">
              Ops, algo deu errado!
            </h1>
            <p className="text-dark-gray-3 mb-8">
              O link de verificação é inválido ou já expirou. Verifique se copiou
              o link corretamente do seu e-mail.
            </p>
            <RouterLink
              to="/cadastro"
              className="h-12 w-full bg-light-gray-3 text-dark-gray font-semibold text-sm rounded-md hover:bg-light-gray-2 transition-all flex items-center justify-center mb-4"
            >
              Voltar ao Cadastro
            </RouterLink>
          </div>
        )}
      </section>
    </main>
  )
}

export default VerifyEmailPage
