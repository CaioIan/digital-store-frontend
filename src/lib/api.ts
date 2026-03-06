import axios from 'axios'

/**
 * Instância global do Axios configurada para a Digital Store API.
 * 
 * - baseURL: Ponto de entrada das versões v1 da nossa API.
 * - withCredentials: ESSENCIAL para o funcionamento da segurança via Cookies HTTP-Only.
 *   Isso garante que o token JWT (armazenado no cookie pelo backend) seja 
 *   enviado em todas as requisições autenticadas automaticamente.
 */
export const api = axios.create({
  baseURL: 'http://localhost:3000/v1',
  withCredentials: true // Permite o tráfego de Cookies HTTP-Only gerados pelo Backend
})

// Interceptor que detecta token JWT expirado e faz logout automático,
// evitando "sessões fantasma" onde o front acha que está logado mas o cookie expirou.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('@DigitalStore:user')
      } catch (e) {
        // Ignora erro se não conseguir remover
      }

      const currentPath = window.location.pathname
      const publicPaths = ['/login', '/cadastro', '/register-form-page', '/']

      // Só redireciona para login se o usuário não estiver em uma página pública/auth
      if (!publicPaths.includes(currentPath)) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
