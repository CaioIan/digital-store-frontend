import RouterLink from '@/components/RouterLink'
import Section from '@/components/Section'
import { categoriesData } from '@/data/categories'

/**
 * Página de Categorias.
 * Exibe todas as categorias da loja em um grid visual com ícones SVG.
 * Cada card redireciona para a ProductListingPage filtrada pela categoria.
 */
export default function CategoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-light-gray">
          <li>
            <RouterLink
              to="/"
              className="hover:text-primary transition-colors"
            >
              Home
            </RouterLink>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-dark-gray-2 font-medium">Categorias</li>
        </ol>
      </nav>

      {/* Título da Página */}
      <Section title="Todas as Categorias" titleAlign="center">
        <p className="text-center text-dark-gray-2 mb-8 max-w-2xl mx-auto">
          Explore nossas categorias e encontre os melhores produtos para você.
        </p>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
          {categoriesData.map((category) => (
            <RouterLink
              key={category.slug}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center gap-4 group cursor-pointer py-6 px-4 rounded-xl transition-all duration-300 hover:bg-light-gray-3 hover:shadow-md"
            >
              {/* Ícone em Círculo */}
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-light-gray-3 flex items-center justify-center border-2 border-transparent group-hover:border-primary transition-all overflow-hidden duration-300 group-hover:shadow-lg">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-full h-full object-contain p-5 mix-blend-multiply group-hover:scale-110 transition-all duration-300"
                />
              </div>

              {/* Nome da Categoria */}
              <span className="text-dark-gray-2 text-base font-semibold group-hover:text-primary transition-colors duration-300">
                {category.name}
              </span>
            </RouterLink>
          ))}
        </div>
      </Section>
    </div>
  )
}
