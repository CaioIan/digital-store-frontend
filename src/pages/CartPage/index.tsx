import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/contexts/CartContext'
import { getProducts } from '@/services/productService'
import type { Product } from '@/types/Product'

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)

export default function CartPage() {
  const navigate = useNavigate()
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    total,
    applyCoupon,
    couponCode,
    removeCoupon,
    setShipping
  } = useCart()

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState(false)
  const [cepInput, setCepInput] = useState('')
  const [cepCalculated, setCepCalculated] = useState(false)

  useEffect(() => {
    const fetchRelated = async () => {
      const allProducts = await getProducts()
      const cartIds = items.map((item) => item.product.id)
      const related = allProducts
        .filter((p) => !cartIds.includes(p.id))
        .slice(0, 4)
      setRelatedProducts(related)
    }
    fetchRelated()
  }, [items])

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return
    const success = applyCoupon(couponInput)
    if (!success) {
      setCouponError(true)
      setTimeout(() => setCouponError(false), 3000)
    } else {
      setCouponError(false)
      setCouponInput('')
    }
  }

  const handleCalculateShipping = () => {
    if (!cepInput.trim()) return
    // Simula cálculo de frete
    setShipping(0)
    setCepCalculated(true)
  }

  const handleContinue = () => {
    if (items.length === 0) return
    navigate('/checkout')
  }

  const installmentValue =
    total > 0 ? (total / 10).toFixed(2).replace('.', ',') : '0,00'

  // ─── Resumo reutilizável ──────────────────────────────────────
  const SummaryContent = () => (
    <>
      {/* Valores */}
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

      {/* Total */}
      <div className="border-t border-light-gray-3 pt-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-dark-gray-2">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-primary">
              {formatPrice(total)}
            </span>
            <p className="text-xs text-light-gray">
              ou 10x de R$ {installmentValue} sem juros
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={handleContinue}
        disabled={items.length === 0}
        className="w-full h-12 bg-warning hover:bg-warning/90 text-white font-bold text-base rounded-lg transition-colors disabled:opacity-50"
      >
        Continuar
      </Button>
    </>
  )

  // ─── Carrinho vazio ───────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-100 text-center">
          <h1 className="text-2xl font-bold text-dark-gray-2 mb-4">
            Seu carrinho está vazio
          </h1>
          <p className="text-light-gray mb-8">
            Adicione produtos ao carrinho para continuar comprando.
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-primary hover:bg-tertiary text-white font-bold px-8 h-12 rounded-lg"
          >
            Ver Produtos
          </Button>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <Section
            title="Produtos Relacionados"
            link={{ text: 'Ver todos', href: '/products' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  priceDiscount={product.priceDiscount}
                  category={product.category}
                />
              ))}
            </div>
          </Section>
        )}
      </div>
    )
  }

  // ─── Carrinho com itens ───────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-12">
      {/* Layout 2 colunas */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Coluna Esquerda: Carrinho (~65-70%) ── */}
        <div className="w-full lg:w-[65%]">
          {/* Cabeçalho da tabela (Desktop) */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_140px_120px_120px] gap-4 mb-4 pb-3 border-b border-light-gray-3">
            <span className="text-sm font-medium text-dark-gray-3 uppercase">
              MEU CARRINHO
            </span>
            <span className="text-sm font-medium text-dark-gray-3 uppercase text-center">
              QUANTIDADE
            </span>
            <span className="text-sm font-medium text-dark-gray-3 uppercase text-right">
              UNITÁRIO
            </span>
            <span className="text-sm font-medium text-dark-gray-3 uppercase text-right">
              TOTAL
            </span>
          </div>

          {/* ═══════ MOBILE LAYOUT ═══════ */}
          <div className="lg:hidden space-y-6">
            {/* ── BLOCO 1: MEU CARRINHO ── */}
            <div className="bg-white rounded-lg px-5 pt-5 pb-6">
              {/* Título + divisória */}
              <h2 className="text-base font-semibold text-dark-gray-2 uppercase">
                MEU CARRINHO
              </h2>
              <div className="w-[85%] h-px bg-light-gray-3 mt-3 mb-5" />

              <div className="space-y-8">
                {items.map((item) => {
                  const unitPrice =
                    item.product.priceDiscount || item.product.price
                  const itemTotal = unitPrice * item.quantity
                  const hasDiscount =
                    item.product.priceDiscount
                    && item.product.priceDiscount < item.product.price

                  return (
                    <div key={item.product.id}>
                      {/* Produto: imagem + nome + atributos */}
                      <div className="flex gap-4 items-start mb-5">
                        <div className="w-25 h-25 bg-[#E0D6F6]/40 rounded-lg shrink-0 flex items-center justify-center overflow-hidden p-2">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 pt-0.5">
                          <p className="text-sm font-bold text-dark-gray-2 leading-snug">
                            {item.product.name}
                          </p>
                          {item.selectedColor && (
                            <span className="text-xs text-dark-gray-3 mt-1">
                              Cor: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-xs text-dark-gray-3">
                              Tamanho: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ── BLOCO 2: QUANTIDADE ── */}
                      <div className="mb-5 flex flex-col items-center">
                        <span className="text-xs font-medium text-light-gray uppercase block mb-3 self-start">
                          QUANTIDADE
                        </span>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-14 h-11 flex items-center justify-center border border-light-gray-2 rounded-md bg-white text-dark-gray-2 hover:bg-light-gray-3 disabled:opacity-40 transition-colors cursor-pointer"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-14 h-11 flex items-center justify-center text-base font-medium text-dark-gray-2">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-14 h-11 flex items-center justify-center border border-light-gray-2 rounded-md bg-white text-dark-gray-2 hover:bg-light-gray-3 transition-colors cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-dark-gray-3 underline hover:text-dark-gray-2 transition-colors cursor-pointer mt-2"
                        >
                          Remover item
                        </button>
                      </div>

                      {/* ── BLOCO 3: UNITÁRIO (horizontal, centralizado) ── */}
                      <div className="flex items-baseline justify-center gap-3 mb-4 flex-wrap">
                        <span className="text-sm font-medium text-dark-gray-3 uppercase">
                          UNITÁRIO
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-light-gray-2 line-through">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                        <span className="text-base font-bold text-dark-gray-2">
                          {formatPrice(unitPrice)}
                        </span>
                      </div>

                      {/* ── BLOCO 4: TOTAL (horizontal, centralizado) ── */}
                      <div className="flex items-baseline justify-center gap-3 flex-wrap">
                        <span className="text-sm font-medium text-dark-gray-3 uppercase">
                          TOTAL
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-light-gray-2 line-through">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        )}
                        <span className="text-base font-bold text-dark-gray-2">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── BLOCO 5: Cupom de desconto ── */}
            <div className="bg-white rounded-lg p-5">
              <label className="text-sm font-medium text-dark-gray-2 mb-4 block">
                Cupom de desconto
              </label>
              <Input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Insira seu código"
                className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 w-full mb-3"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <Button
                onClick={handleApplyCoupon}
                className="w-full h-12 bg-light-gray-3 border-0 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                OK
              </Button>
              {couponError && (
                <p className="text-xs text-error mt-2">Cupom inválido</p>
              )}
              {couponCode && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-success font-medium">
                    Cupom {couponCode} aplicado!
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-error underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>

            {/* ── BLOCO 6: Calcular frete ── */}
            <div className="bg-white rounded-lg p-5">
              <label className="text-sm font-medium text-dark-gray-2 mb-4 block">
                Calcular frete
              </label>
              <Input
                value={cepInput}
                onChange={(e) => setCepInput(e.target.value)}
                placeholder="Insira seu CEP"
                className="bg-light-gray-3 border-0 h-12 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 w-full mb-3"
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleCalculateShipping()
                }
              />
              <Button
                onClick={handleCalculateShipping}
                className="w-full h-12 bg-light-gray-3 border-0 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                OK
              </Button>
              {cepCalculated && (
                <p className="text-xs text-success mt-2">
                  Frete: {shipping === 0 ? 'Grátis!' : formatPrice(shipping)}
                </p>
              )}
            </div>

            {/* ── BLOCO 7: RESUMO ── */}
            <div className="bg-white rounded-lg px-5 pt-5 pb-6">
              <h2 className="text-base font-bold text-dark-gray-2 uppercase">
                RESUMO
              </h2>
              <div className="h-px bg-light-gray-3 mt-3 mb-5" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-gray-3">Subtotal:</span>
                  <span className="text-dark-gray-2 font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-gray-3">Frete:</span>
                  <span className="text-dark-gray-2 font-medium">
                    {formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-gray-3">Desconto:</span>
                  <span className="text-dark-gray-2 font-medium">
                    {formatPrice(discount)}
                  </span>
                </div>
              </div>

              {/* Total final */}
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-dark-gray-2">
                  Total
                </span>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(total)}
                  </span>
                  <p className="text-xs text-light-gray mt-0.5">
                    ou 10x de R$ {installmentValue} sem juros
                  </p>
                </div>
              </div>
            </div>

            {/* Espaço para a barra fixa não sobrepor conteúdo */}
            <div className="h-36" />
          </div>

          {/* ═══════ DESKTOP: Itens do carrinho ═══════ */}
          <div className="hidden lg:block divide-y divide-light-gray-3">
            {items.map((item) => {
              const unitPrice = item.product.priceDiscount || item.product.price
              const itemTotal = unitPrice * item.quantity
              const hasDiscount =
                item.product.priceDiscount
                && item.product.priceDiscount < item.product.price

              return (
                <div key={item.product.id} className="py-5 first:pt-0">
                  <div className="grid grid-cols-[1fr_140px_120px_120px] gap-4 items-center">
                    {/* Produto info */}
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-secondary/40 rounded-lg shrink-0 flex items-center justify-center overflow-hidden p-1">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-gray-2 leading-snug line-clamp-2">
                          {item.product.name}
                        </p>
                        {item.selectedColor && (
                          <span className="text-xs text-light-gray">
                            Cor: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="text-xs text-light-gray">
                            Tamanho: {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantidade */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-0">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border border-light-gray-2 rounded-l text-dark-gray-2 hover:bg-light-gray-3 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center border-y border-light-gray-2 text-sm font-medium text-dark-gray-2">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-light-gray-2 rounded-r text-dark-gray-2 hover:bg-light-gray-3 transition-colors cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-dark-gray-3 underline hover:text-dark-gray-2 transition-colors cursor-pointer"
                      >
                        Remover item
                      </button>
                    </div>

                    {/* Unitário */}
                    <div className="text-right">
                      {hasDiscount && (
                        <span className="block text-xs text-light-gray-2 line-through">
                          {formatPrice(item.product.price)}
                        </span>
                      )}
                      <span className="text-sm font-bold text-dark-gray-2">
                        {formatPrice(unitPrice)}
                      </span>
                    </div>

                    {/* Total do item */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-dark-gray-2">
                        {formatPrice(itemTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Bloco inferior: Cupom + Frete (Desktop) ── */}
          <div className="hidden lg:block mt-6 pt-6 border-t border-light-gray-3">
            <div className="grid grid-cols-2 gap-6">
              {/* Cupom de desconto */}
              <div>
                <label className="text-xs text-light-gray mb-2 block">
                  Cupom de desconto
                </label>
                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Insira seu código"
                    className="bg-light-gray-3 border-0 h-11 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    className="h-11 px-6 bg-light-gray-3 border-0 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    OK
                  </Button>
                </div>
                {couponError && (
                  <p className="text-xs text-error mt-1">Cupom inválido</p>
                )}
                {couponCode && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-success font-medium">
                      Cupom {couponCode} aplicado!
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-error underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>

              {/* Calcular frete */}
              <div>
                <label className="text-xs text-light-gray mb-2 block">
                  Calcular frete
                </label>
                <div className="flex gap-2">
                  <Input
                    value={cepInput}
                    onChange={(e) => setCepInput(e.target.value)}
                    placeholder="Insira seu CEP"
                    className="bg-light-gray-3 border-0 h-11 rounded-lg text-dark-gray-2 placeholder:text-light-gray-2 flex-1"
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleCalculateShipping()
                    }
                  />
                  <Button
                    onClick={handleCalculateShipping}
                    className="h-11 px-6 bg-light-gray-3 border-0 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    OK
                  </Button>
                </div>
                {cepCalculated && (
                  <p className="text-xs text-success mt-1">
                    Frete: {shipping === 0 ? 'Grátis!' : formatPrice(shipping)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Resumo Mobile antigo removido — agora está dentro do bloco mobile acima ── */}
        </div>

        {/* ── Coluna Direita: Resumo (Desktop) ── */}
        <div className="hidden lg:block lg:w-[35%]">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-dark-gray-2 uppercase mb-6">
              RESUMO
            </h2>
            <SummaryContent />
          </div>
        </div>
      </div>

      {/* ── Barra fixa inferior Mobile — CTA persistente ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white px-5 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-bold text-dark-gray-2">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-primary">
              {formatPrice(total)}
            </span>
            <p className="text-xs text-light-gray">
              ou 10x de R$ {installmentValue} sem juros
            </p>
          </div>
        </div>
        <Button
          onClick={handleContinue}
          disabled={items.length === 0}
          className="w-full h-12 bg-warning hover:bg-warning/90 text-white font-bold text-base rounded-lg transition-colors disabled:opacity-50"
        >
          Continuar
        </Button>
      </div>

      {/* ── Produtos Relacionados (Desktop only) ── */}
      {relatedProducts.length > 0 && (
        <div className="hidden lg:block mt-12">
          <Section
            title="Produtos Relacionados"
            link={{ text: 'Ver todos', href: '/products' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  priceDiscount={product.priceDiscount}
                  category={product.category}
                />
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}
