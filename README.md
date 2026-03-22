# 🛒 Digital Store — Projeto Front-end 

<div align="center">
  <img src="src/assets/images/logo-header.svg" alt="Digital Store Logo" height="50" />
  <br /><br />

  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
  ![Biome](https://img.shields.io/badge/Biome-2.3-60A5FA?logo=biome&logoColor=white)
  ![License](https://img.shields.io/badge/Licença-MIT-green)
</div>

<br />

> [!IMPORTANT]
> **Projeto Final — Geração Tech 3.0**
> Este repositório contém o **Front-end** da plataforma **Digital Store**, desenvolvido como **Trabalho Final do Curso** do **Geração Tech 3.0**. Trata-se de um E-commerce para vestuário e acessórios.

---

## 📦 O Ecossistema Digital Store

O projeto **Digital Store** é composto por **3 repositórios independentes** que juntos formam um ecossistema completo de E-commerce:

| Repositório | Descrição | Responsável por |
|---|---|---|
| **🖥️ digital-store-frontend** (este repo) | Interface do consumidor final | Navegação de produtos, carrinho, checkout, gestão de pedidos e perfil do usuário |
| **🔧 digital-store-api** [https://github.com/CaioIan/digital-store-api] | API RESTful | Autenticação, CRUD de produtos, gestão de pedidos, controle de estoque, processamento de pagamentos e lógica de negócio |
| **📊 digital-store-admin** [https://github.com/CaioIan/digital-store-admin] | Painel administrativo | Cadastro/edição de produtos, gestão de categorias/marcas, visualização de pedidos e métricas do negócio |

### Como os projetos se conectam

```
┌──────────────────────┐         ┌──────────────────┐         ┌──────────────────────┐
│   Front-end Cliente  │◄───────►│    API (Back-end) │◄───────►│   Front-end Admin    │
│   (Este repositório) │  HTTP   │   Express / REST  │  HTTP   │  (Painel do Gestor)  │
│                      │ Cookies │                   │         │                      │
│  • Catálogo          │         │  • Auth JWT       │         │  • CRUD de Produtos  │
│  • Carrinho          │         │  • Rotas REST     │         │  • Gestão de Pedidos │
│  • Checkout          │         │  • Banco de Dados │         │  • Categorias/Marcas │
│  • Meus Pedidos      │         │  • Upload Imagens │         │  • Dashboard         │
│  • Perfil do Usuário │         │  • Validações     │         │                      │
└──────────────────────┘         └──────────────────┘         └──────────────────────┘
```

> O **Front-end do Cliente** consome a mesma API que o **Painel Admin**, porém com permissões e endpoints diferentes. A autenticação é feita via **HTTP-Only Cookies**, garantindo segurança contra ataques XSS.

---

## 🚀 Funcionalidades Implementadas

### 🏠 Página Inicial (Home)
- **Hero Carousel** com banners promocionais e autoplay (configurável)
- Seções de **coleções em destaque** e **produtos recomendados** com imagens otimizadas
- Categorias com ícones SVG customizados e transições suaves
- Layout responsivo adaptado para dispositivos móveis e desktop
- Galeria de imagens com zoom interativo no desktop

### 🔍 Catálogo de Produtos
- **Listagem com paginação** integrada à API
- **Filtros dinâmicos** por categoria, marca, gênero e faixa de preço — todos consumidos da API em tempo real
- **Ordenação** por preço, nome e data
- **Busca textual** com integração à API
- **Página de detalhe do produto** com zoom de imagem (desktop), galeria de fotos e seleção de tamanho/cor

### 🛒 Carrinho de Compras
- Gerenciamento via **Context API** com persistência
- Adição/remoção de itens com feedback visual (Sonner Toasts)
- Cálculo de subtotal, frete e total em tempo real
- Resumo detalhado do pedido

### 💳 Checkout & Pedidos
- Fluxo de checkout com **seleção de endereço** e **método de pagamento** (somente para demonstração)
- Tela de **confirmação de pedido** (Order Success)
- **Meus Pedidos** — listagem com status em tempo real do banco de dados
- **Detalhe do Pedido** — visualização completa com itens, valores e tracking

### 👤 Autenticação & Perfil
- Login e cadastro com validação completa via **Zod + React Hook Form**
- Autenticação segura com **HTTP-Only Cookies** (sem tokens em localStorage)
- Fluxo de **Verificação de E-mail** para novos usuários
- **Interceptors Axios** automáticos para refresh de sessão e tratamento de erros
- **Rotas protegidas** (`<ProtectedRoute />`) para áreas restritas
- Edição de perfil, gestão de endereços e métodos de pagamento

### 🎨 UI/UX
- **Skeleton loaders** fluidos durante carregamento
- **Toast notifications** (Sonner) para feedback de ações
- **Modais e Sheets** via Radix UI / Shadcn
- Assets otimizados em formato **WebP** para performance
- Tipografia **Inter** (Google Fonts) com pesos variados
- Micro-animações e transições suaves

---

## 💻 Tech Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| **Framework** | React | 19 |
| **Linguagem** | TypeScript | 5.9 |
| **Build Tool** | Vite | 7 |
| **Estilização** | Tailwind CSS | 4 |
| **Componentes UI** | Shadcn UI + Radix UI | — |
| **State & Fetching** | TanStack Query (React Query) | 5 |
| **Roteamento** | React Router DOM | 7 |
| **Forms** | React Hook Form + Zod | 7 / 4 |
| **HTTP Client** | Axios | 1.13 |
| **Carousel** | Embla Carousel | 8 |
| **Notificações** | Sonner | 2 |
| **Linter & Formatter** | BiomeJS | 2.3 |

---

## 🗂️ Arquitetura do Projeto (Feature-Based)

O projeto segue uma **arquitetura baseada em features** (domínios), separando responsabilidades por módulo de negócio:

```
src/
├── assets/                    # Imagens e SVGs globais
│   └── images/                # Logos, ícones de categoria
│
├── core/                      # Infraestrutura central da aplicação
│   ├── api/                   # Instância do Axios com interceptors
│   └── config/                # Configurações globais
│
├── features/                  # 🎯 Módulos de domínio (Feature-Based)
│   ├── auth/                  # Autenticação (Login, Cadastro, ProtectedRoute)
│   │   ├── api/               #   Chamadas HTTP de auth
│   │   ├── components/        #   Formulários de login/cadastro
│   │   ├── contexts/          #   AuthContext (estado global de sessão)
│   │   ├── pages/             #   LoginPage, RegisterPage, RegisterFormPage
│   │   ├── queries/           #   React Query hooks de auth
│   │   ├── types/             #   Tipagens de User, Credentials, etc.
│   │   └── utils/             #   Utilitários de auth
│   │
│   ├── cart/                  # Carrinho de compras
│   │   ├── components/        #   CartItem, CouponSection, CartSummary
│   │   ├── contexts/          #   CartContext (estado global do carrinho)
│   │   ├── pages/             #   CartPage
│   │   └── types/             #   Tipagens de CartItem, Coupon
│   │
│   ├── checkout/              # Fluxo de checkout
│   │   ├── components/        #   Formulários de endereço e pagamento
│   │   ├── pages/             #   CheckoutPage
│   │   └── utils/             #   Formatadores de preço, cálculos
│   │
│   ├── orders/                # Pedidos do usuário
│   │   ├── pages/             #   MyOrdersPage, OrderDetailPage, OrderSuccessPage
│   │   ├── types/             #   Tipagens de Order, OrderItem
│   │   └── utils/             #   Formatadores de status e data
│   │
│   ├── products/              # Catálogo de produtos
│   │   ├── components/        #   ProductCard, Filters, ProductGallery
│   │   ├── data/              #   Dados estáticos (categorias, etc.)
│   │   ├── pages/             #   ProductListingPage, ProductViewPage, CategoryPage
│   │   ├── services/          #   Serviços HTTP de produtos
│   │   └── types/             #   Tipagens de Product, Category, Brand
│   │
│   └── user/                  # Perfil do usuário
│       ├── components/        #   Formulários de perfil e endereço
│       └── pages/             #   MyProfilePage, MyInfoPage, MyPaymentMethodsPage
│
├── pages/                     # Páginas globais (não pertencem a uma feature)
│   ├── HomePage/              #   Página inicial
│   ├── Layout.tsx             #   Layout principal (Header + main + Footer)
│   └── NotFoundPage/          #   Página 404
│
├── routes/                    # Configuração de rotas
│   └── MainRouter/            #   Router principal com rotas públicas e protegidas
│
├── shared/                    # Componentes e utilitários compartilhados
│   ├── components/            #   Header, Footer, Gallery, HeroSlide, Logo, etc.
│   │   └── ui/                #   Componentes base Shadcn (Button, Dialog, Skeleton...)
│   ├── hooks/                 #   Custom hooks reutilizáveis
│   └── utils/                 #   Funções utilitárias globais
│
├── App.tsx                    # Componente raiz (Providers + Router)
└── main.tsx                   # Entry point da aplicação
```

---

## 🗺️ Mapa de Rotas

### Rotas Públicas
| Rota | Página | Descrição |
|---|---|---|
| `/` | `HomePage` | Página inicial com banners e produtos em destaque |
| `/categorias` | `CategoryPage` | Navegação por categorias |
| `/products` | `ProductListingPage` | Listagem com filtros e busca |
| `/product/:id` | `ProductViewPage` | Detalhe do produto |
| `/carrinho` | `CartPage` | Carrinho de compras |
| `/login` | `LoginPage` | Tela de login |
| `/cadastro` | `RegisterPage` | Tela de cadastro (escolha) |
| `/register-form-page` | `RegisterFormPage` | Formulário de cadastro |

### Rotas Protegidas (requerem autenticação)
| Rota | Página | Descrição |
|---|---|---|
| `/checkout` | `CheckoutPage` | Finalização da compra |
| `/checkout/:id` | `CheckoutPage` | Checkout de produto específico |
| `/order/:id/success` | `OrderSuccessPage` | Confirmação de pedido |
| `/meus-pedidos` | `MyOrdersPage` | Listagem dos pedidos do usuário |
| `/meus-pedidos/:id` | `OrderDetailPage` | Detalhe de um pedido |
| `/minhas-informacoes` | `MyInfoPage` | Edição de informações pessoais |
| `/metodos-pagamento` | `MyPaymentMethodsPage` | Gestão de métodos de pagamento |
| `/perfil` | `MyProfilePage` | Perfil do usuário |

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- **Node.js** v20+ (LTS recomendado)
- **npm** instalado
- **API do Digital Store** rodando em background (veja a seção do ecossistema acima)

### Passo a Passo

> **IMPORTANTE PROJETO ADMIN:** Para que os produtos apareçam no projeto será necessário cadastrar produtos com o projeto admin em: [https://github.com/CaioIan/digital-store-admin](https://github.com/CaioIan/digital-store-admin) mas antes terá que rodar a API do Digital Store em background como citado abaixo.

> **IMPORTANTE PROJETO API:** Para que o front-end e o painel admin funcionem corretamente, será necessário rodar a API do Digital Store em background. Para mais informações, acesse a documentação da API em [https://github.com/CaioIan/digital-store-api](https://github.com/CaioIan/digital-store-api).

> **IMPORTANTE COMO CRIAR UMA CONTA ADMIN:** Por padrão, TODOS os usuários são criados com a role USER, para criar uma conta admin será necessário cadastrar um usuário normalmente e em seguida alterar sua role para ADMIN diretamente no banco de dados. Para mais informações, acesse a documentação da API em [https://github.com/CaioIan/digital-store-api](https://github.com/CaioIan/digital-store-api).

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/CaioIan/digital-store-frontend.git
   cd digital-store-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run build` | Compila o projeto para produção (TypeScript + Vite) |
| `npm run preview` | Pré-visualiza o build de produção localmente |
| `npm run lint` | Executa o linter do BiomeJS |
| `npm run format` | Formata todos os arquivos com BiomeJS |
| `npm run check` | Executa lint + format + validação completa (recomendado antes do deploy) |

---

## ✅ Qualidade de Código

- **Zero warnings e zero errors** de build (`tsc --noEmit`)
- Linting e formatação rigorosos com **BiomeJS** (regras customizadas em `biome.json`)
- `noExplicitAny: error` — proibido uso de `any` no TypeScript
- `noUnusedVariables: error` e `noUnusedImports: error` — código limpo garantido
- Organização automática de imports em cada salvamento
- Arquitetura **Feature-Based** para escalabilidade e manutenibilidade
- Documentação técnica completa via **JSDoc** em todos os módulos principais

---

## 🔐 Segurança

- Tokens de autenticação armazenados em **HTTP-Only Cookies** (protegidos contra XSS)
- **Interceptors Axios** globais para renovação automática de sessão
- Rotas sensíveis protegidas pelo componente `<ProtectedRoute />`
- Validação de inputs no client-side com **Zod** e no server-side pela API

---

## 🏆 Sobre o Geração Tech 3.0

O **Geração Tech** é um programa de capacitação em tecnologia. Este projeto representa o **TF (Trabalho Final)** da turma 3.0, demonstrando na prática todos os conceitos aprendidos ao longo do curso, desde fundamentos de HTML/CSS/JS até arquitetura de aplicações modernas com React e TypeScript.

O ecossistema completo (Front-end Cliente + API + Painel Admin) foi desenvolvido para simular um cenário real de produto de E-commerce, com foco em:

- 📐 **Arquitetura escalável** — Feature-Based Design
- 🔒 **Segurança** — HTTP-Only Cookies, validação em múltiplas camadas
- ⚡ **Performance** — Assets WebP, React Query com cache inteligente, Vite
- 🎨 **UI/UX profissional** — Design System fidelizado ao Figma, micro-animações
- 🧹 **Código limpo** — TypeScript estrito, BiomeJS, zero warnings

---

<div align="center">
  <sub>Desenvolvido com ❤️ como projeto final do <strong>Geração Tech 3.0</strong></sub>
</div>
