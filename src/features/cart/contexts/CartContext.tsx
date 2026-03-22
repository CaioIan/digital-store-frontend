import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import { api, CONFIG } from '@/core'
import { useAuth } from '@/features/auth'
import type { Product } from '@/features/products'
import { type ApiProduct, mapApiProduct } from '@/features/products'
import type { CartItem } from '../types/CartItem'

interface CartContextType {
  items: CartItem[]
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: string,
    selectedSize?: string
  ) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  itemCount: number
  subtotal: number
  discount: number
  shipping: number
  couponDiscount: number
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  couponCode: string | null
  setShipping: (value: number) => void
  total: number
  fetchCart: () => Promise<void>
}

/**
 * Contexto do Carrinho de Compras.
 * Gerencia a lista de itens, cálculos de totais, cupons e sincronização com a API.
 */
const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartApiResponse {
  cart: {
    items: {
      id: string
      quantity: number
      selected_color?: string
      selected_size?: string
      product: ApiProduct
    }[]
  }
}

/**
 * Provider do Carrinho de Compras.
 * 
 * Gerencia o estado global dos itens no carrinho seguindo o padrão de 
 * "Optimistic Updates" para as operações de adicionar, remover e atualizar 
 * quantidade. Sincroniza automaticamente com o backend (`/cart`) se o 
 * usuário estiver autenticado.
 * 
 * @param {Object} props - Propriedades do componente.
 * @param {ReactNode} props.children - Elementos filhos que terão acesso ao contexto.
 * @returns {JSX.Element} Provider configurado.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [shipping, setShipping] = useState(0)

  // Busca o carrinho da API
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }
    try {
      const { data } = await api.get<CartApiResponse>('/cart')
      if (data?.cart?.items) {
        setItems(
          data.cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            selectedColor: item.selected_color,
            selectedSize: item.selected_size,
            product: mapApiProduct(item.product)
          }))
        )
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error)
      setItems([])
    }
  }, [isAuthenticated])

  // Recarrega o carrinho toda vez que o status de login mudar
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = useCallback(
    /**
     * Adiciona um produto ao carrinho.
     * 
     * Se o usuário não estiver autenticado, redireciona para o login.
     * Realiza um "Optimistic Update" no estado local para feedback imediato e 
     * depois sincroniza com a API.
     * 
     * @param {Product} product - Objeto do produto a ser adicionado.
     * @param {number} [quantity=1] - Quantidade desejada.
     * @param {string} [selectedColor] - Cor selecionada (opcional).
     * @param {string} [selectedSize] - Tamanho selecionado (opcional).
     */
    async (
      product: Product,
      quantity = 1,
      selectedColor?: string,
      selectedSize?: string
    ) => {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }

      // Update Otimista: Adiciona ao estado local antes da resposta da API
      // para que o usuário veja a mudança imediatamente.
      setItems((prev) => {
        // Verifica se esta combinação exata já existe no estado local
        const existingInfo = prev.find(
          (item) =>
            item.product.id === product.id
            && item.selectedColor === selectedColor
            && item.selectedSize === selectedSize
        )
        if (existingInfo) {
          return prev.map((item) =>
            item.id === existingInfo.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        // Usa um ID temporário até que o fetchCart retorne os IDs reais da API
        return [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            product,
            quantity,
            selectedColor,
            selectedSize
          }
        ]
      })

      try {
        await api.post('/cart/add', {
          product_id: parseInt(product.id, 10),
          quantity,
          selected_color: selectedColor,
          selected_size: selectedSize
        })
        // Sincroniza o estado com o banco de dados (recupera os IDs reais gerados pela API)
        await fetchCart()
      } catch (error) {
        console.error('Erro ao adicionar produto:', error)
        // Em caso de erro, re-sincroniza com o banco para reverter o update otimista
        await fetchCart()
      }
    },
    [isAuthenticated, fetchCart, navigate]
  )

  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!isAuthenticated) return

      // Remoção otimista do estado local
      setItems((prev) => prev.filter((item) => item.id !== itemId))

      try {
        await api.delete(`/cart/remove/${itemId}`)
        // fetchCart() não é estritamente necessário após um delete bem-sucedido,
        // mas garante consistência do estado local com o banco de dados.
      } catch (error) {
        console.error('Erro ao remover item:', error)
        await fetchCart() // Reverte alterações locais se a API falhar
      }
    },
    [isAuthenticated, fetchCart]
  )

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!isAuthenticated || quantity < 1) return

      // Atualização otimista da quantidade no estado local
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      )

      try {
        await api.put(`/cart/update/${itemId}`, { quantity })
      } catch (error) {
        console.error('Erro ao atualizar quantidade:', error)
        await fetchCart()
      }
    },
    [isAuthenticated, fetchCart]
  )

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return

    setItems([])
    setCouponCode(null)
    setCouponDiscount(0)
    setShipping(0)

    try {
      await api.delete('/cart/clear')
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
      await fetchCart()
    }
  }, [isAuthenticated, fetchCart])

  const applyCoupon = useCallback((code: string): boolean => {
    const upper = code.toUpperCase().trim()
    if (CONFIG.COUPONS[upper]) {
      setCouponCode(upper)
      setCouponDiscount(CONFIG.COUPONS[upper])
      return true
    }
    return false
  }, [])

  const removeCoupon = useCallback(() => {
    setCouponCode(null)
    setCouponDiscount(0)
  }, [])

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const price = item.product.priceDiscount || item.product.price
        return total + price * item.quantity
      }, 0),
    [items]
  )

  const discount = useMemo(() => {
    // Desconto do cupom é percentual sobre o subtotal (ex: 10% de 200 = 20)
    return couponDiscount > 0 ? (subtotal * couponDiscount) / 100 : 0
  }, [subtotal, couponDiscount])

  const total = useMemo(
    () => subtotal - discount + shipping,
    [subtotal, discount, shipping]
  )

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      discount,
      shipping,
      couponDiscount,
      applyCoupon,
      removeCoupon,
      couponCode,
      setShipping,
      total,
      fetchCart
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      discount,
      shipping,
      couponDiscount,
      applyCoupon,
      removeCoupon,
      couponCode,
      total,
      fetchCart
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}
