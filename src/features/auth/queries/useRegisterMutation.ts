import { useMutation } from '@tanstack/react-query'
import type { RegisterUserPayload } from '../api/userService'
import { registerUser } from '../api/userService'

/**
 * Hook customizado para registrar um novo usuário no sistema.
 * 
 * Envia o payload completo de cadastro para a API através da função `registerUser`.
 * 
 * @returns {UseMutationResult} Objeto da mutação do TanStack Query.
 */
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: RegisterUserPayload) => registerUser(payload)
  })
}
