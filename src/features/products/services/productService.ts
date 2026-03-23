import { api } from '@/core'
import type { Product } from '../types/Product'

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
 * Converte um produto bruto da API (ApiProduct) para o formato esperado pelo Frontend (Product).
 * 
 * Centraliza a lógica de tratamento de caminhos de imagem, formatação de descontos
 * e normalização de categorias/opções.
 * 
 * @param {ApiProduct} raw - O objeto do produto retornado pelo endpoint da API.
 * @returns {Product} O objeto do produto mapeado e pronto para uso nos componentes.
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
 * Realiza a busca de produtos na API com suporte a múltiplos filtros e paginação.
 * 
 * @param {GetProductsOptions} [options] - Parâmetros de busca (filtros, paginação, match).
 * @returns {Promise<SearchResponse<Product>>} Promessa com a lista de produtos mapeados e metadados.
 */
export const getProducts = async (
  options?: GetProductsOptions
): Promise<SearchResponse<Product>> => {
  const params: Record<string, string | number | undefined> = {
    limit: options?.limit ?? 12,
    page: options?.page ?? 1,
    match: options?.match,
    brand: options?.brand,
    gender: options?.gender,
    category_ids: options?.category_ids?.join(',')
  }

  // Adiciona filtros de preço se existirem
  if (options?.price_range) {
    params['price_range[min]'] = options.price_range.min
    params['price_range[max]'] = options.price_range.max
  }

  // Adiciona filtros de opções dinâmicas (ex: cor, tamanho)
  // O backend espera no formato: options[Tamanho]=G&options[Cor]=Preto
  if (options?.options) {
    Object.entries(options.options).forEach(([key, values]) => {
      params[`options[${key}]`] = values.join(',')
    })
  }

  const { data } = await api.get<SearchResponse<ApiProduct>>(
    '/product/search',
    { params }
  )

  return {
    ...data,
    data: data.data.map(mapApiProduct)
  }
}

/**
 * Busca um produto específico pelo seu ID ou Slug.
 */
export const getProductById = async (
  id: string
): Promise<Product | null> => {
  try {
    const { data } = await api.get<ApiProduct>(`/product/${id}`)
    return mapApiProduct(data)
  } catch (error) {
    return null
  }
}

/**
 * Busca produtos relacionados a um produto específico.
 * Atualmente simplificado para buscar os primeiros produtos da mesma categoria.
 */
export const getRelatedProducts = async (
  productId: string,
  limit = 4
): Promise<Product[]> => {
  try {
    const { data } = await getProducts({ limit: limit + 1 })
    return data.filter((p) => p.id !== productId).slice(0, limit)
  } catch (error) {
    return []
  }
}
