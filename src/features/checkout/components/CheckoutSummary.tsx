import type { Product } from '@/features/products'
import { Button } from '@/shared/components/ui/button'
import { formatPrice } from '@/shared/utils'
import { CheckoutProductItem } from './CheckoutProductItem'

interface CheckoutSummaryProps {
  items: { product: Product; quantity: number; id: string }[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  isSubmitting: boolean
  showCTA?: boolean
}

/**
 * Componente que exibe o resumo financeiro do Checkout.
 * 
 * Este componente lista os produtos que estão sendo comprados e detalha
 * os valores de Subtotal, Frete, Descontos e o Total final.
 * 
 * @param {CheckoutSummaryProps} props - Propriedades do resumo financeiro.
 * @returns {JSX.Element} Fragmento contendo a lista de itens e o resumo de valores.
 */
export const CheckoutSummary = ({
  items,
  subtotal,
  shipping,
  discount,
  total,
  isSubmitting,
  showCTA = true
}: CheckoutSummaryProps) => {
  return (
    <>
      <div className="mb-6 pb-6 border-b border-light-gray-3 space-y-4">
        {items.map((item) => (
          <CheckoutProductItem
            key={item.id}
            product={item.product}
            quantity={item.quantity}
          />
        ))}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-light-gray-2">Subtotal:</span>
          <span className="text-dark-gray-2 font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-light-gray-2">Frete:</span>
          <span className="text-dark-gray-2 font-medium">
            {formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-light-gray-2">Desconto:</span>
          <span className="text-dark-gray-2 font-medium">
            {formatPrice(discount)}
          </span>
        </div>
      </div>

      <div className="bg-[#F6AA1C]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-dark-gray-2">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-dark-gray-2">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {showCTA && (
        <Button
          type="submit"
          form="checkout-form"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#F6AA1C] hover:bg-[#F6AA1C]/90 text-white font-bold text-base rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processando...' : 'Realizar Pagamento'}
        </Button>
      )}
    </>
  )
}
