import RouterLink from '../../components/RouterLink'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] to-[#ffffff] px-4">
      <div className="text-center max-w-lg">
        {/* Número 404 em destaque */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-[#c92071] to-[#991956] bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Título */}
        <h2 className="text-4xl font-bold text-[#1f1f1f] mb-4">
          Página não encontrada
        </h2>

        {/* Descrição */}
        <p className="text-lg text-[#666666] mb-8 leading-relaxed">
          Desculpe, a página que você está procurando não existe ou foi removida.
          Verifique a URL e tente novamente.
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-[#c92071] to-[#991956] text-white font-semibold rounded-lg hover:shadow-lg hover:from-[#991956] hover:to-[#c92071] transition-all duration-300 transform hover:scale-105"
          >
            Voltar ao Início
          </RouterLink>
          <RouterLink
            to="/"
            className="px-8 py-3 border-2 border-[#c92071] text-[#c92071] font-semibold rounded-lg hover:bg-[#c92071] hover:text-white transition-all duration-300"
          >
            Explorar Produtos
          </RouterLink>
        </div>
      </div>
    </div>
  )
}
