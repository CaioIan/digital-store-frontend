import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

interface OrderSuccessData {
  id: string
  status: string
  created_at: string
  personal_info: {
    full_name: string
    cpf: string
    email: string
    phone: string
  }
  delivery_address: {
    address: string
    neighborhood: string
    city: string
    cep: string
    complement?: string
  }
  payment_info: {
    method: string
    installments?: number
  }
  items: {
    id: string
    product_id: string
    product_name: string
    image_url: string
    quantity: number
    price_at_purchase: number
  }[]
  summary: {
    subtotal: number
    shipping: number
    discount: number
    total: number
  }
}

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderSuccessData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const { data } = await api.get<OrderSuccessData>(`/orders/${id}`)
        setOrder(data)
      } catch (err: any) {
        console.error('Erro ao carregar pedido:', err)
        setError('Não foi possível carregar os detalhes deste pedido.')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8FE] py-12 px-4 flex items-center justify-center">
        <p className="text-dark-gray-2 text-lg animate-pulse font-bold">
          Buscando detalhes do pedido...
        </p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F9F8FE] py-12 px-4 flex flex-col items-center justify-center">
        <p className="text-error font-bold text-xl mb-4 text-center">
          {error || 'Pedido não encontrado'}
        </p>
        <Button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-tertiary text-white font-bold h-12 rounded-lg px-8"
        >
          Voltar para a Loja
        </Button>
      </div>
    )
  }

  // Bloco reuitilizável para exibir linhas de dados
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col mb-1 last:mb-0">
      <span className="text-dark-gray-2 font-bold text-sm leading-tight">
        {label}
      </span>
      <span className="text-light-gray-2 text-xs leading-tight mt-0.5">
        {value}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9F8FE] py-8 lg:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Receipt Card */}
        <div className="bg-white rounded-[4px] px-6 py-8 lg:p-10 flex flex-col items-center">
          {/* Header */}
          <div className="mb-4">
            <span className="text-4xl text-[#F6AA1C]">🎉</span>
          </div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-dark-gray-2 mb-8 text-center leading-tight">
            Compra Realizada
            <br className="lg:hidden" /> com sucesso!
          </h1>

          <div className="w-full text-left">
            {/* Personal Info */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-dark-gray-2 mb-4 tracking-wide">
                Informações Pessoais
              </h2>
              <div className="space-y-3">
                <InfoRow label="Nome" value={order.personal_info.full_name} />
                <InfoRow label="CPF" value={order.personal_info.cpf} />
                <InfoRow label="Email" value={order.personal_info.email} />
                <InfoRow label="Celular" value={order.personal_info.phone} />
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-dark-gray-2 mb-4 tracking-wide">
                Informações de Entrega
              </h2>
              <div className="space-y-3">
                <InfoRow
                  label="Endereço"
                  value={order.delivery_address.address}
                />
                <InfoRow
                  label="Bairro"
                  value={order.delivery_address.neighborhood}
                />
                <InfoRow label="Cidade" value={order.delivery_address.city} />
                <InfoRow label="CEP" value={order.delivery_address.cep} />
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-10">
              <h2 className="text-sm font-bold text-dark-gray-2 mb-4 tracking-wide">
                Informações de Pagamento
              </h2>
              <div className="space-y-3">
                <InfoRow
                  label="Método"
                  value={
                    order.payment_info.method === 'credit-card'
                      ? 'Cartão de Crédito (Simulação)'
                      : 'Boleto Bancário'
                  }
                />
                {order.payment_info.method === 'credit-card'
                  && order.payment_info.installments && (
                    <InfoRow
                      label="Parcelas"
                      value={`${order.payment_info.installments}x`}
                    />
                  )}
              </div>
            </div>

            {/* Resumo da compra items */}
            <div className="mb-10">
              <h2 className="text-sm font-bold text-dark-gray-2 mb-6 tracking-wide">
                Resumo da compra
              </h2>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <p className="text-sm font-bold text-dark-gray-2 flex-1 leading-snug">
                      {item.product_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Box */}
            <div className="bg-[#F6AA1C]/10 rounded-xl p-6 w-full mb-10 text-center">
              <span className="block text-light-gray-2 text-[15px] mb-1">
                Total
              </span>
              <span className="block text-2xl font-bold text-dark-gray-2 mb-1">
                {formatPrice(order.summary.total)}
              </span>
              {order.payment_info.method === 'credit-card'
                && order.payment_info.installments && (
                  <span className="block text-xs text-light-gray-2">
                    ou {order.payment_info.installments}x de{' '}
                    {formatPrice(
                      order.summary.total / order.payment_info.installments
                    )}{' '}
                    sem juros
                  </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              <button
                onClick={() => window.print()}
                className="text-light-gray text-sm underline hover:text-dark-gray-2 transition-colors cursor-pointer"
              >
                Imprimir Recibo
              </button>

              <Button
                onClick={() => navigate('/')}
                className="w-full max-w-[400px] h-[50px] bg-[#F6AA1C] hover:bg-[#F6AA1C]/90 text-white font-bold text-base rounded-lg transition-colors cursor-pointer"
              >
                Voltar para Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
