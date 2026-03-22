/** 
 * Representa uma imagem de produto vinda da API Digital Store. 
 */
export interface ProductImage {
  id: number
  path: string
  enabled: boolean
}

/** 
 * Representa uma opção de personalização do produto (ex: Cor ou Tamanho).
 * 
 * Contém o título da opção, o formato visual (quadrado ou círculo) e
 * a lista de valores disponíveis.
 */
export interface ProductOption {
  id: number
  title: string
  shape: 'square' | 'circle'
  radius: number
  type: 'text' | 'color'
  values: string[]
}

/** Representa uma categoria associada ao produto. */
export interface ProductCategory {
  id: string
  name: string
  slug: string
}

/** 
 * Entidade de Produto (Product) utilizada em toda a interface do Front-end.
 * 
 * Este objeto é o resultado do mapeamento (mapApiProduct) dos dados crus 
 * vindos da API para um formato mais amigável e consistente.
 */
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
