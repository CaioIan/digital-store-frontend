import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/core'
import { getStatusInfo, type Order } from '@/features/orders'
import { ProfileLayout } from '@/features/user'
import { Button } from '@/shared/components'

import { formatPrice } from '@/shared/utils'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const { data } = await api.get<Order>(`/orders/${id}`)
        setOrder(data)
      } catch (err) {
        // Erro silencioso ao carregar pedido
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
      <ProfileLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-light-gray-3 rounded w-24 mb-6" />
          <div className="h-8 bg-light-gray-3 rounded w-1/2 mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-light-gray-3 rounded w-full" />
            <div className="h-4 bg-light-gray-3 rounded w-2/3" />
            <div className="h-4 bg-light-gray-3 rounded w-full" />
          </div>
        </div>
      </ProfileLayout>
    )
  }

  if (error || !order) {
    return (
      <ProfileLayout>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-error font-bold mb-4">
            {error || 'Pedido não encontrado'}
          </p>
          <Button
            onClick={() => navigate('/meus-pedidos')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar para Meus Pedidos
          </Button>
        </div>
      </ProfileLayout>
    )
  }

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

  const formatOrderId = (orderId: string) => {
    const digits = orderId.replace(/\D/g, '')
    return digits.slice(0, 10) || orderId.slice(0, 10)
  }

  return (
    <ProfileLayout>
      <div className="flex flex-col gap-6">
        {/* Header/Back Link */}
        <button
          type="button"
          onClick={() => navigate('/meus-pedidos')}
          className="flex items-center gap-2 text-primary text-sm font-bold hover:text-tertiary transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Voltar para Meus Pedidos
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-light-gray-3 pb-6 gap-4">
          <div>
            <span className="text-[11px] font-medium text-[#8F8F8F] tracking-wide mb-1 block">
              Pedido nᵒ {formatOrderId(order.id)}
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-dark-gray">
              Detalhes do Pedido
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-xs font-bold text-dark-gray-2 uppercase tracking-wide">
              Status
            </span>
            <span
              className={`${getStatusInfo(order.status).className} text-sm`}
            >
              {getStatusInfo(order.status).label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-2">
          {/* Personal Info */}
          {order.personal_info && (
            <div>
              <h2 className="text-sm font-bold text-dark-gray-2 mb-4 uppercase tracking-wide">
                Informações Pessoais
              </h2>
              <div className="space-y-3">
                <InfoRow label="Nome" value={order.personal_info.full_name} />
                <InfoRow label="CPF" value={order.personal_info.cpf} />
                <InfoRow label="Email" value={order.personal_info.email} />
                <InfoRow label="Celular" value={order.personal_info.phone} />
              </div>
            </div>
          )}

          {/* Delivery Info */}
          {order.delivery_address && (
            <div>
              <h2 className="text-sm font-bold text-dark-gray-2 mb-4 uppercase tracking-wide">
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
          )}

          {/* Payment Info */}
          {order.payment_info && (
            <div>
              <h2 className="text-sm font-bold text-dark-gray-2 mb-4 uppercase tracking-wide">
                Informações de Pagamento
              </h2>
              <div className="space-y-3">
                <InfoRow
                  label="Método"
                  value={
                    order.payment_info.method === 'credit-card'
                      ? 'Cartão de Crédito'
                      : 'Boleto Bancário'
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="pt-4 border-t border-light-gray-3">
          <h2 className="text-sm font-bold text-dark-gray-2 mb-6 uppercase tracking-wide">
            Itens do Pedido
          </h2>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div
                key={item.id || item.product_id}
                className="flex items-center gap-4 py-2 border-b border-light-gray-3 last:border-b-0"
              >
                <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-hidden bg-light-gray-3 rounded">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-dark-gray-2 leading-snug">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-light-gray mt-1">
                    Qtd: {item.quantity} • {formatPrice(item.price_at_purchase)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-dark-gray-2">
                    {formatPrice(item.price_at_purchase * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-4 ml-auto w-full max-w-sm">
          <div className="bg-[#F9F8FE] rounded-lg p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-light-gray-2 font-medium">Subtotal:</span>
              <span className="text-dark-gray-2 font-bold">
                {formatPrice(order.summary?.subtotal ?? 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-light-gray-2 font-medium">Frete:</span>
              <span className="text-dark-gray-2 font-bold">
                {formatPrice(order.summary?.shipping ?? 0)}
              </span>
            </div>
            {order.summary && order.summary.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-light-gray-2 font-medium">Desconto:</span>
                <span className="text-dark-gray-2 font-bold text-error">
                  -{formatPrice(order.summary.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg pt-4 border-t border-light-gray-3">
              <span className="text-dark-gray font-bold uppercase transition-colors">
                Total:
              </span>
              <span className="text-primary font-bold">
                {formatPrice(order.summary?.total ?? 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => window.print()}
            variant="ghost"
            className="text-primary text-lg underline hover:text-tertiary"
          >
            Imprimir Detalhes do Pedido
          </Button>
        </div>
      </div>
    </ProfileLayout>
  )
}
