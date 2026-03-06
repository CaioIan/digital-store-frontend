import { FilterGroup } from '@/components/FilterGroup'
import { Pagination } from '@/components/Pagination'
import ProductCard from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { getProducts } from '@/services/productService'
import type { Product } from '@/types/Product'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Página de Listagem de Produtos.
 * Implementa filtros dinâmicos de Marca, Categoria e Gênero,
 * além de ordenação por preço e paginação integrada com o TanStack Query.
 */
export default function ProductListingPage() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter') || ''
  const [filterBrand, setFilterBrand] = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState<string[]>([])
  const [filterGender, setFilterGender] = useState<string>('')
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'lowest' | 'highest'>('lowest')
  const [page, setPage] = useState(1)

  // Reseta para a página 1 ao mudar qualquer filtro
  useEffect(() => {
    setPage(1)
  }, [filter, filterBrand, filterCategory, filterGender, sortOrder])

  const {
    data: response,
    isLoading,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      'products',
      page,
      filter,
      filterBrand,
      filterCategory,
      filterGender,
      sortOrder
    ],
    queryFn: async () => {
      // Mock de delay para visualização do Skeleton Loading (opcional)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Objeto de parâmetros dinâmicos para a API
      // biome-ignore lint/suspicious/noExplicitAny: Options can be very dynamic based on backend typing
      const options: any = {
        page: page,
        limit: 12
      }

      // Aplica filtros se existirem
      if (filter) options.match = filter
      if (filterGender) {
        options.gender = filterGender === 'Unissex' ? 'Unisex' : filterGender
      }
      if (filterBrand.length > 0) {
        options.brand = filterBrand.join(',')
      }

      // Chamada real ao Service que comunica com o Backend
      const res = await getProducts(options)

      // Ordenação local (Client-side) como fallback ou complemento
      if (sortOrder === 'lowest') {
        res.data.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
      } else if (sortOrder === 'highest') {
        res.data.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
      }

      return res
    },
    placeholderData: keepPreviousData // Mantém dados antigos enquanto busca novos para evitar flickering
  })

  const products = response?.data || []
  // Total count defined by the backend
  const productCount: number = response?.total ?? products.length

  const brandOptions = [
    { label: 'Nike', value: 'Nike' },
    { label: 'Adidas', value: 'Adidas' },
    { label: 'Puma', value: 'Puma' },
    { label: 'Reebok', value: 'Reebok' },
    { label: 'New Balance', value: 'New Balance' },
    { label: 'Asics', value: 'Asics' },
    { label: 'Mizuno', value: 'Mizuno' },
    { label: 'Fila', value: 'Fila' },
    { label: 'Vans', value: 'Vans' },
    { label: 'Converse', value: 'Converse' }
  ]

  const categoryOptions = Array.from(
    new Set(
      products
        .flatMap((p: Product) => {
          if (p.categories && p.categories.length > 0) {
            return p.categories.map((cat: { name: string }) => cat.name)
          }
          return p.category ? [p.category] : []
        })
        .filter(Boolean)
    )
  ).map((c: unknown) => ({ label: String(c), value: String(c) }))

  const genderOptions = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
    { label: 'Unissex', value: 'Unissex' }
  ]

  const hasActiveFilters =
    filterBrand.length > 0 || filterCategory.length > 0 || filterGender !== ''

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
              <p className="text-lg text-error font-semibold">
                {error instanceof Error
                  ? error.message
                  : 'Erro ao buscar produtos'}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-tertiary transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 min-[426px]:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-x-8 lg:gap-y-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="h-full w-full">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-light-gray">
                Nenhum produto encontrado.
              </p>
            </div>
          ) : (
            <>
              <div className={`min-h-[800px] content-start grid grid-cols-2 min-[426px]:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-x-8 lg:gap-y-6 transition-opacity duration-200 ${isFetching ? 'opacity-50 pointer-events-none' : ''}`}>
                {products.map((product, idx) => (
                  <ProductCard
                    key={`${product.id}-${idx}`}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    priceDiscount={product.priceDiscount}
                    category={product.category}
                  />
                ))}
              </div>

              {!isLoading && (
                <Pagination
                  currentPage={page}
                  limit={12}
                  totalItems={productCount}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
