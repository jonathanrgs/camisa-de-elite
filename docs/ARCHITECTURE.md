# Arquitetura — Camisa de Elite

---

## Visão Geral

| Camada     | Tecnologia                | Deploy    |
|------------|---------------------------|-----------|
| Frontend   | React 18 + Vite (SPA)    | Vercel    |
| Backend    | Node.js + Express (REST) | Railway   |
| Banco      | PostgreSQL (Prisma ORM)  | Railway   |
| Storage    | Cloudinary               | Cloud     |
| Integração | WhatsApp (link direto)   | —         |

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL   │
│  React/Vite  │     │  Express API │     │   (Prisma)    │
│  (Vercel)    │     │  (Railway)   │     │  (Railway)    │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐
                     │  Cloudinary   │
                     │  (Imagens)    │
                     └──────────────┘
```

---

## Frontend

- **Framework**: React 18 com Vite
- **Estilo**: Tailwind CSS + CSS customizado
- **Roteamento**: React Router v6
- **Estado**: Context API (AuthContext, CartContext)
- **HTTP**: Fetch API nativo com serviços centralizados
- **UI**: Componentes próprios (Button, Input, Select, Spinner, Logo)

### Estrutura de Pastas
```
apps/frontend/src/
├── components/         # Componentes reutilizáveis
│   ├── admin/          # ImageUploader
│   ├── cart/           # FloatingCart
│   ├── layout/         # Header, Footer, Layout
│   ├── product/        # ProductCard, ProductGrid, ProductGallery
│   └── ui/             # Button, Input, Select, Spinner, Logo
├── config/             # API base URL
├── hooks/              # useAuth, useCart, useCoupon, useProduct, etc.
├── pages/              # Todas as páginas organizadas por domínio
│   ├── Admin/          # Dashboard, Produtos, Pedidos, Cupons, etc.
│   ├── Auth/           # Login, Register
│   ├── Catalog/        # CatalogPage
│   ├── Checkout/       # CheckoutPage
│   ├── Home/           # HomePage
│   └── ...
├── routes/             # AppRoutes.jsx
├── services/           # API services (auth, admin, cart, coupon, etc.)
├── theme/              # Tokens de design
└── utils/              # Utilitários
```

---

## Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma (PostgreSQL)
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Upload**: Multer → Cloudinary SDK
- **Validação**: Manual nos controllers

### Estrutura de Pastas
```
apps/backend/src/
├── config/             # Prisma client, Cloudinary, env
├── controllers/        # Lógica de negócio por domínio
├── middlewares/         # Auth, error handler, upload
├── routes/             # Definição de rotas Express
└── utils/              # Helpers (apiResponse, slugify)
```

### Rotas Montadas
```
/api/health             → healthController
/api/auth/*             → authController
/api/products/*         → productController, inventoryController, reviewController
/api/cart/*             → cartController
/api/coupons/*          → couponController
/api/checkout           → orderController
/api/order-link/*       → orderController
/api/whatsapp/*         → orderController
/api/alerts/*           → inventoryController
/api/user/*             → userController
/api/admin/*            → adminController, imageController, productController
```

---

## Fluxos Principais

### 1. Autenticação
1. Cliente faz POST `/auth/register` ou `/auth/login`
2. Backend retorna JWT token
3. Frontend armazena token no localStorage
4. Requisições autenticadas enviam header `Authorization: Bearer <token>`

### 2. Catálogo → Carrinho → Checkout
1. Usuário navega catálogo com filtros (GET `/products`)
2. Abre produto (GET `/products/:slug`)
3. Adiciona ao carrinho → POST `/cart/reserve` (reserva 30min)
4. Frontend mantém heartbeat a cada 20min (POST `/cart/refresh`)
5. Finaliza checkout (POST `/checkout`) com dados + cupom + frete
6. Backend gera Order + OrderLink com token
7. Redireciona para WhatsApp com link do pedido

### 3. Gestão de Pedidos (Admin)
1. Admin lista pedidos (GET `/admin/orders`)
2. Visualiza detalhes (expandir)
3. Altera status (PUT `/admin/orders/:id/status`)
4. Fluxo: PENDENTE → CONFIRMADO → EM_ROTA → ENVIADO → ENTREGUE

### 4. Upload de Imagens
1. Admin acessa MediaManager ou formulário de produto
2. Upload via Multer → Cloudinary (POST `/admin/upload`)
3. URLs salvas no campo `Product.images` (JSON array)
4. Reordenação via PUT `/admin/products/:id/images/reorder`

### 5. Cupons
1. Admin cria cupom (POST `/coupons`)
2. Cliente insere código no checkout
3. Frontend valida (POST `/coupons/validate`)
4. Frontend calcula desconto (POST `/coupons/apply`)
5. Desconto aplicado no checkout final

### 6. Reserva de Estoque
1. Adicionar ao carrinho → POST `/cart/reserve`
2. Estoque real = `Inventory.stock[size]` - soma de `CartReservation.quantity` ativas
3. A cada 20min frontend envia POST `/cart/refresh` (heartbeat)
4. Após 30min sem refresh → reserva expira
5. Job background limpa reservas expiradas a cada 5 minutos

---

## Segurança

- **CORS**: Domínios específicos permitidos (Vercel deploy, Render, localhost)
- **JWT**: Tokens com expiração para autenticação
- **Roles**: ADMIN e CUSTOMER com middleware de autorização
- **Hashing**: bcryptjs para senhas
- **Upload**: Validação de tipo de arquivo e tamanho máximo (5MB)
- **OrderLinks**: Tokens únicos com expiração temporal

---

## Background Jobs

| Job                          | Intervalo | Descrição                                |
|------------------------------|-----------|------------------------------------------|
| Cleanup expired reservations | 5 min     | Remove CartReservation com expiresAt < now |

---

## Deploy

| Serviço    | Plataforma | URL                                               |
|------------|------------|---------------------------------------------------|
| Frontend   | Vercel     | camisa-de-elite-frontend.vercel.app               |
| Backend    | Railway    | (Railway deploy)                                  |
| Banco      | Railway    | PostgreSQL managed                                |
| Imagens    | Cloudinary | Cloud storage                                     |
