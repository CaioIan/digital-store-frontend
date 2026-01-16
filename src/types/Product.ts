export interface Product {
  id: string // Necessário para rotas (Seção 7)
  name: string // Seção 7.4
  image: string // Seção 7.4
  price: number // Seção 7.4
  priceDiscount?: number // Seção 7.4 (Opcional)
  description?: string // Seção 7.3
  category?: string // Necessário para filtros da Seção 6.2
  brand?: string // Marca do produto (filtro)
  gender?: string // Gênero do produto (filtro)
  reference?: string // Seção 7.3 - Código de referência
  stars?: number // Seção 7.3 - Avaliação (0-5)
  rating?: number // Seção 7.3 - Total de avaliações
}
