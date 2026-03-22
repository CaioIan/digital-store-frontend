import axios from 'axios'
import { api } from '@/core'

export interface RegisterUserPayload {
  firstname: string
  surname: string
  cpf: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  endereco?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  complemento?: string
}

/**
 * Envia os dados de um novo usuário para o Backend para criação de conta.
 *
 * @param {RegisterUserPayload} data - Objeto contendo dados pessoais (nome, cpf, email, celular), senha e dados opcionais de endereço.
 * @returns {Promise<any>} Promessa com a resposta de sucesso do servidor (geralmente os dados do usuário criado).
 * @throws {Array<string>} Arremessa um array de strings com os erros de validação vindos do Backend se a requisição falhar.
 */
export const registerUser = async (data: RegisterUserPayload) => {
  try {
    const response = await api.post('/user', data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      throw error.response.data.errors // Retorna o array de erros detalhado do backend
    }
    throw error // Erros genéricos de rede ou server error
  }
}

/**
 * Verifica o endereço de e-mail do usuário no sistema através de um token único.
 *
 * @param {string} token - Token alfanumérico recebido pelo usuário via link em seu e-mail.
 * @returns {Promise<any>} Promessa com a mensagem de confirmação de e-mail verificado.
 */
export const verifyEmail = async (token: string) => {
  const response = await api.get('/user/verify-email', { params: { token } })
  return response.data
}
