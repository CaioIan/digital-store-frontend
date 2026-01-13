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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const productCount: number = products.length

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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-light-gray">Carregando produtos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(3,minmax(280px,1fr))] gap-x-8 gap-y-6">
              {products.map((product) => (
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
