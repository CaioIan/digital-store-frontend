import { useState } from 'react'
import RouterLink from '@/components/RouterLink'

const RegisterFormPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    celular: '',
    endereco: '',
    bairro: '',
    cidade: '',
    cep: '',
    complemento: ''
  })
  const [marketing, setMarketing] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Register with:', formData, { marketing })
  }

  const inputClassName =
    'h-11 w-full rounded-md bg-light-gray-3 border-none px-3 text-sm text-dark-gray placeholder:text-light-gray outline-none focus:ring-2 focus:ring-primary/30 transition-all'

  return (
    <section className="flex-1 bg-[#FAFAFC] py-8 lg:py-12">
      <div className="max-w-160 mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-dark-gray mb-2">
          Crie sua conta
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-dark-gray-3 mb-6">
          Já possui uma conta?{' '}
          <RouterLink
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Entre aqui.
          </RouterLink>
        </p>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 lg:p-8"
        >
          {/* Section 1 - Personal Info */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-dark-gray pb-3 border-b border-light-gray-2 mb-5">
              Informações Pessoais
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="nome"
                  className="text-xs font-medium text-dark-gray-2"
                >
                  Nome Completo <span className="text-primary">*</span>
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  placeholder="Insira seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={inputClassName}
                />
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
                  name="cpf"
                  type="text"
                  required
                  placeholder="Insira seu CPF"
                  value={formData.cpf}
                  onChange={handleChange}
                  className={inputClassName}
                />
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
                  name="email"
                  type="email"
                  required
                  placeholder="Insira seu email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClassName}
                />
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
                  name="celular"
                  type="tel"
                  required
                  placeholder="Insira seu celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* Section 2 - Delivery Info */}
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
                  Endereço <span className="text-primary">*</span>
                </label>
                <input
                  id="endereco"
                  name="endereco"
                  type="text"
                  required
                  placeholder="Insira seu endereço"
                  value={formData.endereco}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="bairro"
                  className="text-xs font-medium text-dark-gray-2"
                >
                  Bairro <span className="text-primary">*</span>
                </label>
                <input
                  id="bairro"
                  name="bairro"
                  type="text"
                  required
                  placeholder="Insira seu bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cidade"
                  className="text-xs font-medium text-dark-gray-2"
                >
                  Cidade <span className="text-primary">*</span>
                </label>
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  required
                  placeholder="Insira sua cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cep"
                  className="text-xs font-medium text-dark-gray-2"
                >
                  CEP <span className="text-primary">*</span>
                </label>
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  required
                  placeholder="Insira seu CEP"
                  value={formData.cep}
                  onChange={handleChange}
                  className={inputClassName}
                />
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
                  name="complemento"
                  type="text"
                  placeholder="Insira complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* Marketing Checkbox */}
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
              Quero receber por email ofertas e novidades das lojas da Digital
              Store. A frequência de envios pode variar de acordo com a
              interação do cliente.
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 h-12 w-full bg-primary text-white font-semibold text-sm rounded-md hover:brightness-90 disabled:opacity-50 transition-all cursor-pointer"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </section>
  )
}

export default RegisterFormPage
