/**
 * Configurações globais da aplicação.
 * Centraliza URLs, chaves de armazenamento e outras constantes.
 */

/**
 * Configurações globais da aplicação Digital Store.
 * 
 * Centraliza URLs da API, chaves de armazenamento do localStorage,
 * cupons de desconto válidos e outras constantes de sistema.
 */
export const CONFIG = {
  /** URL base da API REST */
  API_URL: 'http://localhost:3000/v1',
  
  /** Chaves utilizadas para persistência de dados no navegador */
  STORAGE_KEYS: {
    USER: '@DigitalStore:user'
  },
  
  /** Cupons de desconto pré-definidos para validação client-side */
  COUPONS: {
    DESCONTO10: 10,
    PROMO20: 20,
    OFF30: 30
  } as Record<string, number>
}
