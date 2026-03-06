# Digital Store - Projeto Final Geração Tech 3.0

<div align="center">
  <img src="public/logo.svg" alt="Digital Store Logo" height="60" />
</div>

<br />

> [!IMPORTANT]
> **ENTREGA FINAL:** Este repositório contém o Front-end do projeto **Digital Store**, desenvolvido como **Trabalho de Conclusão de Curso (TCC)** para o programa **Geração Tech 3.0**. 

Este projeto é um E-commerce completo para calçados e artigos esportivos, focado em alta performance, UX moderna e arquitetura escalável. 

**Nota sobre o Ecossistema:** Este projeto consome uma **API robusta** (Back-end) desenvolvida especificamente para suportar todas as regras de negócio aqui apresentadas, incluindo persistência de usuários, gestão de pedidos e filtros dinâmicos de produtos. 

---
## 🚀 Funcionalidades Premium Implementadas

Fugindo do básico, esta aplicação implementou soluções reais e robustas (Nível Pleno), transcendendo as expectativas iniciais do projeto:

- **Otimização de Performance (WebP):** Todos os assets estáticos (tênis, coleções e banners) foram convertidos para o formato **WebP**. Isso garante um carregamento até 30% mais rápido e uma melhor pontuação nos Core Web Vitals do Google.
- **Filtros e Buscas Dinâmicas:** A [Página de Listagem de Produtos (`/products`)](/src/pages/ProductListingPage/index.tsx) integra os Filtros de Categoria, Marca e Preço **diretamente com a API**, utilizando React Query para cache em tempo real. Ordem e navegação totalmente funcionais sem fakes.
- **Segurança (Auth & HTTP-Only):** A autenticação não usa `localStorage` para tokens vulneráveis a XSS. Implementado o serviço com *HTTP-Only Cookies*, interceptors completos (`Axios`) e tratamento maduro de refresh hooks.
- **Gestão de Perfil Real:** O usuário não apenas edita dados; ele gerencia Endereços dinâmicos (`/v1/user/address`), e todas as transações (Pedidos) foram formatadas para refletir status em tempo real do banco de dados na página de "Meus Pedidos".
- **Design Fidelizado (Pixel-Perfect):** Utilizado o Design System e Layouts do Figma rigidamente implementados via TailwindCSS (Skeletons fluidos, Modals Shadcn, e componentes de Sonner Toast com respostas de erro/sucesso em UX).
- **Sem Erros de Build:** O projeto foi submetido às rigorosas regras do [BiomeJS](https://biomejs.dev/) e ao compilador estrito do TypeScript (`tsc --noEmit`), garantindo **Zero Warnings** e **Zero Errors**.

## 💻 Tech Stack Principal

- **Framework:** [React 18](https://react.dev/) otimizado via Vite.
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Tipagem estrita habilitada).
- **State & Fetching:** [TanStack Query (React Query v5)](https://tanstack.com/query) suportando paginações infinitas e invalidadores.
- **Estilização:** [Tailwind CSS v3](https://tailwindcss.com/) com classes utilitárias semânticas.
- **Componentes Base UI:** [Shadcn UI](https://ui.shadcn.com/) (Buttons, Skeletons, Sonner Toasts, Dialogs, Sheets, Carousels).
- **Roteamento:** [React Router DOM v6](https://reactrouter.com/) (Data APIs e Auth Wrappers).
- **Validação de Forms:** [React Hook Form](https://react-hook-form.com/) turbinado pelo Validador de esquemas [Zod](https://zod.dev/).
- **Ações de Rede:** [Axios](https://axios-http.com/) equipado com interceptors automáticos de requisição global.

---

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos
- Node.js (Recomendado v20 LTS)
- NPM ou Yarn instalados.
- Um servidor Backend da Digital Store (API) rodando em background (Configure na variável de ambiente).

### Passo a passo

1. **Clone o repositório:**
```bash
git clone https://github.com/SeuUsuario/digital-store-frontend.git
cd digital-store-frontend
```

2. **Instale as dependências limpas:**
```bash
npm install
```

3. **Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz, baseando-se no `.env.example`, e defina o endpoint do Backend:
```env
VITE_API_URL=http://localhost:3000
```

4. **Inicie o Servidor de Desenvolvimento:**
```bash
npm run dev
```

Acesse no seu navegador: `http://localhost:5173`

---

## 🛠 Comandos Úteis (Dev Experience)

A experiência do desenvolvedor está polida através do ecossistema BiomeJS no pacote `package.json`:

- `npm run dev`: Sobe a interface de desenvolvimento ultra-rápido do Vite.
- `npm run check`: Inicia o check total. Valida todos os subgrupos do TypeScript e Linter (Passo obrigatório antes do deploy).
- `npm run format`: Formata recursivamente todos os documentos (`.ts, .tsx, .css`) do repositório garantindo padronização e indentação.
- `npm run build`: O Vite compila a aplicação com as chaves transpiladoras otimizadas (`dist/`). Pronto para o Vercel/Netlify.

---

## 🎨 Estrutura de Diretórios (Feature-Sliced Design Parcial)

A arquitetura das pastas obedece a um padrão escalável limpo:
```
/src
 ├── /assets           # Imagens Globais
 ├── /components      # Componentes compartilhados isolados, ui/, e botões globais
 ├── /contexts        # Provedores de estado global (AuthContext e CartContext)
 ├── /hooks           # Custom React Hooks
 ├── /lib             # Bibliotecas estáticas (config do axios com auth nativa, ts utilities)
 ├── /pages           # View/Telas principais controladas pelo react-router-dom
 ├── /routers         # Configuração das Árvores públicas e rotas restritas `<PrivateRoute />`
 ├── /services        # Abstração de chamadas HTTP reais e Mappers (Product/User/Order)
 ├── /types           # Definições globais Typescript de Entidades e Interfaces
 └── /global.css      # Sistema de Tailwind directives baseadas nas variáveis de UI Figma do E-commerce
```

## 🤝 Contexto para a API

Este front-end possui um contrato implícito altamente customizado com o Backend. Os detalhes restritos de atributos que o backend precisará implementar para suportar os filtros da tela final estão documentados internamente em:
📂 `docs/API_REQUIREMENTS_CONTEXT.md`

## 🏆 Avaliação

Este ecossistema front-end visa gabaritar o módulo e ser um modelo exemplar de escalabilidade de repositório de produto E-commerce para novos desenvolvedores, garantindo a solidez ideal do projeto acadêmico final **Geração Tech 3.0**.
