import { api } from '@/lib/api'
import { mapApiProduct, type ApiProduct } from '@/services/productService'
import type { CartItem } from '@/types/CartItem'
import type { Product } from '@/types/Product'
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from 'react'
import { useAuth } from './AuthContext'

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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Cupons válidos simulados
const VALID_COUPONS: Record<string, number> = {
  DESCONTO10: 10,
  PROMO20: 20,
  OFF30: 30
}

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

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
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
    async (
      product: Product,
      quantity = 1,
      selectedColor?: string,
      selectedSize?: string
    ) => {
      if (!isAuthenticated) {
        alert('Você precisa estar logado para adicionar itens ao carrinho.')
        return
      }

      // Optimistic update
      setItems((prev) => {
        // Find if this exact combination already exists locally
        const existingInfo = prev.find(
          (item) =>
            item.product.id === product.id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        )
        if (existingInfo) {
          return prev.map((item) =>
            item.id === existingInfo.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        // Use a temporary fake ID until fetch returns
        return [
          ...prev,
          {
            id: 'temp-' + Date.now().toString(),
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
        // Sincroniza o estado real do banco (recupera os UUIDs gerados)
        await fetchCart()
      } catch (error) {
        console.error('Erro ao adicionar produto:', error)
        // Se errar, tenta recuperar do banco para limpar o state otimista
        await fetchCart()
      }
    },
    [isAuthenticated, fetchCart]
  )

  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!isAuthenticated) return

      // Optimistic delete
      setItems((prev) => prev.filter((item) => item.id !== itemId))

      try {
        await api.delete(`/cart/remove/${itemId}`)
        // fetchCart() is not strictly needed after a successful delete if optimism is flawless,
        // but it's safer to ensure state consistency with database.
      } catch (error) {
        console.error('Erro ao remover item:', error)
        await fetchCart() // revert local changes if API fails
      }
    },
    [isAuthenticated, fetchCart]
  )

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!isAuthenticated || quantity < 1) return

      // Optimistic update
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
    if (VALID_COUPONS[upper]) {
      setCouponCode(upper)
      setCouponDiscount(VALID_COUPONS[upper])
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
    // Desconto do cupom é percentual sobre o subtotal
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
      total
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
      total
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
