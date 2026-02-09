import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCart } from '@/contexts/CartContext'
import { getProductById } from '@/services/productService'
import type { Product } from '@/types/Product'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cart = useCart()
  const [singleProduct, setSingleProduct] = useState<Product | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')

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
      ? [{ product: singleProduct, quantity: 1 }]
      : []
    : cart.items

  const isLoading = id ? !singleProduct : false

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-center min-h-100">
        <p className="text-lg text-dark-gray-2">Carregando...</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col items-center justify-center min-h-100">
        <p className="text-lg text-dark-gray-2 mb-4">
          Nenhum item para checkout.
        </p>
        <Button
          onClick={() => navigate('/carrinho')}
          className="bg-primary hover:bg-tertiary text-white font-bold px-8 h-12 rounded-lg"
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
        if (item.product.priceDiscount && item.product.priceDiscount < item.product.price) {
          return acc + (item.product.price - item.product.priceDiscount) * item.quantity
        }
        return acc
      }, 0)
    : cart.discount
  const total = subtotal - (id ? 0 : discount) + shipping

  const installmentValue = total > 0 ? (total / 10).toFixed(2).replace('.', ',') : '0,00'

  // Componente de Resumo reutilizável para Mobile e Desktop
  const SummaryContent = () => (
    <>
      {/* Product Info - lista todos os itens */}
      <div className="mb-6 pb-6 border-b border-light-gray-3 space-y-4">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex items-start gap-4">
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

      {/* Button */}
      <Button className="w-full h-12 bg-[#F6AA1C] hover:bg-[#F6AA1C]/90 text-white font-bold text-base rounded-lg transition-colors">
        Realizar Pagamento
      </Button>
    </>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12 bg-[#F9F8FE] lg:bg-transparent">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-dark-gray-2 mb-6 lg:text-[32px] lg:mb-8">
        Finalizar Compra
      </h1>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms (65-70%) */}
        <div className="w-full lg:w-[65%]">
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                  />
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                  />
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                  />
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                  />
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                  />
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                  />
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                  />
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                  />
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
                    className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
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
                    onValueChange={setPaymentMethod}
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

                {/* Credit Card Fields */}
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-5 pt-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="cardName"
                        className="text-xs font-bold text-dark-gray-2"
                      >
                        Nome do Cartão <span className="text-[#ED1A5A]">*</span>
                      </Label>
                      <Input
                        id="cardName"
                        placeholder="Insira o nome do Cartão"
                        className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="cardNumber"
                        className="text-xs font-bold text-dark-gray-2"
                      >
                        Data e Número do Cartão{' '}
                        <span className="text-[#ED1A5A]">*</span>
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="Insira número do Cartão"
                        className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="cardExpiry"
                          className="text-xs font-bold text-dark-gray-2"
                        >
                          Data de validade do Cartão{' '}
                          <span className="text-[#ED1A5A]">*</span>
                        </Label>
                        <Input
                          id="cardExpiry"
                          placeholder="Insira a validade do Cartão"
                          className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="cardCvv"
                          className="text-xs font-bold text-dark-gray-2"
                        >
                          CVV <span className="text-[#ED1A5A]">*</span>
                        </Label>
                        <Input
                          id="cardCvv"
                          placeholder="CVV *"
                          className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Section>
          </div>

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

            <Button className="w-full h-12 bg-[#F6AA1C] hover:bg-[#F6AA1C]/90 text-white font-bold text-base rounded-lg transition-colors">
              Realizar Pagamento
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
