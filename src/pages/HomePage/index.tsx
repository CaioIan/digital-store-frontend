import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import Section from '@/components/Section'
import { getProducts } from '@/services/productService'
import type { Product } from '@/types/Product'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data.slice(0, 8)) // Primeiros 8 produtos
        setError(null)
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente mais tarde.')
        console.error('Erro ao buscar produtos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-8">
      <Section
        title="Produtos em Alta"
        link={{ text: 'Ver Todos', href: '/produtos' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-light-gray">Carregando produtos...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-error">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-x-8 gap-y-6">
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
      </Section>
    </div>
  )
}
