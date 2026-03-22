import { useMutation } from '@tanstack/react-query'
import { api } from '@/core'

/**
 * Hook customizado para realizar o logout do usuário.
 * 
 * Invoca o endpoint de logout no backend para invalidar o cookie de sessão.
 * 
 * @returns {UseMutationResult} Objeto da mutação do TanStack Query.
 */
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/user/logout')
      return response.data
    }
  })
}
