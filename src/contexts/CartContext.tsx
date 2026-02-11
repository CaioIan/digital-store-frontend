import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import type { CartItem } from '@/types/CartItem'
import type { Product } from '@/types/Product'

const CART_STORAGE_KEY = 'digital-store-cart'

interface CartContextType {
  items: CartItem[]
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: string,
    selectedSize?: string
  ) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? (JSON.parse(stored) as CartItem[]) : []
    } catch {
      return []
    }
  })
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [shipping, setShipping] = useState(0)

  // Sincroniza items com localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Silently fail if localStorage is full or unavailable
    }
  }, [items])

  const addToCart = useCallback(
    (
      product: Product,
      quantity = 1,
      selectedColor?: string,
      selectedSize?: string
    ) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product.id === product.id
        )
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
            selectedColor:
              selectedColor ?? updated[existingIndex].selectedColor,
            selectedSize: selectedSize ?? updated[existingIndex].selectedSize
          }
          return updated
        }
        return [...prev, { product, quantity, selectedColor, selectedSize }]
      })
    },
    []
  )

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCouponCode(null)
    setCouponDiscount(0)
    setShipping(0)
  }, [])

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
