import { api } from '@/lib/api'
import type { Product } from '@/types/Product'

// Interface interna/exportada para tipar a resposta crua da API
export interface ApiProduct {
  id: number
  name: string
  slug: string
  price: number
  price_with_discount: number
  description: string | null
  enabled: boolean
  stock: number
  use_in_menu: boolean
  images: { id: number; path: string; enabled: boolean }[]
  options: {
    id: number
    title: string
    shape: 'square' | 'circle'
    radius: number
    type: 'text' | 'color'
    values: string[]
  }[]
  categories: { id: string; name: string; slug: string }[]
}

interface SearchResponse {
  data: ApiProduct[]
  total: number
  limit: number
  page: number
}

/**
 * Converte um produto da API para o formato que o Frontend já espera.
 * Toda a lógica de mapeamento de campos fica centralizada aqui.
 */
export function mapApiProduct(raw: ApiProduct): Product {
  const enabledImages = raw.images?.filter((img) => img.enabled) || []

  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.slug,
    image: enabledImages[0]?.path || '/placeholder.png',
    price: raw.price,
    priceDiscount: raw.price_with_discount || undefined,
    description: raw.description || undefined,
    category: raw.categories?.[0]?.name || undefined,
    images: enabledImages,
    options: raw.options || [],
    categories: raw.categories || []
  }
}

/**
 * Busca todos os produtos da API.
 * Usa limit=-1 para trazer todos de uma vez (sem paginação).
 */
export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<SearchResponse>('/product/search', {
    params: { limit: -1 }
  })
  return data.data.map(mapApiProduct)
}

/**
 * Busca um produto específico pelo seu ID numérico.
 */
export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  try {
    const { data } = await api.get<ApiProduct>(`/product/${id}`)
    return mapApiProduct(data)
  } catch {
    return undefined
  }
}
