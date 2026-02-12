import { useState } from 'react'
import { Link } from 'react-router-dom'
import RouterLink from '@/components/RouterLink'

const RegisterPage = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: implement registration logic
    console.log('Register with:', email)
  }

  return (
    <section className="flex-1 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, #E6E4FF 0%, #C9C6F5 50%, #B8B4EE 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-360 mx-auto px-4 lg:px-25 flex items-center min-h-0 lg:min-h-135 py-12 lg:py-20">
        {/* Grid: 2 columns */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[40%_60%] items-center gap-8">
          {/* Left Column - Form Card */}
          <div className="bg-white rounded-lg p-8 w-full max-w-115 mx-auto lg:mx-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            {/* Title */}
            <h1 className="text-2xl font-bold text-dark-gray mb-2">
              Crie sua conta
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-dark-gray-3 mb-6">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Entre aqui.
              </Link>
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="register-email"
                  className="text-[13px] font-medium text-dark-gray"
                >
                  Email <span className="text-primary">*</span>
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  placeholder="Insira seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-md bg-light-gray-3 border-none px-3 text-sm text-dark-gray placeholder:text-light-gray outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="h-11 w-full bg-primary text-white font-semibold rounded-md hover:brightness-90 transition-all cursor-pointer"
              >
                <RouterLink to="/register-form-page">Criar Conta</RouterLink>
              </button>
            </form>

            {/* Social login */}
            <div className="mt-5 flex flex-col items-center gap-3">
              <span className="text-[13px] text-dark-gray-3">
                Ou faça login com
              </span>
              <div className="flex items-center gap-4">
                {/* Google icon */}
                <a
                  href="#google"
                  className="w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                  aria-label="Login com Google"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Google</title>
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </a>

                {/* Facebook icon */}
                <a
                  href="#facebook"
                  className="w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                  aria-label="Login com Facebook"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#1877F2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Facebook</title>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Area (shoes) */}
          <div className="hidden lg:flex items-center justify-center relative h-100">
            {/* Shoe 1 - larger, front */}
            <img
              src="/tenis-1-tela-de-cadastro.png"
              alt="Tênis em destaque"
              className="absolute w-80 right-4 bottom-4 drop-shadow-lg z-10 -rotate-15"
            />
            {/* Shoe 2 - smaller, behind */}
            <img
              src="/tenis-2-tela-de-cadastro.png"
              alt="Tênis em destaque"
              className="absolute w-64 right-72 top-16 drop-shadow-md z-0 rotate-10"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
