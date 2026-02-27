import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { api } from '@/lib/api'
import { getProductById } from '@/services/productService'
import type { Product } from '@/types/Product'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

// --- ZOD SCHEMA ---
const checkoutSchema = z
  .object({
    // Personal Info
    fullName: z
      .string()
      .min(3, 'O nome deve ter no mínimo 3 caracteres.')
      .nonempty('Nome é obrigatório'),
    cpf: z
      .string()
      .min(11, 'O CPF deve ter no mínimo 11 caracteres.')
      .nonempty('CPF é obrigatório'),
    email: z
      .string()
      .email('Email inválido')
      .nonempty('Email é obrigatório'),
    phone: z.string().nonempty('Celular é obrigatório'),

    // Delivery Address
    address: z.string().nonempty('Endereço é obrigatório'),
    neighborhood: z.string().nonempty('Bairro é obrigatório'),
    city: z.string().nonempty('Cidade é obrigatória'),
    cep: z.string().nonempty('CEP é obrigatório'),
    complement: z.string().optional(),

    // Payment Info
    paymentMethod: z.enum(['credit-card', 'boleto'])
  })

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cart = useCart()
  const { user } = useAuth()
  
  const [singleProduct, setSingleProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'credit-card',
      // PRE-FILL USER REGSITRATION DATA:
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

  // Se vier com id na URL, busca produto individual (compra direta)
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        const productData = await getProductById(id)
        if (productData) {
          setSingleProduct(productData)
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
      }
    }
    fetchProduct()
  }, [id])

  // Determina quais itens exibir: carrinho ou produto individual
  const cartItems = id
    ? singleProduct
      ? [{ product: singleProduct, quantity: 1, id: 'temp-direct-buy' }] // ID finto do cart item pra bater com a tipagem da lista
      : []
    : cart.items

  const isLoading = id ? !singleProduct : false

  // Form Submission Handler
  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const payload = {
        personal_info: {
          full_name: data.fullName,
          cpf: data.cpf,
          email: data.email,
          phone: data.phone
        },
        delivery_address: {
          address: data.address,
          neighborhood: data.neighborhood,
          city: data.city,
          cep: data.cep,
          complement: data.complement || ''
        },
        payment: {
          method: data.paymentMethod,
          installments: 10
        }
      }

      // POST para criar o Pedido
      const response = await api.post('/orders', payload)
      
      // Limpa os dados do contexto localmente (o backend limpou no banco já)
      await cart.fetchCart() 
      
      // Redireciona para o Sucesso usando order_id retornado
      const orderId = response.data.order_id || response.data.id
      navigate(`/order/${orderId}/success`)
      
    } catch (err: any) {
      console.error(err)
      setSubmitError(err.response?.data?.message || 'Erro inesperado ao criar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Visual Returns early
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

  // Calculate order values from items
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

  const installmentValue =
    total > 0 ? (total / 10).toFixed(2).replace('.', ',') : '0,00'

  // Componente de Resumo reutilizável para Mobile e Desktop
  const SummaryContent = () => (
    <>
      <div className="mb-6 pb-6 border-b border-light-gray-3 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#E2E3FF] rounded px-1 shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-dark-gray-2 leading-snug">
                {item.product.name}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-light-gray mt-1">
                  Qtd: {item.quantity}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Values */}
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

      {/* Total Section Box */}
      <div className="bg-[#F6AA1C]/10 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-dark-gray-2">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-dark-gray-2">
              {formatPrice(total)}
            </span>
            <p className="text-xs text-dark-gray-2">
              ou 10x de R$ {installmentValue} sem juros
            </p>
          </div>
        </div>
      </div>

      {/* Button Desktop */}
      <Button 
        type="submit" 
        form="checkout-form"
        disabled={isSubmitting} 
        className="w-full h-12 bg-[#F6AA1C] hover:bg-[#F6AA1C]/90 text-white font-bold text-base rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processando...' : 'Realizar Pagamento'}
      </Button>
    </>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12 bg-[#F9F8FE] lg:bg-transparent">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-dark-gray-2 mb-6 lg:text-[32px] lg:mb-8">
        Finalizar Compra
      </h1>

      {submitError && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-lg text-sm font-medium">
          {submitError}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms (65-70%) */}
        <div className="w-full lg:w-[65%]">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Block 1 - Personal Information */}
            <div className="bg-white rounded-lg p-0 lg:p-6 mb-6">
              <Section title="Informações Pessoais">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      Nome Completo <span className="text-[#ED1A5A]">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Insira seu nome"
                      {...register('fullName')}
                      className={`bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary ${errors.fullName ? 'ring-1 ring-error' : ''}`}
                    />
                    {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cpf"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      CPF <span className="text-[#ED1A5A]">*</span>
                    </Label>
                    <Input
                      id="cpf"
                      placeholder="Insira seu CPF"
                      {...register('cpf')}
                      className={`bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary ${errors.cpf ? 'ring-1 ring-error' : ''}`}
                    />
                    {errors.cpf && <p className="text-xs text-error mt-1">{errors.cpf.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      E-mail <span className="text-[#ED1A5A]">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Insira seu email"
                      {...register('email')}
                      className={`bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary ${errors.email ? 'ring-1 ring-error' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      Celular <span className="text-[#ED1A5A]">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Insira seu celular"
                      {...register('phone')}
                      className={`bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary ${errors.phone ? 'ring-1 ring-error' : ''}`}
                    />
                    {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </Section>
            </div>

            {/* Block 2 - Delivery Information */}
            <div className="bg-white rounded-lg p-0 lg:p-6 mb-6">
              <Section title="Informações de Entrega">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      Endereço <span className="text-[#ED1A5A]">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="Insira seu endereço"
                      {...register('address')}
                      className={`bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary ${errors.address ? 'ring-1 ring-error' : ''}`}
                    />
                    {errors.address && <p className="text-xs text-error mt-1">{errors.address.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="neighborhood"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      Bairro <span className="text-[#ED1A5A]">*</span>
                    </Label>
                    <Input
                      id="neighborhood"
                      placeholder="Insira seu bairro"
                      {...register('neighborhood')}
                      className={`bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary ${errors.neighborhood ? 'ring-1 ring-error' : ''}`}
                    />
                    {errors.neighborhood && <p className="text-xs text-error mt-1">{errors.neighborhood.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      Cidade <span className="text-[#ED1A5A]">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="Insira sua cidade"
                      {...register('city')}
                      className={`bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary ${errors.city ? 'ring-1 ring-error' : ''}`}
                    />
                    {errors.city && <p className="text-xs text-error mt-1">{errors.city.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cep"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      CEP <span className="text-[#ED1A5A]">*</span>
                    </Label>
                    <Input
                      id="cep"
                      placeholder="Insira seu CEP"
                      {...register('cep')}
                      className={`bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary ${errors.cep ? 'ring-1 ring-error' : ''}`}
                    />
                    {errors.cep && <p className="text-xs text-error mt-1">{errors.cep.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="complement"
                      className="text-xs font-bold text-dark-gray-2"
                    >
                      Complemento
                    </Label>
                    <Input
                      id="complement"
                      placeholder="Insira complemento"
                      {...register('complement')}
                      className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </Section>
            </div>

            {/* Block 3 - Payment Information */}
            <div className="bg-white rounded-lg p-0 lg:p-6 mb-6">
              <Section title="Informações de Pagamento">
                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-dark-gray-2">
                      Forma de Pagamento
                    </Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(val) => setValue('paymentMethod', val as 'credit-card' | 'boleto')}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="credit-card"
                          id="credit-card"
                          className="text-[#ED1A5A] border-light-gray-2"
                        />
                        <Label
                          htmlFor="credit-card"
                          className="text-sm text-dark-gray-2 font-normal cursor-pointer"
                        >
                          Cartão de Crédito
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="boleto"
                          id="boleto"
                          className="text-[#ED1A5A] border-light-gray-2"
                        />
                        <Label
                          htmlFor="boleto"
                          className="text-sm text-dark-gray-2 font-normal cursor-pointer"
                        >
                          Boleto Bancário
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === 'credit-card' && (
                    <div className="space-y-5 pt-2">
                       <p className="text-sm text-light-gray-2 bg-light-gray-3 p-4 rounded-lg text-center font-medium">
                         🎉 Ambiente de Demonstração! <br/> Pagamentos via Cartão de Crédito são aprovados automaticamente. Não é necessário preencher dados reais do cartão.
                       </p>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </form>

          {/* Mobile Summary Block (Visually matches the 'Resumo' card in image) */}
          <div className="lg:hidden w-full bg-white rounded-lg p-0 mb-8">
            <Section title="RESUMO">
              <SummaryContent />
            </Section>
          </div>

          {/* Sticky Bottom Bar for Mobile (Matches the bottom strip of image) */}
          <div className="lg:hidden w-screen -mx-4 bg-white px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-bold text-dark-gray-2">
                Total
              </span>
              <div className="text-right">
                <span className="text-xl font-bold text-[#ED1A5A]">
                  {formatPrice(total)}
                </span>
                <p className="text-xs text-light-gray-2">
                  ou 10x de R$ {installmentValue} sem juros
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#F6AA1C] hover:bg-[#F6AA1C]/90 text-white font-bold text-base rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processando...' : 'Realizar Pagamento'}
            </Button>
          </div>
        </div>

        {/* Right Column - Order Summary (Desktop only) */}
        <div className="hidden lg:block lg:w-[35%]">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-dark-gray-2 mb-6 uppercase">
              RESUMO
            </h2>
            <SummaryContent />
          </div>
        </div>
      </div>
    </div>
  )
}
