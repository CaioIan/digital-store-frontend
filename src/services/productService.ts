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

export interface SearchResponse<T = ApiProduct> {
  data: T[]
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
  const mappedOptions = raw.options || []

  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.slug,
    image: enabledImages[0]?.path || '/tenis-test.webp',
    price: raw.price,
    priceDiscount: raw.price_with_discount || undefined,
    description: raw.description || undefined,
    category: raw.categories?.[0]?.name || undefined,
    images: enabledImages,
    options: mappedOptions,
    categories: raw.categories || []
  }
}

export interface GetProductsOptions {
  limit?: number
  page?: number
  match?: string
  brand?: string
  gender?: string
  category_ids?: string[]
  price_range?: {
    min: number
    max: number
  }
  options?: {
    [key: string]: string[]
  }
}

/**
 * Busca todos os produtos da API com suporte a filtros reais.
 * 
 * @param options - Critérios de busca (página, limite, marca, gênero, etc.)
 * @returns Resposta paginada contendo os produtos mapeados para o formato do Frontend.
 */
export const getProducts = async (
  options?: GetProductsOptions
): Promise<SearchResponse<Product>> => {
  const { data } = await api.get<SearchResponse<ApiProduct>>(
    '/product/search',
    {
      params: {
        limit: options?.limit ?? 12,
        page: options?.page ?? 1,
        match: options?.match,
        brand: options?.brand,
        gender: options?.gender,
        category_ids: options?.category_ids?.join(','),
        'price_range[min]': options?.price_range?.min,
        'price_range[max]': options?.price_range?.max
      }
    }
  )
  return {
    ...data,
    data: data.data.map(mapApiProduct)
  }
}

/**
 * Busca um produto específico pelo seu ID numérico/UUID.
 * 
 * @param id - Identificador único do produto.
 * @returns O produto mapeado ou undefined caso não seja encontrado.
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
