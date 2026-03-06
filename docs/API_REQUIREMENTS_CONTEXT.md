# Requisitos de Atualização da API Geral - Digital Store Backend (Geração Tech 3.0)

Este documento foi gerado pelo Front-end para alinhar a API com as necessidades reais e completas das telas desenhadas no Figma e refatoradas no painel do usuário. Para a equipe de Backend e a IA do Backend: **leia e implemente** estas melhorias para que o React funcione perfeitamente.

---

## 1. Módulo de Produtos (`/products`)

### 1.1 Filtros Dinâmicos Faltantes (Problema de alinhamento)
Atualmente na página `/products` (Product Listing Page), o Front-end envia parâmetros de filtros pela URL/Query que a API ainda não suporta ou contém dados falsos estruturais:
- **`match` (Busca Textual):** A busca por texto na nav bar envia o query param `match=texto`. A API precisa pesquisar pelo nome ou descrição ignorando Case e acentuações.
- **Marca (Brand):** Atualmente, marcas como **Nike, Adidas, Puma** e **K-Swiss** estão sendo mapeadas pelo front-end para o `options` do banco. No entanto, se o banco *só tem* produtos da Nike e alguém clica no Front em "Puma", a API retorna tudo da Nike. **Requisito:** A API precisa popular o banco com opções reais para essas marcas, e o `product/search` precisa aplicar um `WHERE marca = 'Puma'`.
- **Gênero (Gender):** O front-end tem checkboxes estritas para **Masculino, Feminino** e **Unisex**. **Requisito:** A API precisa inserir um campo nas opções do produto ou atributo raiz de `gender` nos produtos.

### 1.2 Paginação na Home e Produtos Relacionados
- **Home:** Na `HomePage`, nós buscamos apenas os produtos principais com limite estrito. Enviamos um query param `?limit=8`. **Requisito:** O endpoint `GET /product/search` precisa respeitar corretamente o parâmetro estrutural `limit` e `page` para não retornar 50 megabytes vazios ao cliente.
- **Relacionados:** Na `ProductViewPage`, nós renderizamos 4 produtos similares. O ideal é o backend disponibilizar uma query `?category_ids=X` e nós limitarmos a 4 produtos no fetch para o cross-selling perfeito. A paginação do response deve ser consistente com `SearchResponse { data: [], total, page, limit }`.

---

## 2. Módulo de Pedidos (`/orders`)

### 2.1 Paginação
- Na página `Meus Pedidos` (`MyOrdersPage`), o front-end está consultando seus arrays brutos de faturamento no endpoint `GET /orders`. Se um cliente fizer 5.000 pedidos (historicamente), a UI vai colapsar. **Requisito:** Implementar parâmetros genéricos de `limit` e `page` (ex: `?limit=10&page=1`) na rota `GET /orders` se não existir, e retornar o meta `SearchResponse` similar aos produtos.

### 2.2 Status do Pedido Corrigido
As fatias estritas de UI mostram um layout visual muito específico para "Produto em trânsito" com marcação e cor **warning**. O front-end agora converte *tudo* para "Produto em trânsito", independentemente se backend envia `completed` ou `cancelled`.
**Requisito:** Entender que na regra de negócio atual, o cliente deseja que na listagem visual, todos os pedidos apareçam como "Produto em trânsito" momentaneamente. Não enviar erros restritivos de validação pela rota.

---

## Conclusão
- **Adicionar campos essenciais**: Gênero aos atributos reais dos sneakers.
- **Seeders**: Seeders de dados que não sejam todos "Nike". Inclua Puma, Adidas, etc, para ver os checkbox do Front funcionando.
- **Performance**: Homogeneizar todo recurso paginado com `limit` e `page`.
