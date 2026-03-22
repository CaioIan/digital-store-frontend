import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/features/auth'
import { RouterLink } from '@/shared/components'
import LoginLoadingScreen from '../../components/LoginLoadingScreen'
import { useLoginMutation } from '../../queries/useLoginMutation'
import { type LoginFormData, loginSchema } from '../../utils/loginSchema'

/**
 * Página de Login da Digital Store.
 * Possui formulário validado com Zod, integração com a API de autenticação
 * via React Query, e tela de carregamento animada após login bem-sucedido.
 */
const LoginPage = () => {
  const { setUser } = useAuth()
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [showLoading, setShowLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })

  const { mutateAsync: login, isPending: loading } = useLoginMutation()

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError(null)
    try {
      const response = await login(data)
      // Salva o usuário no contexto global e no localStorage
      if (response?.user) {
        setUser(response.user)
      }
      // Exibe tela de carregamento antes de redirecionar
      setShowLoading(true)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (
          error.response.data?.message ===
          'Por favor, verifique seu email antes de fazer login'
        ) {
          setGeneralError(
            'Sua conta ainda não foi ativada. Por favor, valide seu e-mail.'
          )
        } else {
          setGeneralError('Email ou senha inválidos')
        }
      } else {
        setGeneralError('Ocorreu um erro no servidor. Tente novamente.')
      }
    }
  }

  // Exibe a tela de loading em tela cheia após login bem-sucedido
  if (showLoading) {
    return <LoginLoadingScreen />
  }

  return (
    <main className="flex-1 relative overflow-hidden">
      {/* Fundo gradiente — idêntico ao RegisterPage */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, #E6E4FF 0%, #C9C6F5 50%, #B8B4EE 100%)'
        }}
        aria-hidden="true"
      />

      {/* Conteúdo centralizado */}
      <div className="relative z-10 max-w-360 mx-auto px-4 lg:px-25 flex items-center min-h-0 lg:min-h-135 py-12 lg:py-20">
        {/* Grid de duas colunas — idêntico ao RegisterPage */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[40%_60%] items-center gap-8">
          {/* Coluna esquerda — Card de Login */}
          <section
            className="bg-white rounded-lg p-8 w-full max-w-115 mx-auto lg:mx-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            aria-labelledby="login-title"
          >
            {/* Título */}
            <h1
              id="login-title"
              className="text-2xl font-bold text-dark-gray mb-2"
            >
              Acesse sua conta
            </h1>

            {/* Subtítulo removido — redundante com o novo botão "Criar Conta" abaixo */}

            {/* Formulário de login */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {generalError && (
                <div
                  className="p-3 rounded-md bg-red-50 border border-[#C92071]/20 text-[#C92071] text-sm"
                  role="alert"
                >
                  {generalError}
                </div>
              )}

              {/* Campo Login */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-field"
                  className="text-[13px] font-medium text-dark-gray"
                >
                  Login{' '}
                  <span className="text-primary" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only">(obrigatório)</span>
                </label>
                <input
                  id="login-field"
                  type="email"
                  placeholder="Insira seu login ou email"
                  disabled={loading}
                  {...register('email')}
                  className={`h-11 rounded-md bg-light-gray-3 border-none px-3 text-sm text-dark-gray placeholder:text-light-gray outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.email ? 'ring-2 ring-[#C92071]/50 bg-[#C92071]/5' : ''}`}
                />
                {errors.email && (
                  <span className="text-xs text-[#C92071]">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Campo Senha */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="senha-field"
                  className="text-[13px] font-medium text-dark-gray"
                >
                  Senha{' '}
                  <span className="text-primary" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only">(obrigatório)</span>
                </label>
                <input
                  id="senha-field"
                  type="password"
                  placeholder="Insira sua senha"
                  disabled={loading}
                  {...register('password')}
                  className={`h-11 rounded-md bg-light-gray-3 border-none px-3 text-sm text-dark-gray placeholder:text-light-gray outline-none focus:ring-2 focus:ring-primary/30 transition-all ${errors.password ? 'ring-2 ring-[#C92071]/50 bg-[#C92071]/5' : ''}`}
                />
                {errors.password && (
                  <span className="text-xs text-[#C92071]">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Link "Esqueci minha senha" */}
              <RouterLink
                to="#"
                className="text-xs text-dark-gray-3 underline hover:text-dark-gray transition-colors w-fit"
              >
                Esqueci minha senha
              </RouterLink>

              {/* Botão principal de login */}
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-primary text-white font-semibold flex justify-center items-center rounded-md hover:brightness-90 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    aria-label="Carregando"
                  />
                ) : (
                  'Acessar Conta'
                )}
              </button>
            </form>

            {/* Link proeminente para criar conta */}
            <div className="mt-8 pt-8 border-t border-light-gray-2 flex flex-col items-center gap-4">
              <span className="text-[13px] text-dark-gray-3">
                Não possui uma conta?
              </span>
              <RouterLink
                to="/cadastro"
                className="h-11 w-full flex items-center justify-center border-2 border-primary text-primary font-semibold rounded-md hover:bg-primary/5 transition-all text-sm"
              >
                Criar Conta
              </RouterLink>
            </div>
          </section>

          {/* Coluna direita — Imagens de tênis (idêntico ao RegisterPage) */}
          <aside
            className="hidden lg:flex items-center justify-center relative h-100"
            aria-hidden="true"
          >
            <figure>
              {/* Tênis 1 — maior, em destaque na frente */}
              <img
                src="/tenis-1-tela-de-cadastro.webp"
                alt=""
                className="absolute w-80 right-4 bottom-4 drop-shadow-lg z-10 -rotate-15"
              />
              {/* Tênis 2 — menor, atrás */}
              <img
                src="/tenis-2-tela-de-cadastro.webp"
                alt=""
                className="absolute w-64 right-72 top-16 drop-shadow-md z-0 rotate-10"
              />
              <figcaption className="sr-only">
                Ilustração de tênis colecionáveis
              </figcaption>
            </figure>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
