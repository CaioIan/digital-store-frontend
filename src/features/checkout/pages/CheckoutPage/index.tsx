import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { api } from '@/core'
import { useAuth } from '@/features/auth'
import { useCart } from '@/features/cart'
import {
  CheckoutSummary,
  DeliveryAddressSection,
  PaymentMethodSection,
  PersonalInfoSection
} from '@/features/checkout'
import { getProductById, type Product } from '@/features/products'
import { Button, Section } from '@/shared/components'
import { formatPrice, removeNonNumbers } from '@/shared/utils'

// --- ZOD SCHEMA ---
const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres.')
    .nonempty('Nome é obrigatório'),
  cpf: z
    .string()
    .min(11, 'O CPF deve ter no mínimo 11 caracteres.')
    .nonempty('CPF é obrigatório'),
  email: z.string().email('Email inválido').nonempty('Email é obrigatório'),
  phone: z.string().nonempty('Celular é obrigatório'),
  address: z.string().nonempty('Endereço é obrigatório'),
  neighborhood: z.string().nonempty('Bairro é obrigatório'),
  city: z.string().nonempty('Cidade é obrigatória'),
  cep: z.string().nonempty('CEP é obrigatório'),
  complement: z.string().optional(),
  paymentMethod: z.enum(['credit-card', 'boleto'])
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

/**
 * Página de Checkout (Finalização de Compra).
 * Gerencia o formulário de endereço e pagamento usando React Hook Form + Zod.
 */
export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cart = useCart()
  const { user } = useAuth()

  const [singleProduct, setSingleProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit-card',
      fullName: user ? `${user.firstname} ${user.surname}` : '',
      email: user?.email || '',
      cpf: user?.cpf || '',
      phone: user?.phone || '',
      address: user?.address || '',
      neighborhood: user?.neighborhood || '',
      city: user?.city || '',
      cep: user?.cep || '',
      complement: user?.complement || ''
    }
  })

  const paymentMethod = watch('paymentMethod')

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        const productData = await getProductById(id)
        if (productData) setSingleProduct(productData)
      } catch (error) {
        // Erro silencioso; o estado singleProduct permanece null
      }
    }
    fetchProduct()
  }, [id])

  const cartItems = id
    ? singleProduct
      ? [{ product: singleProduct, quantity: 1, id: 'temp-direct-buy' }]
      : []
    : cart.items

  const isLoading = id ? !singleProduct : false

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const payload = {
        personal_info: {
          full_name: data.fullName,
          cpf: data.cpf ? removeNonNumbers(data.cpf) : '',
          email: data.email,
          phone: data.phone ? removeNonNumbers(data.phone) : ''
        },
        delivery_address: {
          address: data.address,
          neighborhood: data.neighborhood,
          city: data.city,
          cep: data.cep ? removeNonNumbers(data.cep) : '',
          complement: data.complement || ''
        },
        payment: { method: data.paymentMethod }
      }

      const response = await api.post('/orders', payload)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await cart.fetchCart()
      const orderId = response.data.order_id || response.data.id
      navigate(`/order/${orderId}/success`)
    } catch (err: unknown) {
      let errorMessage = 'Erro inesperado ao criar pedido. Tente novamente.'
      if (
        typeof err === 'object'
        && err !== null
        && 'response' in err
        && typeof (err as { response: unknown }).response === 'object'
      ) {
        const response = (err as { response: { data?: { message?: string } } })
          .response
        if (response?.data?.message) {
          errorMessage = response.data.message
        }
      }
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-center min-h-100">
        <p className="text-lg text-dark-gray-2 animate-pulse">Carregando...</p>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col items-center justify-center min-h-100">
        <p className="text-lg text-dark-gray-2 mb-4">
          Nenhum item para checkout.
        </p>
        <Button
          onClick={() => navigate('/carrinho')}
          className="bg-primary hover:bg-tertiary text-white font-bold px-8 h-12 rounded-lg cursor-pointer"
        >
          Ir para o Carrinho
        </Button>
      </div>
    )
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.priceDiscount || item.product.price
    return acc + price * item.quantity
  }, 0)

  const shipping = id ? 0 : cart.shipping
  const discount = id
    ? cartItems.reduce((acc, item) => {
        if (
          item.product.priceDiscount
          && item.product.priceDiscount < item.product.price
        ) {
          return (
            acc
            + (item.product.price - item.product.priceDiscount) * item.quantity
          )
        }
        return acc
      }, 0)
    : cart.discount

  const total = subtotal - (id ? 0 : discount) + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12 bg-[#F9F8FE] lg:bg-transparent">
      <h1 className="text-2xl font-bold text-dark-gray-2 mb-6 lg:text-[32px] lg:mb-8">
        Finalizar Compra
      </h1>

      {submitError && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-lg text-sm font-medium">
          {submitError}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:flex-1 lg:min-w-0">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-lg p-0 lg:p-6 mb-6">
              <Section title="Informações Pessoais">
                <PersonalInfoSection
                  register={register}
                  control={control}
                  errors={errors}
                />
              </Section>
            </div>

            <div className="bg-white rounded-lg p-0 lg:p-6 mb-6">
              <Section title="Informações de Entrega">
                <DeliveryAddressSection register={register} errors={errors} />
              </Section>
            </div>

            <div className="bg-white rounded-lg p-0 lg:p-6 mb-6">
              <Section title="Informações de Pagamento">
                <PaymentMethodSection
                  paymentMethod={paymentMethod}
                  onMethodChange={(val) => setValue('paymentMethod', val)}
                />
              </Section>
            </div>
          </form>

          <div className="lg:hidden w-full bg-white rounded-lg p-0 mb-8">
            <Section title="RESUMO">
              <CheckoutSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                isSubmitting={isSubmitting}
                showCTA={false}
              />
            </Section>
          </div>

          <div className="h-36 lg:hidden" />
        </div>

        <div className="hidden lg:block lg:w-[340px] shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-dark-gray-2 mb-6 uppercase">
              RESUMO
            </h2>
            <CheckoutSummary
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Floating CTA Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-bold text-dark-gray-2">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>
        </div>
        <Button
          type="submit"
          form="checkout-form"
          disabled={isSubmitting}
          className="w-full h-12 bg-warning hover:bg-warning/90 text-white font-bold text-base rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processando...' : 'Realizar Pagamento'}
        </Button>
      </div>
    </div>
  )
}
