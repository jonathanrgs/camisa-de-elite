# API Reference — Camisa de Elite

> Base URL: `/api`  
> Autenticação: JWT Bearer Token  
> Formato: JSON

---

## Autenticação (`/api/auth`)

| Método | Endpoint           | Auth   | Descrição                    |
|--------|--------------------|--------|------------------------------|
| POST   | `/auth/register`   | —      | Registrar novo cliente       |
| POST   | `/auth/login`      | —      | Login (retorna JWT)          |
| GET    | `/auth/profile`    | User   | Obter perfil do usuário      |
| PUT    | `/auth/profile`    | User   | Atualizar perfil             |
| PUT    | `/auth/password`   | User   | Alterar senha                |
| POST   | `/auth/admin`      | Admin  | Criar novo admin             |

### POST `/auth/register`
```json
{
  "email": "user@email.com",
  "password": "123456",
  "name": "João",
  "phone": "11999999999",
  "favoriteTeam": "Flamengo",
  "address": "Rua X",
  "neighborhood": "Centro",
  "number": "123",
  "complement": "Apto 1",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01000-000"
}
```

### POST `/auth/login`
```json
{ "email": "user@email.com", "password": "123456" }
```
**Retorna**: `{ token, user: { id, name, email, role } }`

---

## Produtos (`/api/products`) — Público

| Método | Endpoint                      | Auth | Descrição                            |
|--------|-------------------------------|------|--------------------------------------|
| GET    | `/products`                   | —    | Listar produtos (filtros/paginação)  |
| GET    | `/products/:slug`             | —    | Detalhes por slug                    |
| GET    | `/products/:id/inventory`     | —    | Estoque por tamanho                  |
| GET    | `/products/:id/reviews`       | —    | Avaliações aprovadas do produto      |
| POST   | `/products/:id/reviews`       | —    | Criar avaliação (moderada)           |

### GET `/products` — Query Params
| Param      | Tipo   | Descrição                              |
|------------|--------|----------------------------------------|
| `q`        | String | Busca texto em nome/descrição/time     |
| `category` | String | NACIONAL \| INTERNACIONAL \| RETRO \| SELECAO |
| `state`    | String | Filtro por estado                      |
| `city`     | String | Filtro por cidade                      |
| `page`     | Int    | Página (default: 1)                    |
| `pageSize` | Int    | Itens por página (default: 12)         |

### POST `/products/:id/reviews`
```json
{ "authorName": "João", "rating": 5, "comment": "Ótima camisa!" }
```

---

## Carrinho (`/api/cart`) — Público

| Método | Endpoint                                 | Auth | Descrição                              |
|--------|------------------------------------------|------|----------------------------------------|
| POST   | `/cart/reserve`                          | —    | Reservar estoque (30min TTL)           |
| DELETE | `/cart/release`                          | —    | Liberar reserva                        |
| POST   | `/cart/refresh`                          | —    | Estender expiração das reservas        |
| GET    | `/cart/check-stock/:productId/:size`     | —    | Verificar estoque disponível real      |
| GET    | `/cart/reservations/:sessionId`          | —    | Listar reservas da sessão              |

### POST `/cart/reserve`
```json
{ "sessionId": "abc123", "productId": "prod-id", "size": "M", "quantity": 1 }
```

### DELETE `/cart/release`
```json
{ "sessionId": "abc123", "productId": "prod-id", "size": "M" }
```
> Omita `productId`/`size` para liberar toda a sessão.

---

## Cupons (`/api/coupons`)

| Método | Endpoint                | Auth  | Descrição                     |
|--------|-------------------------|-------|-------------------------------|
| GET    | `/coupons`              | —     | Listar todos os cupons        |
| POST   | `/coupons`              | Admin | Criar cupom                   |
| PUT    | `/coupons/:id`          | Admin | Atualizar cupom               |
| DELETE | `/coupons/:id`          | Admin | Remover cupom                 |
| PATCH  | `/coupons/:id/toggle`   | Admin | Ativar/desativar cupom        |
| POST   | `/coupons/validate`     | —     | Validar cupom antes do checkout |
| POST   | `/coupons/apply`        | —     | Calcular desconto             |

### POST `/coupons`
```json
{
  "code": "PROMO10",
  "type": "percent",
  "value": 10,
  "minTotal": 100,
  "maxUses": 50,
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

### POST `/coupons/validate`
```json
{ "code": "PROMO10", "cartTotal": 150.00 }
```

### POST `/coupons/apply`
```json
{ "coupon": { "type": "percent", "value": 10 }, "cartTotal": 150.00, "shipping": 15.00 }
```

---

## Checkout (`/api/checkout`)

| Método | Endpoint     | Auth     | Descrição                          |
|--------|-------------|----------|------------------------------------|
| POST   | `/checkout` | Opcional | Criar pedido + link público        |

### POST `/checkout`
```json
{
  "customerName": "João",
  "customerPhone": "11999999999",
  "customerEmail": "joao@email.com",
  "items": [
    { "productId": "abc", "size": "M", "quantity": 1 }
  ],
  "address": "Rua X, 123",
  "neighborhood": "Centro",
  "number": "123",
  "city": "SP",
  "state": "SP",
  "zipCode": "01000000",
  "notes": "Entregar à tarde",
  "couponCode": "PROMO10",
  "shippingAmount": 15.00
}
```

---

## Link de Pedido (`/api/order-link`)

| Método | Endpoint              | Auth | Descrição                      |
|--------|-----------------------|------|--------------------------------|
| GET    | `/order-link/:token`  | —    | Ver pedido por token público   |

---

## WhatsApp (`/api/whatsapp`)

| Método | Endpoint                       | Auth | Descrição                        |
|--------|--------------------------------|------|----------------------------------|
| GET    | `/whatsapp/message/:orderId`   | —    | Gerar link WhatsApp do pedido    |

---

## Alertas de Estoque (`/api/alerts`)

| Método | Endpoint                | Auth | Descrição                       |
|--------|-------------------------|------|---------------------------------|
| POST   | `/alerts/back-in-stock` | —    | Cadastrar alerta "Avise-me"     |

```json
{ "productId": "abc", "size": "M", "email": "user@email.com" }
```

---

## Área do Usuário (`/api/user`) — Requer Auth

| Método | Endpoint               | Auth | Descrição                          |
|--------|------------------------|------|------------------------------------|
| GET    | `/user/orders`         | User | Meus pedidos                       |
| GET    | `/user/orders/:id`     | User | Detalhes do meu pedido             |
| POST   | `/user/orders`         | User | Criar pedido (logado)              |
| GET    | `/user/reviews`        | User | Minhas avaliações                  |
| POST   | `/user/reviews`        | User | Criar avaliação                    |
| GET    | `/user/reviews/pending`| User | Produtos para avaliar              |

---

## Admin (`/api/admin`) — Requer Auth Admin

### Dashboard
| Método | Endpoint          | Auth  | Descrição                      |
|--------|-------------------|-------|--------------------------------|
| GET    | `/admin/stats`    | Admin | Estatísticas do dashboard      |

**Retorna**: `{ stats: { totalProducts, totalOrders, pendingOrders, totalUsers, totalRevenue }, recentOrders[] }`

### Produtos
| Método | Endpoint                              | Auth  | Descrição                      |
|--------|---------------------------------------|-------|--------------------------------|
| GET    | `/admin/products`                     | Admin | Listar todos os produtos       |
| POST   | `/admin/products`                     | Admin | Criar produto                  |
| PUT    | `/admin/products/:id`                 | Admin | Atualizar produto              |
| DELETE | `/admin/products/:id`                 | Admin | Excluir produto permanente     |
| GET    | `/admin/products/export/csv`          | Admin | Exportar CSV de produtos       |

### Imagens de Produtos
| Método | Endpoint                              | Auth  | Descrição                    |
|--------|---------------------------------------|-------|------------------------------|
| POST   | `/admin/products/:id/images`          | Admin | Upload de imagens (multipart)|
| DELETE | `/admin/products/:id/images`          | Admin | Remover imagem               |
| PUT    | `/admin/products/:id/images/reorder`  | Admin | Reordenar imagens            |

### Mídia (Cloudinary)
| Método | Endpoint              | Auth  | Descrição                      |
|--------|-----------------------|-------|--------------------------------|
| GET    | `/admin/media`        | Admin | Listar todas as mídias         |
| DELETE | `/admin/media`        | Admin | Excluir mídias                 |
| PUT    | `/admin/media/rename` | Admin | Renomear mídia                 |
| POST   | `/admin/upload`       | Admin | Upload genérico de imagem      |

### Pedidos
| Método | Endpoint                       | Auth  | Descrição                    |
|--------|--------------------------------|-------|------------------------------|
| GET    | `/admin/orders`                | Admin | Listar pedidos               |
| PUT    | `/admin/orders/:id/status`     | Admin | Alterar status do pedido     |

**Status válidos**: PENDENTE, CONFIRMADO, EM_ROTA, ENVIADO, ENTREGUE, CANCELADO

### Avaliações
| Método | Endpoint                         | Auth  | Descrição                  |
|--------|----------------------------------|-------|----------------------------|
| GET    | `/admin/reviews/pending`         | Admin | Listar avaliações pendentes|
| PUT    | `/admin/reviews/:id/moderate`    | Admin | Aprovar/rejeitar avaliação |

```json
{ "approve": true }
```

### Usuários
| Método | Endpoint         | Auth  | Descrição                    |
|--------|------------------|-------|------------------------------|
| GET    | `/admin/users`   | Admin | Listar todos os usuários     |

### Frete
| Método | Endpoint                  | Auth  | Descrição                      |
|--------|---------------------------|-------|--------------------------------|
| GET    | `/admin/shipping-config`  | —     | Obter config de frete          |
| POST   | `/admin/shipping-config`  | Admin | Salvar config de frete         |

```json
{
  "freeShippingMin": 200,
  "fixedShipping": 15,
  "cityRules": [{"city": "São Paulo", "state": "SP", "type": "fixed", "value": 10}],
  "originCep": "01000000",
  "originNumber": "123",
  "radiusKm": 10
}
```

---

## Health Check

| Método | Endpoint      | Auth | Descrição              |
|--------|---------------|------|------------------------|
| GET    | `/health`     | —    | Status da API          |

---

## Formato de Respostas

### Sucesso
```json
{
  "success": true,
  "data": { ... }
}
```

### Erro
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "message": "Detalhes adicionais"
}
```

---

## Autenticação

- Token JWT enviado via header `Authorization: Bearer <token>`
- Roles: `CUSTOMER` (padrão), `ADMIN`
- Middleware `authenticate` valida o token
- Middleware `authorizeAdmin` verifica se `user.role === 'ADMIN'`
