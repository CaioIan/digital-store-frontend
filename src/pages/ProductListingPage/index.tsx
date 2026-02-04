import { Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilterGroup } from '@/components/FilterGroup'
import ProductCard from '@/components/ProductCard'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
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
  // Estado filter state (visual only, filtering logic can be added later)
  const [filterCondition, setFilterCondition] = useState<string>('new')
  const [sortOrder, setSortOrder] = useState<'lowest' | 'highest'>('lowest')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  // Suppress unused variable warning (used in UI, logic can be extended later)
  void filterCondition

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
  const conditionOptions = [
    { label: 'Novo', value: 'new' },
    { label: 'Usado', value: 'used' }
  ]

  // Check if any filter is active (for visual indicator on button)
  const hasActiveFilters =
    filterBrand.length > 0 || filterCategory.length > 0 || filterGender !== ''

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

  // Render the filter content (reused in both desktop sidebar and mobile sheet)
  const renderFilterContent = () => (
    <>
      <FilterGroup
        title="Marca"
        inputType="checkbox"
        options={brandOptions}
        onChange={(val, checked) => {
          if (checked) setFilterBrand((s) => Array.from(new Set([...s, val])))
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
        inputType="checkbox"
        options={genderOptions}
        onChange={(val) => setFilterGender(val)}
      />

      <FilterGroup
        title="Estado"
        inputType="radio"
        options={conditionOptions}
        onChange={(val) => setFilterCondition(val)}
      />
    </>
  )

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* Mobile/Tablet: Sort and Filter Bar */}
      <div className="lg:hidden flex items-center gap-3 mb-6">
        <div className="flex-1">
          <label htmlFor="sortOrderMobile" className="sr-only">
            Ordenar por
          </label>
          <select
            id="sortOrderMobile"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as 'lowest' | 'highest')
            }
            className="w-full h-11 border border-light-gray-2 rounded px-3 text-dark-gray-2 text-sm bg-white"
          >
            <option value="lowest">Ordenar por: menor preço</option>
            <option value="highest">Ordenar por: maior preço</option>
          </select>
        </div>

        {/* Mobile Filter Button with Sheet */}
        <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={`w-11 h-11 flex items-center justify-center rounded transition-colors ${
                hasActiveFilters ? 'bg-tertiary' : 'bg-primary'
              } text-white`}
              aria-label="Abrir filtros"
            >
              <Filter size={20} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[85%] max-w-90 bg-white p-0 flex flex-col"
            aria-label="Filtros de produtos"
          >
            {/* Header do Sheet - Sticky */}
            <SheetHeader className="p-5 border-b border-light-gray-2 sticky top-0 bg-white z-10">
              <SheetTitle className="text-dark-gray-2 font-bold text-lg text-left">
                Filtrar por
              </SheetTitle>
            </SheetHeader>

            {/* Conteúdo Scrollável dos Filtros */}
            <div className="flex-1 overflow-y-auto p-5">
              {renderFilterContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
        {/* Desktop Sidebar de Filtros - Hidden on Mobile/Tablet */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-lg">
            <h2 className="text-dark-gray-2 font-bold text-base mb-6">
              Filtrar por
            </h2>
            <div className="border-b border-light-gray-2 mb-6" />

            <label
              htmlFor="sortOrderDesktop"
              className="block text-dark-gray-2 mb-2"
            >
              Ordenar por
            </label>
            <select
              id="sortOrderDesktop"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as 'lowest' | 'highest')
              }
              className="w-full mb-6 h-12 border border-light-gray-2 rounded px-3"
            >
              <option value="lowest">Menor preço</option>
              <option value="highest">Maior preço</option>
            </select>

            {renderFilterContent()}
          </div>
        </aside>

        {/* Área Principal de Produtos */}
        <main>
          <h1 className="text-dark-gray-2 text-lg md:text-2xl font-bold mb-2 md:mb-4">
            {filter ? `Resultados para "${filter}"` : 'Todos os produtos'}
          </h1>
          <p className="text-dark-gray-2 text-sm md:text-base mb-4 md:mb-6">
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
            <div className="grid grid-cols-2 min-[426px]:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-x-8 lg:gap-y-6">
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
