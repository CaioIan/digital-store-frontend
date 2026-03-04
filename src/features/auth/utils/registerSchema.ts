import { z } from 'zod'

export const registerSchema = z
  .object({
    primeiroNome: z
      .string()
      .min(1, 'O nome é obrigatório')
      .max(50, 'Máximo de 50 caracteres'),
    sobrenome: z
      .string()
      .min(1, 'O sobrenome é obrigatório')
      .max(50, 'Máximo de 50 caracteres'),
    cpf: z
      .string()
      .min(11, 'CPF deve ter no mínimo 11 caracteres')
      .max(14, 'CPF deve ter no máximo 14 caracteres'),
    email: z.string().email('Email inválido'),
    celular: z
      .string()
      .min(10, 'O celular deve ter no mínimo 10 caracteres')
      .max(15, 'O celular deve ter no máximo 15 caracteres'),
    senha: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .max(100, 'A senha deve ter no máximo 100 caracteres'),
    confirmacaoSenha: z.string(),
    endereco: z
      .string()
      .max(200, 'Endereço muito longo')
      .optional()
      .or(z.literal('')),
    bairro: z
      .string()
      .max(100, 'Bairro muito longo')
      .optional()
      .or(z.literal('')),
    cidade: z
      .string()
      .max(100, 'Cidade muito longa')
      .optional()
      .or(z.literal('')),
    estado: z
      .string()
      .max(2, 'A sigla do estado deve ter 2 caracteres')
      .optional()
      .or(z.literal('')),
    cep: z.string().max(9, 'CEP muito longo').optional().or(z.literal('')),
    complemento: z
      .string()
      .max(200, 'Complemento muito longo')
      .optional()
      .or(z.literal(''))
  })
  .refine((data) => data.senha === data.confirmacaoSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmacaoSenha']
  })
  .superRefine((data, ctx) => {
    // Validação condicional de endereço: se preencher um, os outros 3 principais (bairro, cidade, cep) viram obrigatórios
    const hasAnyAddress = !!(
      data.endereco
      || data.bairro
      || data.cidade
      || data.estado
      || data.cep
    )

    if (hasAnyAddress) {
      if (!data.endereco) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Endereço é obrigatório quando outros campos de endereço são preenchidos',
          path: ['endereco']
        })
      }
      if (!data.bairro) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Bairro é obrigatório quando outros campos de endereço são preenchidos',
          path: ['bairro']
        })
      }
      if (!data.cidade) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Cidade é obrigatória quando outros campos de endereço são preenchidos',
          path: ['cidade']
        })
      }
      if (!data.estado) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Estado é obrigatório quando outros campos de endereço são preenchidos',
          path: ['estado']
        })
      }
      if (!data.cep) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'CEP é obrigatório quando outros campos de endereço são preenchidos',
          path: ['cep']
        })
      }
    }
  })

export type RegisterFormData = z.infer<typeof registerSchema>
