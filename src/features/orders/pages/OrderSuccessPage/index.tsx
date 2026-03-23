import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/core'
import type { Order as OrderSuccessData } from '@/features/orders'
import { Button } from '@/shared/components'
import { formatPrice } from '@/shared/utils'

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
      } catch (fetchOrderError) {
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
      <main className="min-h-screen bg-[#F9F8FE] py-8 lg:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <section
            className="bg-white rounded-lg px-6 py-8 lg:p-10 flex flex-col items-center min-h-175 justify-center transition-all duration-300"
            aria-busy="true"
            aria-label="Carregando detalhes do pedido"
          >
            <div className="animate-pulse flex flex-col items-center w-full">
              <div className="w-16 h-16 bg-light-gray-3 rounded-full mb-6" />
              <div className="h-10 bg-light-gray-3 rounded w-3/4 mb-10" />
              <div className="space-y-4 w-full px-4">
                <div className="h-4 bg-light-gray-3 rounded w-1/2" />
                <div className="h-4 bg-light-gray-3 rounded w-full" />
                <div className="h-4 bg-light-gray-3 rounded w-2/3" />
              </div>
              <p className="text-dark-gray-2 text-lg font-bold mt-10">
                Processando seu pedido...
              </p>
            </div>
          </section>
        </div>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#F9F8FE] py-12 px-4 flex flex-col items-center justify-center">
        <p
          className="text-error font-bold text-xl mb-4 text-center"
          role="alert"
        >
          {error || 'Pedido não encontrado'}
        </p>
        <Button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-tertiary text-white font-bold h-12 rounded-lg px-8"
        >
          Voltar para a Loja
        </Button>
      </main>
    )
  }

  // Bloco reuitilizável para exibir linhas de dados
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col mb-1 last:mb-0">
      <dt className="text-dark-gray-2 font-bold text-sm leading-tight">
        {label}
      </dt>
      <dd className="text-light-gray-2 text-xs leading-tight mt-0.5">
        {value}
      </dd>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#F9F8FE] py-8 lg:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Receipt Card */}
        <article className="bg-white rounded-lg px-6 py-8 lg:p-10 flex flex-col items-center min-h-175 animate-in fade-in duration-500">
          {/* Header */}
          <div className="mb-4">
            <span className="text-4xl" role="img" aria-label="Festividade">
              🎉
            </span>
          </div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-dark-gray-2 mb-8 text-center leading-tight">
            Compra Realizada
            <br className="lg:hidden" /> com sucesso!
          </h1>

          <div className="w-full text-left">
            {/* Personal Info */}
            <section className="mb-8" aria-labelledby="personal-info-title">
              <h2
                id="personal-info-title"
                className="text-sm font-bold text-dark-gray-2 mb-4 tracking-wide"
              >
                Informações Pessoais
              </h2>
              <dl className="space-y-3">
                <InfoRow
                  label="Nome"
                  value={order.personal_info?.full_name ?? ''}
                />
                <InfoRow label="CPF" value={order.personal_info?.cpf ?? ''} />
                <InfoRow
                  label="Email"
                  value={order.personal_info?.email ?? ''}
                />
                <InfoRow
                  label="Celular"
                  value={order.personal_info?.phone ?? ''}
                />
              </dl>
            </section>

            {/* Delivery Info */}
            <section className="mb-8" aria-labelledby="delivery-info-title">
              <h2
                id="delivery-info-title"
                className="text-sm font-bold text-dark-gray-2 mb-4 tracking-wide"
              >
                Informações de Entrega
              </h2>
              <dl className="space-y-3">
                <InfoRow
                  label="Endereço"
                  value={order.delivery_address?.address ?? ''}
                />
                <InfoRow
                  label="Bairro"
                  value={order.delivery_address?.neighborhood ?? ''}
                />
                <InfoRow
                  label="Cidade"
                  value={order.delivery_address?.city ?? ''}
                />
                <InfoRow
                  label="CEP"
                  value={order.delivery_address?.cep ?? ''}
                />
              </dl>
            </section>

            {/* Payment Info */}
            <section className="mb-10" aria-labelledby="payment-info-title">
              <h2
                id="payment-info-title"
                className="text-sm font-bold text-dark-gray-2 mb-4 tracking-wide"
              >
                Informações de Pagamento
              </h2>
              <dl className="space-y-3">
                <InfoRow
                  label="Método"
                  value={
                    order.payment_info?.method === 'credit-card'
                      ? 'Cartão de Crédito (Simulação)'
                      : 'Boleto Bancário'
                  }
                />
              </dl>
            </section>

            {/* Resumo da compra items */}
            <section className="mb-10" aria-labelledby="order-summary-title">
              <h2
                id="order-summary-title"
                className="text-sm font-bold text-dark-gray-2 mb-6 tracking-wide"
              >
                Resumo da compra
              </h2>
              <ul className="space-y-6">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <article className="flex items-center gap-4">
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
                    </article>
                  </li>
                ))}
              </ul>
            </section>

            {/* Total Box */}
            <div className="bg-[#F6AA1C]/10 rounded-xl p-6 w-full mb-10 text-center">
              <span className="block text-light-gray-2 text-[15px] mb-1">
                Total
              </span>
              <span className="block text-2xl font-bold text-dark-gray-2 mb-1">
                {formatPrice(order.summary?.total ?? 0)}
              </span>
            </div>

            {/* Actions */}
            <footer className="flex flex-col items-center justify-center gap-6 w-full">
              <button
                type="button"
                onClick={() => window.print()}
                className="text-light-gray text-sm underline hover:text-dark-gray-2 transition-colors cursor-pointer"
              >
                Imprimir Recibo
              </button>

              <Button
                onClick={() => navigate('/')}
                className="w-full max-w-100 h-12.5 bg-[#F6AA1C] hover:bg-[#F6AA1C]/90 text-white font-bold text-base rounded-lg transition-colors cursor-pointer"
              >
                Voltar para Home
              </Button>
            </footer>
          </div>
        </article>
      </div>
    </main>
  )
}
