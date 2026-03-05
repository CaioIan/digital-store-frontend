import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import ProfileLayout from '@/components/ProfileLayout'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

/* ─── Tipos ─── */

interface OrderItem {
  product_id: number
  product_name: string
  image_url: string
  quantity: number
  price_at_purchase: number
}

interface Order {
  id: string
  status: string
  created_at: string
  total: number
  items: OrderItem[]
}

/* ─── Helpers ─── */

const statusMap: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Produto em trânsito',
    className: 'text-warning font-bold'
  },
  in_transit: {
    label: 'Produto em trânsito',
    className: 'text-warning font-bold'
  },
  completed: {
    label: 'Finalizado',
    className: 'text-[#8F8F8F] font-semibold'
  },
  cancelled: {
    label: 'Cancelado',
    className: 'text-error font-bold'
  }
}

function getStatusInfo(status: string) {
  return (
    statusMap[status] ?? {
      label: 'Produto em trânsito',
      className: 'text-warning font-bold'
    }
  )
}

function formatOrderId(id: string) {
  const digits = id.replace(/\D/g, '')
  return digits.slice(0, 10) || id.slice(0, 10)
}

/* ─── Order Row ─── */

function OrderRow({ order }: { order: Order }) {
  const firstItem = order.items[0]
  const statusInfo = getStatusInfo(order.status)

  return (
    <div className="flex flex-col md:flex-row md:items-center py-5 border-b border-light-gray-3 last:border-b-0 gap-4 md:gap-5">
      {/* Top: Image and Text */}
      <div className="flex gap-[14px] flex-1 items-start md:items-center min-w-0 w-full">
        {/* Thumbnail */}
        <div className="w-[72px] h-[72px] shrink-0 rounded-[4px] bg-[#E2E3FF] flex items-center justify-center p-2">
          {firstItem ? (
            <img
              src={firstItem.image_url}
              alt={firstItem.product_name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          ) : (
            <div className="w-full h-full bg-light-gray-3 rounded-[4px]" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 pt-0.5 md:pt-0">
          <span className="text-[11px] font-medium text-[#8F8F8F] tracking-wide mb-1 leading-none">
            Pedido nᵒ {formatOrderId(order.id)}
          </span>
          <h3 className="text-[13px] md:text-sm font-bold text-dark-gray leading-[1.3] pt-1">
            {firstItem?.product_name ?? 'Pedido'}
            {order.items.length > 1 && (
              <span className="text-light-gray font-normal">
                {' '}
                e mais {order.items.length - 1}{' '}
                {order.items.length - 1 === 1 ? 'item' : 'itens'}
              </span>
            )}
          </h3>
        </div>
      </div>

      {/* Bottom: Status */}
      <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-1 md:mt-0">
        <span className="text-[11px] font-bold text-dark-gray-2 uppercase tracking-wide md:hidden">
          Status
        </span>
        <span
          className={`text-[13px] md:text-sm whitespace-nowrap ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      </div>
    </div>
  )
}

/* ─── Page ─── */

export default function MyOrdersPage() {
  const { isAuthenticated } = useAuth()

  const {
    data: orders = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/orders')

      const ordersArray = Array.isArray(data) ? [...data] : []
      // Ordem cronológica crescente
      ordersArray.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

      return ordersArray
    },
    enabled: isAuthenticated
  })

  return (
    <ProfileLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-0 pb-4 border-b border-light-gray-3">
        <h1 className="text-[14px] md:text-base font-bold text-dark-gray">
          Meus Pedidos
        </h1>
        <span className="text-xs font-bold text-dark-gray-2 uppercase hidden md:inline-block">
          Status
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 bg-light-gray-3 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-light-gray-3 rounded w-24" />
                <div className="h-4 bg-light-gray-3 rounded w-48" />
              </div>
              <div className="h-4 bg-light-gray-3 rounded w-28" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="py-12 text-center">
          <p className="text-error font-medium mb-4">{error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-sm text-primary underline hover:text-tertiary transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-light-gray text-sm mb-4">
            Você ainda não possui nenhum pedido.
          </p>
          <NavLink
            to="/products"
            className="inline-flex items-center justify-center h-10 px-6 bg-primary text-white text-sm font-semibold rounded-full hover:bg-tertiary transition-colors"
          >
            Explorar Produtos
          </NavLink>
        </div>
      )}

      {/* Order List */}
      {!isLoading && !error && orders.length > 0 && (
        <div>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </ProfileLayout>
  )
}
