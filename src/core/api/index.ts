import axios from 'axios'
import { CONFIG } from '../config'

/**
 * Instância global do Axios configurada para a Digital Store API.
 * 
 * @example
 * ```ts
 * const { data } = await api.get('/products')
 * ```
 */
export const api = axios.create({
  baseURL: CONFIG.API_URL,
  withCredentials: true
})

/**
 * Interceptor de resposta global para tratamento de erros.
 * 
 * Atualmente lida com o erro 401 (Não autorizado), limpando a sessão
 * do usuário e redirecionando para a página de login caso a rota seja privada.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend retornar 401, a sessão expirou ou é inválida
    if (error.response?.status === 401) {
      try {
        sessionStorage.removeItem(CONFIG.STORAGE_KEYS.USER)
      } catch (e) {
        // Erro silencioso ao limpar storage
      }

      const currentPath = window.location.pathname
      const publicPaths = ['/login', '/cadastro', '/register-form-page', '/']

      // Redireciona para o login apenas se estiver em uma rota privada
      if (!publicPaths.includes(currentPath) && currentPath !== '/') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
