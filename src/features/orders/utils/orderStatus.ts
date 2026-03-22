/**
 * Mapa de status dos pedidos.
 * Cada status possui um label em português e uma classe CSS para estilização.
 */
export const statusMap: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Aguardando Pagamento',
    className:
      'bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold'
  },
  completed: {
    label: 'Pago',
    className:
      'bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold'
  },
  shipped: {
    label: 'Em Rota de Entrega',
    className: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold'
  },
  delivered: {
    label: 'Entregue',
    className: 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold'
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold'
  }
}

/**
 * Retorna as informações de exibição (label amigável e classe CSS) de um status de pedido.
 * 
 * Se o status não for encontrado no `statusMap`, o padrão retornado é o status "Pago".
 * 
 * @param {string} status - O código do status técnico vindo da API.
 * @returns {Object} Objeto com as propriedades `label` e `className`.
 */
export function getStatusInfo(status: string) {
  return (
    statusMap[status] ?? {
      label: 'Pago',
      className:
        'bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold'
    }
  )
}
