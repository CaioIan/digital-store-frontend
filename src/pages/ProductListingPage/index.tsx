import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilterGroup } from '@/components/FilterGroup'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/services/productService'
import type { Product } from '@/types/Product'

export default function ProductListingPage() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  // Remove accents from string for better search matching
  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente mais tarde.')
        console.error('Erro ao buscar produtos:', err)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search term
  const filteredProducts = filter
    ? products.filter((product) => {
        const normalizedProductName = removeAccents(product.name.toLowerCase())
        const normalizedFilter = removeAccents(filter.toLowerCase())
        return normalizedProductName.includes(normalizedFilter)
      })
    : products

  const productCount: number = filteredProducts.length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[308px_1fr] gap-8">
        {/* Sidebar de Filtros */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-dark-gray-2 font-bold text-base mb-6">
              Filtrar por
            </h2>
            <div className="border-b border-light-gray-2 mb-6" />

            <FilterGroup
              title="Marca"
              inputType="checkbox"
              options={[
                { label: 'Adiddas', value: 'adiddas' },
                { label: 'Calenciaga', value: 'calenciaga' },
                { label: 'K-Swiss', value: 'k-swiss' },
                { label: 'Nike', value: 'nike' },
                { label: 'Puma', value: 'puma' }
              ]}
            />

            <FilterGroup
              title="Categoria"
              inputType="checkbox"
              options={[
                { label: 'Esporte e lazer', value: 'esporte' },
                { label: 'Casual', value: 'casual' },
                { label: 'Utilitário', value: 'utilitario' },
                { label: 'Corrida', value: 'corrida' }
              ]}
            />

            <FilterGroup
              title="Estado"
              inputType="radio"
              options={[
                { label: 'Novo', value: 'novo' },
                { label: 'Usado', value: 'usado' }
              ]}
            />
          </div>
        </aside>

        {/* Área Principal de Produtos */}
        <main>
          <h1 className="text-dark-gray-2 text-2xl font-bold mb-4">
            {filter ? `Resultados para "${filter}"` : 'Todos os produtos'}
          </h1>
          <p className="text-dark-gray-2 mb-6">
            {productCount}{' '}
            {productCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>

          {/* Grid de Produtos */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <p className="text-lg text-error font-semibold">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-tertiary transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-light-gray">
                Nenhum produto encontrado para "{filter}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-8 gap-y-6">
              {filteredProducts.map((product) => (
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
          )}
        </main>
      </div>
    </div>
  )
}
