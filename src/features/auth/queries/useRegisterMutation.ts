import { useMutation } from '@tanstack/react-query'
import type { RegisterUserPayload } from '../api/userService'
import { registerUser } from '../api/userService'

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: RegisterUserPayload) => registerUser(payload)
  })
}
