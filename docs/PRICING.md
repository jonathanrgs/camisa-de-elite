# 💰 Precificação do Projeto - Camisa de Elite

> **Documento de Estimativa de Custos de Desenvolvimento**  
> Data: Dezembro 2025

---

## 📊 Resumo Executivo

| Área | Horas Estimadas | Valor (R$) |
|------|-----------------|------------|
| **Frontend** | 180h | R$ 18.000,00 |
| **Backend** | 140h | R$ 14.000,00 |
| **Infraestrutura & DevOps** | 20h | R$ 2.000,00 |
| **Design UI/UX** | 40h | R$ 4.000,00 |
| **Testes & QA** | 30h | R$ 3.000,00 |
| **Documentação** | 10h | R$ 1.000,00 |
| **TOTAL** | **420h** | **R$ 42.000,00** |

> *Valores baseados em taxa média de R$ 100/hora para desenvolvedor pleno*

---

## 🎨 Frontend (React + Vite)

### Estrutura de Componentes

| Módulo | Arquivos | Horas | Valor |
|--------|----------|-------|-------|
| **UI Components** | 7 componentes | 14h | R$ 1.400,00 |
| Button, Input, Select, Spinner, Logo, StatusIcon | | | |
| **Layout** | 3 componentes | 12h | R$ 1.200,00 |
| Header, Footer, Layout | | | |
| **Product Components** | 3 componentes | 15h | R$ 1.500,00 |
| ProductCard, ProductGrid, ProductGallery | | | |
| **Cart Components** | 1 componente | 8h | R$ 800,00 |
| FloatingCart | | | |

### Páginas Públicas

| Página | Complexidade | Horas | Valor |
|--------|--------------|-------|-------|
| **HomePage** | Média | 12h | R$ 1.200,00 |
| **CatalogPage** | Alta | 16h | R$ 1.600,00 |
| Filtros, paginação, busca | | | |
| **ProductPage** | Alta | 20h | R$ 2.000,00 |
| Galeria, tamanhos, avaliações, carrinho | | | |
| **CartPage** | Média | 12h | R$ 1.200,00 |
| **CheckoutPage** | Alta | 18h | R$ 1.800,00 |
| Formulário, validação, integração WhatsApp | | | |
| **OrderPage** | Média | 10h | R$ 1.000,00 |

### Páginas de Autenticação

| Página | Horas | Valor |
|--------|-------|-------|
| **LoginPage** | 6h | R$ 600,00 |
| **RegisterPage** | 8h | R$ 800,00 |
| **ProtectedRoute** | 4h | R$ 400,00 |

### Área do Cliente (Minha Conta)

| Página | Horas | Valor |
|--------|-------|-------|
| **AccountLayout** | 4h | R$ 400,00 |
| **ProfilePage** | 10h | R$ 1.000,00 |
| Edição de dados, endereço, senha | | | |
| **OrdersPage** | 8h | R$ 800,00 |
| **ReviewsPage** | 12h | R$ 1.200,00 |
| Avaliações pendentes e enviadas | | | |

### Painel Administrativo

| Página | Complexidade | Horas | Valor |
|--------|--------------|-------|-------|
| **AdminLayout** | Baixa | 4h | R$ 400,00 |
| **DashboardPage** | Média | 10h | R$ 1.000,00 |
| Estatísticas, gráficos, resumo | | | |
| **ProductsAdminPage** | Muito Alta | 24h | R$ 2.400,00 |
| CRUD completo, upload de imagens, estoque | | | |
| **OrdersAdminPage** | Alta | 16h | R$ 1.600,00 |
| Lista, status, detalhes, WhatsApp | | | |
| **ReviewsAdminPage** | Média | 8h | R$ 800,00 |
| Moderação de avaliações | | | |
| **UsersAdminPage** | Média | 10h | R$ 1.000,00 |
| Lista, criação de admin | | | |

### Páginas Legais

| Página | Horas | Valor |
|--------|-------|-------|
| **TermsPage** | 2h | R$ 200,00 |
| **PrivacyPage** | 2h | R$ 200,00 |
| **AboutPage** | 3h | R$ 300,00 |

### Hooks & Services

| Item | Horas | Valor |
|------|-------|-------|
| **useAuth** | 8h | R$ 800,00 |
| **useCart** | 12h | R$ 1.200,00 |
| Com reserva de estoque | | | |
| **useProduct/useProducts** | 4h | R$ 400,00 |
| **Services (api, product, admin, user, order)** | 10h | R$ 1.000,00 |

### Estilização & Animações

| Item | Horas | Valor |
|------|-------|-------|
| **Tailwind Config** | 4h | R$ 400,00 |
| Cores, fontes, tema | | | |
| **index.css** | 8h | R$ 800,00 |
| Animações, scrollbar, componentes | | | |
| **Responsividade** | 12h | R$ 1.200,00 |

**Subtotal Frontend: 180h = R$ 18.000,00**

---

## ⚙️ Backend (Node.js + Express + Prisma)

### Configuração & Estrutura

| Item | Horas | Valor |
|------|-------|-------|
| **Server Setup** | 6h | R$ 600,00 |
| Express, middleware, CORS | | | |
| **Prisma Config** | 4h | R$ 400,00 |
| **Database Schema** | 8h | R$ 800,00 |
| 10 models | | | |
| **Seed Data** | 4h | R$ 400,00 |

### Middlewares

| Item | Horas | Valor |
|------|-------|-------|
| **auth.js** | 6h | R$ 600,00 |
| JWT, authenticate, authorizeAdmin, optionalAuth | | | |
| **errorHandler.js** | 2h | R$ 200,00 |
| **asyncHandler.js** | 1h | R$ 100,00 |

### Controllers

| Controller | Complexidade | Horas | Valor |
|------------|--------------|-------|-------|
| **productController** | Média | 10h | R$ 1.000,00 |
| CRUD, listagem, filtros | | | |
| **orderController** | Alta | 16h | R$ 1.600,00 |
| Checkout, status, links | | | |
| **authController** | Média | 10h | R$ 1.000,00 |
| Register, login, profile | | | |
| **userController** | Alta | 14h | R$ 1.400,00 |
| Pedidos, avaliações, perfil | | | |
| **adminController** | Muito Alta | 20h | R$ 2.000,00 |
| Stats, produtos, pedidos, reviews, usuários | | | |
| **inventoryController** | Média | 8h | R$ 800,00 |
| Estoque por tamanho | | | |
| **reviewController** | Média | 8h | R$ 800,00 |
| CRUD, moderação | | | |
| **cartController** | Alta | 12h | R$ 1.200,00 |
| Reserva de estoque, timeout | | | |
| **healthController** | Baixa | 2h | R$ 200,00 |

### Routes

| Arquivo | Horas | Valor |
|---------|-------|-------|
| **Todas as rotas** | 10h | R$ 1.000,00 |
| 11 arquivos de rotas | | | |

### Utilitários

| Item | Horas | Valor |
|------|-------|-------|
| **apiResponse.js** | 2h | R$ 200,00 |
| **slugify.js** | 1h | R$ 100,00 |

**Subtotal Backend: 140h = R$ 14.000,00**

---

## 🗄️ Banco de Dados (Prisma + SQLite)

### Models

| Model | Campos | Complexidade |
|-------|--------|--------------|
| **User** | 14 campos | Média |
| **Product** | 14 campos | Média |
| **Inventory** | 5 campos + JSON | Média |
| **StockAlert** | 7 campos | Baixa |
| **Order** | 16 campos | Alta |
| **OrderItem** | 9 campos | Média |
| **OrderLink** | 6 campos | Baixa |
| **Review** | 9 campos | Média |
| **Cart** | 5 campos | Baixa |
| **CartReservation** | 6 campos | Média |

*Incluído no tempo de backend*

---

## 🚀 Infraestrutura & DevOps

| Item | Horas | Valor |
|------|-------|-------|
| **Monorepo Setup** | 4h | R$ 400,00 |
| **Vite Config** | 3h | R$ 300,00 |
| **Environment Variables** | 2h | R$ 200,00 |
| **Build & Deploy Config** | 6h | R$ 600,00 |
| **Proxy Config** | 2h | R$ 200,00 |
| **Git Setup** | 3h | R$ 300,00 |

**Subtotal Infraestrutura: 20h = R$ 2.000,00**

---

## 🎯 Design UI/UX

| Item | Horas | Valor |
|------|-------|-------|
| **Design System** | 8h | R$ 800,00 |
| Cores, tipografia, espaçamentos | | | |
| **Wireframes** | 10h | R$ 1.000,00 |
| **Mockups** | 12h | R$ 1.200,00 |
| **Logo & Branding** | 6h | R$ 600,00 |
| **Ícones & Assets** | 4h | R$ 400,00 |

**Subtotal Design: 40h = R$ 4.000,00**

---

## 🧪 Testes & QA

| Item | Horas | Valor |
|------|-------|-------|
| **Testes Manuais** | 15h | R$ 1.500,00 |
| **Testes de Fluxo** | 10h | R$ 1.000,00 |
| **Bug Fixes** | 5h | R$ 500,00 |

**Subtotal Testes: 30h = R$ 3.000,00**

---

## 📚 Documentação

| Item | Horas | Valor |
|------|-------|-------|
| **README.md** | 2h | R$ 200,00 |
| **API.md** | 3h | R$ 300,00 |
| **ARCHITECTURE.md** | 2h | R$ 200,00 |
| **DATABASE.md** | 1h | R$ 100,00 |
| **FEATURES.md** | 1h | R$ 100,00 |
| **DESIGN.md** | 1h | R$ 100,00 |

**Subtotal Documentação: 10h = R$ 1.000,00**

---

## 📈 Funcionalidades por Complexidade

### 🟢 Funcionalidades Simples (2-6h cada)
- Health check endpoint
- Páginas estáticas (termos, privacidade)
- Componentes UI básicos
- Rotas básicas

### 🟡 Funcionalidades Médias (8-16h cada)
- Sistema de autenticação JWT
- CRUD de produtos
- Sistema de avaliações
- Carrinho básico
- Área do usuário

### 🔴 Funcionalidades Complexas (18-30h cada)
- Checkout com integração WhatsApp
- Sistema de reserva de estoque
- Painel administrativo completo
- Gerenciamento de pedidos com status
- Dashboard com estatísticas

---

## 💳 Opções de Pagamento

### Opção 1: Projeto Completo
- **Valor:** R$ 42.000,00
- **Prazo:** 8-10 semanas
- **Pagamento:** 30% início + 40% metade + 30% entrega

### Opção 2: Por Módulos

| Módulo | Valor |
|--------|-------|
| MVP (Catálogo + Carrinho + Checkout) | R$ 18.000,00 |
| Sistema de Usuários | R$ 8.000,00 |
| Painel Administrativo | R$ 12.000,00 |
| Sistema de Avaliações | R$ 4.000,00 |

### Opção 3: Manutenção Mensal
- **Valor:** R$ 2.500,00/mês
- Inclui: até 20h de desenvolvimento/suporte
- Correção de bugs
- Pequenas melhorias
- Suporte técnico

---

## 📋 O Que Está Incluído

✅ Código fonte completo  
✅ Documentação técnica  
✅ Setup de ambiente  
✅ 30 dias de suporte pós-entrega  
✅ Treinamento básico de uso  

## ❌ O Que NÃO Está Incluído

❌ Hospedagem (custos mensais)  
❌ Domínio  
❌ Integrações com gateways de pagamento  
❌ App mobile  
❌ Manutenção após 30 dias  

---

## 🔧 Custos de Hospedagem (Estimativa Mensal)

| Serviço | Custo Estimado |
|---------|----------------|
| **VPS básica** (2GB RAM) | R$ 50-100/mês |
| **Domínio .com.br** | R$ 40/ano |
| **SSL** | Gratuito (Let's Encrypt) |
| **CDN para imagens** | R$ 0-50/mês |

---

## 📊 Tecnologias Utilizadas

### Frontend
- React 18
- Vite 5
- Tailwind CSS
- React Router 6

### Backend
- Node.js 18+
- Express 4
- Prisma ORM
- SQLite (dev) / PostgreSQL (prod)
- JWT

### Ferramentas
- ESBuild
- Git
- Prisma Studio

---

## 📞 Contato

Para mais informações ou negociação de valores, entre em contato.

---

*Este documento é uma estimativa e pode variar de acordo com requisitos específicos, mudanças de escopo ou complexidades não previstas.*
