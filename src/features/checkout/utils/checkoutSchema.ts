import { z } from 'zod'
import { isValidCEP, isValidCPF, isValidPhone } from '@/shared/utils'

/**
 * Schema de validação para o formulário de finalização de compra (Checkout).
 * 
 * Valida:
 * 1. Informações Pessoais: Nome completo, CPF, e-mail e celular.
 * 2. Entrega: Endereço completo, bairro, cidade, CEP e estado.
 * 3. Pagamento: Atualmente suporta apenas a seleção do método de pagamento.
 */
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .max(100, 'Nome muito longo'),
  cpf: z
    .string()
    .min(11, 'CPF deve ter 11 dígitos')
    .refine((cpf) => isValidCPF(cpf), {
      message: 'CPF inválido'
    }),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'O telefone deve ter no mínimo 10 dígitos')
    .refine((phone) => isValidPhone(phone), {
      message: 'Número de telefone inválido'
    }),
  address: z
    .string()
    .min(1, 'Endereço é obrigatório')
    .max(200, 'Endereço muito longo'),
  neighborhood: z
    .string()
    .min(1, 'Bairro é obrigatório')
    .max(100, 'Bairro muito longo'),
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .max(100, 'Cidade muito longa'),
  cep: z
    .string()
    .min(8, 'CEP deve ter 8 dígitos')
    .refine((cep) => isValidCEP(cep), {
      message: 'CEP inválido'
    }),
  complement: z
    .string()
    .max(200, 'Complemento muito longo')
    .optional()
    .or(z.literal('')),
  paymentMethod: z.enum(['credit-card', 'boleto'])
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
