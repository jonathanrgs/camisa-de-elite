# Modelo de Dados — Camisa de Elite

> Fonte de verdade: `apps/backend/prisma/schema.prisma`  
> Banco: PostgreSQL (Prisma ORM)

---

## Diagrama de Entidades

```
User ─────┬──── Order ──── OrderItem ──── Product
          │       │                          │
          │       ├──── OrderLink             ├──── Inventory ──── StockAlert
          │       │                          │
          │       └──── CouponRedemption     └──── Review
          │                    │
          └────────────── Coupon

ShippingConfig (standalone)
CartReservation (standalone — sessão temporária)
```

---

## Entidades

### User
| Campo         | Tipo     | Restrições          | Descrição                |
|---------------|----------|---------------------|--------------------------|
| id            | String   | PK, cuid()          | ID único                 |
| email         | String   | unique              | E-mail de login          |
| name          | String?  |                     | Nome completo            |
| phone         | String?  |                     | Telefone                 |
| password      | String   |                     | Hash bcrypt              |
| role          | String   | default: CUSTOMER   | ADMIN \| CUSTOMER        |
| favoriteTeam  | String?  |                     | Time do coração          |
| address       | String?  |                     | Endereço                 |
| neighborhood  | String?  |                     | Bairro                   |
| number        | String?  |                     | Número                   |
| complement    | String?  |                     | Complemento              |
| city          | String?  |                     | Cidade                   |
| state         | String?  |                     | Estado (UF)              |
| zipCode       | String?  |                     | CEP                      |
| createdAt     | DateTime | default: now()      |                          |
| updatedAt     | DateTime | @updatedAt          |                          |

**Relações**: `orders[]`, `reviews[]`, `couponRedemptions[]`

---

### Product
| Campo       | Tipo     | Restrições     | Descrição                                     |
|-------------|----------|----------------|-----------------------------------------------|
| id          | String   | PK, cuid()     | ID único                                      |
| name        | String   |                | Nome do produto                               |
| slug        | String   | unique         | URL amigável                                  |
| description | String?  |                | Descrição                                     |
| price       | Float    |                | Preço em R$                                   |
| images      | String   |                | **JSON array** de URLs (Cloudinary)           |
| category    | String   |                | NACIONAL \| INTERNACIONAL \| RETRO \| SELECAO |
| team        | String   |                | Nome do time                                  |
| league      | String?  |                | Liga / campeonato                             |
| country     | String?  |                | País de origem                                |
| state       | String?  |                | Estado (UF)                                   |
| city        | String?  |                | Cidade                                        |
| season      | String?  |                | Temporada (ex: 2024/25)                       |
| isActive    | Boolean  | default: true  | Se aparece no catálogo                        |
| createdAt   | DateTime | default: now() |                                               |
| updatedAt   | DateTime | @updatedAt     |                                               |

**Relações**: `inventory` (1:1), `orderItems[]`, `reviews[]`

> **Nota**: Imagens são armazenadas como JSON string (array de URLs do Cloudinary). Não existe tabela separada para imagens.

---

### Inventory
| Campo             | Tipo     | Restrições         | Descrição                                              |
|-------------------|----------|--------------------|--------------------------------------------------------|
| id                | String   | PK, cuid()         | ID único                                               |
| productId         | String   | unique, FK→Product | Produto associado (1:1)                                |
| stock             | String   |                    | **JSON**: `{"P":10,"M":15,"G":20,"XL":5,"2XL":2,...}` |
| lowStockThreshold | Int      | default: 5         | Limite para alerta de estoque baixo                    |
| createdAt         | DateTime | default: now()     |                                                        |
| updatedAt         | DateTime | @updatedAt         |                                                        |

**Relações**: `product` (1:1), `alerts[]`  
**Tamanhos**: P, M, G, XL, 2XL, 3XL, 4XL

---

### StockAlert
| Campo       | Tipo     | Restrições     | Descrição                    |
|-------------|----------|----------------|------------------------------|
| id          | String   | PK, cuid()     | ID único                     |
| inventoryId | String   | FK→Inventory   | Inventário associado         |
| size        | String   |                | P, M, G, XL, 2XL, 3XL, 4XL |
| currentQty  | Int      |                | Quantidade atual             |
| message     | String   |                | Mensagem do alerta           |
| isRead      | Boolean  | default: false | Se foi lido                  |
| createdAt   | DateTime | default: now() |                              |

---

### Order
| Campo           | Tipo     | Restrições        | Descrição                                                                    |
|-----------------|----------|-------------------|------------------------------------------------------------------------------|
| id              | String   | PK, cuid()        | ID único                                                                     |
| userId          | String?  | FK→User           | Usuário (null se checkout anônimo)                                           |
| customerName    | String   |                   | Nome do cliente                                                              |
| customerPhone   | String   |                   | Telefone                                                                     |
| customerEmail   | String?  |                   | E-mail                                                                       |
| totalAmount     | Float    |                   | Valor total sem desconto                                                     |
| discountAmount  | Float?   |                   | Valor do desconto aplicado                                                   |
| discountedTotal | Float?   |                   | Total com desconto                                                           |
| shippingAmount  | Float?   |                   | Valor do frete                                                               |
| status          | String   | default: PENDENTE | PENDENTE \| CONFIRMADO \| EM_ROTA \| ENVIADO \| ENTREGUE \| CANCELADO       |
| couponId        | String?  | FK→Coupon         | Cupom utilizado                                                              |
| address         | String?  |                   | Endereço de entrega                                                          |
| neighborhood    | String?  |                   | Bairro                                                                       |
| number          | String?  |                   | Número                                                                       |
| complement      | String?  |                   | Complemento                                                                  |
| city            | String?  |                   | Cidade                                                                       |
| state           | String?  |                   | Estado (UF)                                                                  |
| zipCode         | String?  |                   | CEP                                                                          |
| notes           | String?  |                   | Observações                                                                  |
| createdAt       | DateTime | default: now()    |                                                                              |
| updatedAt       | DateTime | @updatedAt        |                                                                              |

**Relações**: `user?`, `items[]`, `orderLink?`, `coupon?`, `couponRedemptions[]`

---

### OrderItem
| Campo        | Tipo     | Restrições         | Descrição                    |
|--------------|----------|--------------------|------------------------------|
| id           | String   | PK, cuid()         | ID único                     |
| orderId      | String   | FK→Order (cascade) | Pedido                       |
| productId    | String   | FK→Product         | Produto                      |
| size         | String   |                    | P, M, G, XL, 2XL, 3XL, 4XL |
| quantity     | Int      |                    | Quantidade                   |
| unitPrice    | Float    |                    | Preço unitário               |
| customName   | String?  |                    | Nome personalização          |
| customNumber | String?  |                    | Número personalização        |
| createdAt    | DateTime | default: now()     |                              |

---

### OrderLink
| Campo     | Tipo     | Restrições       | Descrição                |
|-----------|----------|------------------|--------------------------|
| id        | String   | PK, cuid()       | ID único                 |
| orderId   | String   | unique, FK→Order | Pedido (1:1)             |
| token     | String   | unique           | Token público de acesso  |
| expiresAt | DateTime |                  | Data de expiração        |
| isUsed    | Boolean  | default: false   | Se o link já foi usado   |
| createdAt | DateTime | default: now()   |                          |

---

### Coupon
| Campo          | Tipo      | Restrições     | Descrição                            |
|----------------|-----------|----------------|--------------------------------------|
| id             | String    | PK, cuid()     | ID único                             |
| code           | String    | unique         | Código (ex: PROMO10)                 |
| type           | String    |                | percent \| fixed \| free_shipping    |
| value          | Float     |                | Valor do desconto (% ou R$)         |
| minTotal       | Float     | default: 0     | Valor mínimo do pedido               |
| maxUses        | Int?      |                | Limite de usos totais                |
| maxUsesPerUser | Int?      |                | Limite por usuário                   |
| isActive       | Boolean   | default: true  | Ativado/desativado manualmente       |
| expiresAt      | DateTime? |                | Data de expiração                    |
| createdAt      | DateTime  | default: now() |                                      |
| updatedAt      | DateTime  | @updatedAt     |                                      |

**Relações**: `orders[]`, `redemptions[]`

---

### CouponRedemption
| Campo      | Tipo     | Restrições          | Descrição             |
|------------|----------|---------------------|-----------------------|
| id         | String   | PK, cuid()          | ID único              |
| couponId   | String   | FK→Coupon (cascade) | Cupom utilizado       |
| userId     | String?  | FK→User             | Usuário que usou      |
| orderId    | String?  | FK→Order            | Pedido onde foi usado |
| redeemedAt | DateTime | default: now()      | Data do uso           |

---

### Review
| Campo      | Tipo     | Restrições           | Descrição              |
|------------|----------|----------------------|------------------------|
| id         | String   | PK, cuid()           | ID único               |
| productId  | String   | FK→Product (cascade) | Produto avaliado       |
| userId     | String?  | FK→User              | Autor (se logado)      |
| authorName | String   |                      | Nome exibido           |
| rating     | Int      |                      | Nota 1-5               |
| comment    | String?  |                      | Comentário             |
| isApproved | Boolean  | default: false       | Aprovado pelo admin    |
| createdAt  | DateTime | default: now()       |                        |
| updatedAt  | DateTime | @updatedAt           |                        |

---

### CartReservation
| Campo     | Tipo     | Restrições                           | Descrição                      |
|-----------|----------|--------------------------------------|--------------------------------|
| id        | String   | PK, cuid()                           | ID único                       |
| sessionId | String   | @@unique(sessionId, productId, size) | ID do carrinho/sessão          |
| productId | String   |                                      | Produto reservado              |
| size      | String   |                                      | P, M, G, XL, 2XL, 3XL, 4XL   |
| quantity  | Int      |                                      | Quantidade reservada           |
| expiresAt | DateTime | @@index                              | Expira em 30min de inatividade |
| createdAt | DateTime | default: now()                       |                                |
| updatedAt | DateTime | @updatedAt                           |                                |

> Reservas expiradas são limpas a cada 5 minutos via job background no servidor.

---

### ShippingConfig
| Campo           | Tipo     | Restrições     | Descrição                                       |
|-----------------|----------|----------------|-------------------------------------------------|
| id              | String   | PK, cuid()     | ID único                                        |
| freeShippingMin | Float    |                | Valor mínimo para frete grátis                  |
| fixedShipping   | Float    |                | Frete fixo padrão R$                            |
| cityRules       | String   |                | JSON: `[{city, state, type, value, kmRadius}]`  |
| originCep       | String?  |                | CEP de origem                                   |
| originNumber    | String?  |                | Número do endereço de origem                    |
| radiusKm        | Int?     |                | Raio em km para frete local                     |
| createdAt       | DateTime | default: now() |                                                 |
| updatedAt       | DateTime | @updatedAt     |                                                 |

---

## Regras de Negócio

1. **Imagens**: JSON array de URLs no campo `Product.images`. Upload via Cloudinary. Primeira URL = imagem principal.
2. **Estoque**: JSON `Inventory.stock` com quantidade por tamanho. Quando `qty = 0` → "Esgotado" + botão "Avise-me".
3. **Reservas**: Ao adicionar ao carrinho, estoque é reservado por 30min via `CartReservation`. Job limpa expirados a cada 5min.
4. **Pedidos**: Checkout gera `Order` + `OrderLink` com token único. Fluxo: PENDENTE → CONFIRMADO → EM_ROTA → ENVIADO → ENTREGUE (ou CANCELADO).
5. **Cupons**: Tipos: `percent`, `fixed`, `free_shipping`. Validação: `minTotal`, `maxUses`, `isActive`, `expiresAt`.
6. **Avaliações**: `isApproved: false` por padrão. Admin modera (aprova/rejeita).
7. **OrderLink**: Token público com expiração. `isUsed` marca se já foi acessado.
