import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilterGroup } from '@/components/FilterGroup'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/services/productService'
import type { Product } from '@/types/Product'

// Remove accents from string for better search matching
function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function ProductListingPage() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filterBrand, setFilterBrand] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState<string[]>([])
  const [filterGender, setFilterGender] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'lowest' | 'highest'>('lowest')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

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

  // Derive unique brands, categories, genders from products
  const brandOptions = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  ).map((b) => ({ label: String(b), value: String(b) }))
  const categoryOptions = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).map((c) => ({ label: String(c), value: String(c) }))
  const genderOptions = Array.from(
    new Set(products.map((p) => p.gender).filter(Boolean))
  ).map((g) => ({
    label: g === 'male' ? 'Masculino' : g === 'female' ? 'Feminino' : 'Unissex',
    value: String(g)
  }))

  // Filtering and sorting logic
  useEffect(() => {
    let result = [...products]

    // Search param filter
    if (filter) {
      const normalizedFilter = removeAccents(filter.toLowerCase())
      result = result.filter((product) =>
        removeAccents(product.name.toLowerCase()).includes(normalizedFilter)
      )
    }
    if (filterBrand.length > 0) {
      result = result.filter((p) => p.brand && filterBrand.includes(p.brand))
    }
    if (filterCategory.length > 0) {
      result = result.filter(
        (p) => p.category && filterCategory.includes(p.category)
      )
    }
    if (filterGender) {
      result = result.filter((p) => p.gender === filterGender)
    }
    // Sorting
    if (sortOrder === 'lowest') {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    } else if (sortOrder === 'highest') {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    }
    setFilteredProducts(result)
  }, [products, filter, filterBrand, filterCategory, filterGender, sortOrder])

  const productCount: number = filteredProducts.length

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] gap-6 md:gap-8">
        {/* Sidebar de Filtros */}
        <aside className="space-y-4 md:space-y-6">
          <details className="bg-white p-4 md:p-6 rounded-lg md:open" open>
            <summary className="md:hidden text-dark-gray-2 font-bold text-base cursor-pointer list-none flex items-center justify-between">
              Filtrar por
              <span className="text-primary">+</span>
            </summary>
            <h2 className="hidden md:block text-dark-gray-2 font-bold text-base mb-6">
              Filtrar por
            </h2>
            <div className="border-b border-light-gray-2 mb-4 md:mb-6 mt-4 md:mt-0" />

            <label htmlFor="sortOrder" className="block text-dark-gray-2 mb-2">
              Ordenar por
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as 'lowest' | 'highest')
              }
              className="w-full mb-4 h-12 border border-light-gray-2 rounded px-3"
            >
              <option value="lowest">Menor preço</option>
              <option value="highest">Maior preço</option>
            </select>

            <FilterGroup
              title="Marca"
              inputType="checkbox"
              options={brandOptions}
              onChange={(val, checked) => {
                if (checked)
                  setFilterBrand((s) => Array.from(new Set([...s, val])))
                else setFilterBrand((s) => s.filter((i) => i !== val))
              }}
            />

            <FilterGroup
              title="Categoria"
              inputType="checkbox"
              options={categoryOptions}
              onChange={(val, checked) => {
                if (checked)
                  setFilterCategory((s) => Array.from(new Set([...s, val])))
                else setFilterCategory((s) => s.filter((i) => i !== val))
              }}
            />

            <FilterGroup
              title="Gênero"
              inputType="radio"
              options={genderOptions}
              onChange={(val) => setFilterGender(val)}
            />
          </details>
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
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-x-8 lg:gap-y-6">
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
