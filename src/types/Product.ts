export interface ProductImage {
  id: number
  path: string
  enabled: boolean
}

export interface ProductOption {
  id: number
  title: string
  shape: 'square' | 'circle'
  radius: number
  type: 'text' | 'color'
  values: string[]
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  slug?: string
  image: string
  price: number
  priceDiscount?: number
  description?: string
  category?: string
  brand?: string
  gender?: string
  reference?: string
  stars?: number
  rating?: number
  images?: ProductImage[]
  options?: ProductOption[]
  categories?: ProductCategory[]
}
