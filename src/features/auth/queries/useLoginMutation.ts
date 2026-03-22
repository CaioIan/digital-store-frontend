import { useMutation } from '@tanstack/react-query'
import { api } from '@/core'
import type { LoginFormData } from '../utils/loginSchema'

/**
 * Hook customizado utilizando `useMutation` (TanStack Query) para realizar o login.
 * 
 * Envia as credenciais (e-mail e senha) para o servidor. Em caso de sucesso,
 * o backend responde com o cookie de autenticação HTTP-Only.
 * 
 * @returns {UseMutationResult} Objeto contendo o estado da mutação e a função `mutateAsync`.
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await api.post('/user/login', {
        email: credentials.email,
        password: credentials.password
      })
      return response.data
    }
  })
}
