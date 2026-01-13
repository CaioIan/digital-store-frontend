import { useSearchParams } from 'react-router-dom'
import { FilterGroup } from '@/components/FilterGroup'

export default function ProductListingPage() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter') || ''

  // TODO: Replace with actual product count from backend/API
  const productCount = 0

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
          <p className="text-dark-gray-2">
            {productCount}{' '}
            {productCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </main>
      </div>
    </div>
  )
}
