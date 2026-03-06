import { api } from '@/lib/api'
import axios from 'axios'

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
 * Envia os dados de um novo usuário para o Backend.
 * 
 * @param data - Objeto contendo dados pessoais, senha e endereço.
 * @returns Resposta de sucesso do servidor.
 * @throws Array de erros de validação vindos do Backend (Zod/Sequelize).
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
