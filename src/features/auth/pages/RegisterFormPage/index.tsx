import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import RouterLink from '@/components/RouterLink'
import type { RegisterUserPayload } from '../../api/userService'
import { useRegisterMutation } from '../../queries/useRegisterMutation'
import {
  type RegisterFormData,
  registerSchema
} from '../../utils/registerSchema'

const RegisterFormPage = () => {
  const location = useLocation()
  const initialEmail = location.state?.email || ''

  const [marketing, setMarketing] = useState(true)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      primeiroNome: '',
      sobrenome: '',
      cpf: '',
      email: initialEmail,
      celular: '',
      senha: '',
      confirmacaoSenha: '',
      endereco: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      complemento: ''
    }
  })

  const {
    mutateAsync: registerUser,
    isPending: loading,
    isSuccess
  } = useRegisterMutation()

  const onSubmit = async (data: RegisterFormData) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setGeneralError(null)

    try {
      const payload: RegisterUserPayload = {
        firstname: data.primeiroNome,
        surname: data.sobrenome,
        cpf: data.cpf,
        phone: data.celular,
        email: data.email,
        password: data.senha,
        confirmPassword: data.confirmacaoSenha
      }

      const hasAnyAddressField =
        data.endereco || data.bairro || data.cidade || data.estado || data.cep
      if (hasAnyAddressField) {
        if (data.endereco) payload.endereco = data.endereco
        if (data.bairro) payload.bairro = data.bairro
        if (data.cidade) payload.cidade = data.cidade
        if (data.estado) payload.estado = data.estado
        if (data.cep) payload.cep = data.cep
        if (data.complemento) payload.complemento = data.complemento
      }

      await registerUser(payload)
      await new Promise((resolve) => setTimeout(resolve, 2500))
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        // Mapeia erros de volta pros campos base
        const formToApiMap: Record<string, keyof RegisterFormData> = {
          firstname: 'primeiroNome',
          surname: 'sobrenome',
          phone: 'celular',
          password: 'senha',
          confirmPassword: 'confirmacaoSenha'
        }

        const apiErrors: { field: string; message: string }[] =
          error.response.data.errors
        apiErrors.forEach((err) => {
          const formField = (formToApiMap[err.field]
            || err.field) as keyof RegisterFormData
          setError(formField, { type: 'server', message: err.message })
        })
      } else {
        setGeneralError(
          'Ocorreu um erro inesperado ao tentar realizar o cadastro. Tente novamente mais tarde.'
        )
        console.error('Registration failed:', error)
      }
    }
  }

  const inputClassName =
    'h-11 w-full rounded-md bg-light-gray-3 border-none px-3 text-sm text-dark-gray placeholder:text-light-gray outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed'

  const getInputStyle = (name: keyof RegisterFormData) => {
    return `${inputClassName} ${errors[name] ? 'ring-2 ring-[#C92071]/50 bg-[#C92071]/5' : ''}`
  }

  return (
    <section className="flex-1 bg-[#FAFAFC] py-8 lg:py-12 flex flex-col">
      <div className="max-w-160 mx-auto px-4 w-full">
        {loading ? (
          <div className="bg-white rounded-lg p-8 lg:p-16 flex flex-col items-center justify-center text-center shadow-sm min-h-[50vh] animate-in fade-in duration-300">
            <Loader2 className="w-14 h-14 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold text-dark-gray mb-2">
              Criando sua conta...
            </h2>
            <p className="text-sm text-dark-gray-3">
              Por favor, aguarde um instante.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="bg-white rounded-lg p-8 lg:p-16 flex flex-col items-center justify-center text-center shadow-sm min-h-[50vh] animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-[#C92071]/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-dark-gray mb-3">
              Cadastro Concluído!
            </h2>
            <p className="text-dark-gray-3 mb-8 max-w-sm flex-1">
              Sua conta foi criada com sucesso. Você já pode acessar a
              plataforma.
            </p>
            <RouterLink
              to="/login"
              className="h-12 px-8 bg-primary text-white font-semibold text-sm rounded-md hover:brightness-90 transition-all flex items-center justify-center w-full max-w-xs"
            >
              Fazer login
            </RouterLink>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-dark-gray mb-2">
              Crie sua conta
            </h1>
            <p className="text-sm text-dark-gray-3 mb-6">
              Já possui uma conta?{' '}
              <RouterLink
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Entre aqui.
              </RouterLink>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-lg p-6 lg:p-8"
            >
              {generalError && (
                <div className="mb-6 p-4 rounded-md bg-red-50 border border-[#C92071]/20 text-[#C92071] text-sm">
                  {generalError}
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-sm font-semibold text-dark-gray pb-3 border-b border-light-gray-2 mb-5">
                  Informações Pessoais
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="primeiroNome"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Primeiro Nome <span className="text-primary">*</span>
                    </label>
                    <input
                      id="primeiroNome"
                      type="text"
                      placeholder="Insira seu primeiro nome"
                      disabled={loading}
                      className={getInputStyle('primeiroNome')}
                      {...register('primeiroNome')}
                    />
                    {errors.primeiroNome && (
                      <span className="text-xs text-[#C92071]">
                        {errors.primeiroNome.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="sobrenome"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Sobrenome <span className="text-primary">*</span>
                    </label>
                    <input
                      id="sobrenome"
                      type="text"
                      placeholder="Insira seu sobrenome"
                      disabled={loading}
                      className={getInputStyle('sobrenome')}
                      {...register('sobrenome')}
                    />
                    {errors.sobrenome && (
                      <span className="text-xs text-[#C92071]">
                        {errors.sobrenome.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="cpf"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      CPF <span className="text-primary">*</span>
                    </label>
                    <input
                      id="cpf"
                      type="text"
                      placeholder="Insira seu CPF"
                      disabled={loading}
                      className={getInputStyle('cpf')}
                      {...register('cpf')}
                    />
                    {errors.cpf && (
                      <span className="text-xs text-[#C92071]">
                        {errors.cpf.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      E-mail <span className="text-primary">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Insira seu email"
                      disabled={loading}
                      className={getInputStyle('email')}
                      {...register('email')}
                    />
                    {errors.email && (
                      <span className="text-xs text-[#C92071]">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="celular"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Celular <span className="text-primary">*</span>
                    </label>
                    <input
                      id="celular"
                      type="tel"
                      placeholder="Insira seu celular"
                      disabled={loading}
                      className={getInputStyle('celular')}
                      {...register('celular')}
                    />
                    {errors.celular && (
                      <span className="text-xs text-[#C92071]">
                        {errors.celular.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="senha"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Senha <span className="text-primary">*</span>
                    </label>
                    <input
                      id="senha"
                      type="password"
                      placeholder="Insira sua senha"
                      disabled={loading}
                      className={getInputStyle('senha')}
                      {...register('senha')}
                    />
                    {errors.senha && (
                      <span className="text-xs text-[#C92071]">
                        {errors.senha.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="confirmacaoSenha"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Confirmação de Senha{' '}
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      id="confirmacaoSenha"
                      type="password"
                      placeholder="Confirme sua senha"
                      disabled={loading}
                      className={getInputStyle('confirmacaoSenha')}
                      {...register('confirmacaoSenha')}
                    />
                    {errors.confirmacaoSenha && (
                      <span className="text-xs text-[#C92071]">
                        {errors.confirmacaoSenha.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-sm font-semibold text-dark-gray pb-3 border-b border-light-gray-2 mb-5">
                  Informações de Entrega
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="endereco"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Endereço
                    </label>
                    <input
                      id="endereco"
                      type="text"
                      placeholder="Insira seu endereço"
                      disabled={loading}
                      className={getInputStyle('endereco')}
                      {...register('endereco')}
                    />
                    {errors.endereco && (
                      <span className="text-xs text-[#C92071]">
                        {errors.endereco.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="bairro"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Bairro
                    </label>
                    <input
                      id="bairro"
                      type="text"
                      placeholder="Insira seu bairro"
                      disabled={loading}
                      className={getInputStyle('bairro')}
                      {...register('bairro')}
                    />
                    {errors.bairro && (
                      <span className="text-xs text-[#C92071]">
                        {errors.bairro.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="cidade"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Cidade
                    </label>
                    <input
                      id="cidade"
                      type="text"
                      placeholder="Insira sua cidade"
                      disabled={loading}
                      className={getInputStyle('cidade')}
                      {...register('cidade')}
                    />
                    {errors.cidade && (
                      <span className="text-xs text-[#C92071]">
                        {errors.cidade.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="estado"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Estado (Sigla)
                    </label>
                    <input
                      id="estado"
                      type="text"
                      maxLength={2}
                      placeholder="Ex: SP"
                      disabled={loading}
                      className={getInputStyle('estado')}
                      {...register('estado')}
                    />
                    {errors.estado && (
                      <span className="text-xs text-[#C92071]">
                        {errors.estado.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="cep"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      CEP
                    </label>
                    <input
                      id="cep"
                      type="text"
                      placeholder="Insira seu CEP"
                      disabled={loading}
                      className={getInputStyle('cep')}
                      {...register('cep')}
                    />
                    {errors.cep && (
                      <span className="text-xs text-[#C92071]">
                        {errors.cep.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="complemento"
                      className="text-xs font-medium text-dark-gray-2"
                    >
                      Complemento
                    </label>
                    <input
                      id="complemento"
                      type="text"
                      placeholder="Insira complemento"
                      disabled={loading}
                      className={getInputStyle('complemento')}
                      {...register('complemento')}
                    />
                    {errors.complemento && (
                      <span className="text-xs text-[#C92071]">
                        {errors.complemento.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <label
                htmlFor="marketing"
                className="flex items-start gap-3 mt-6 cursor-pointer"
              >
                <input
                  id="marketing"
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded accent-primary cursor-pointer"
                />
                <span className="text-xs leading-relaxed text-dark-gray-3">
                  Quero receber por email ofertas e novidades das lojas da
                  Digital Store. A frequência de envios pode variar de acordo
                  com a interação do cliente.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 h-12 w-full bg-primary text-white font-semibold text-sm rounded-md hover:brightness-90 disabled:opacity-50 transition-all cursor-pointer flex justify-center items-center"
              >
                {loading ? 'Criando Conta...' : 'Criar Conta'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

export default RegisterFormPage
