import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/user/logout')
      return response.data
    }
  })
}
