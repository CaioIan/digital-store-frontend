import { z } from 'zod'

/**
 * Schema de validação do formulário de login utilizando Zod.
 * 
 * @property {string} email - Deve ser um e-mail válido e não vazio.
 * @property {string} password - Deve ter pelo menos 6 caracteres.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Insira um e-mail válido')
    .min(1, 'O e-mail é obrigatório'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
})

export type LoginFormData = z.infer<typeof loginSchema>
