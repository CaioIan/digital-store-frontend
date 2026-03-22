/** 
 * Representa um item individual dentro de um pedido realizado.
 * 
 * Contém detalhes do produto, quantidade e o preço praticado no 
 * momento da compra (snapshot).
 */
export interface OrderItem {
  id?: string
  product_id: string | number
  product_name: string
  image_url: string
  quantity: number
  price_at_purchase: number
}

/** Dados pessoais do comprador associados ao pedido. */
export interface PersonalInfo {
  full_name: string
  cpf: string
  email: string
  phone: string
}

/** Endereço de entrega associado ao pedido. */
export interface DeliveryAddress {
  address: string
  neighborhood: string
  city: string
  cep: string
  complement?: string
}

/** Informações de pagamento do pedido. */
export interface PaymentInfo {
  method: string
  installments?: number
}

/** Resumo financeiro do pedido (subtotal, frete, desconto, total). */
export interface OrderSummary {
  subtotal: number
  shipping: number
  discount: number
  total: number
}

/** Entidade principal de Pedido, retornada pela API. */
export interface Order {
  id: string
  status: string
  created_at: string
  total?: number
  items: OrderItem[]
  personal_info?: PersonalInfo
  delivery_address?: DeliveryAddress
  payment_info?: PaymentInfo
  summary?: OrderSummary
}
