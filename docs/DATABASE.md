# Modelo de Dados (ER)

## Entidades

### User
- id (PK)
- name
- email (unique)
- passwordHash
- role (enum: CUSTOMER, ADMIN)
- createdAt, updatedAt

### Product
- id (PK)
- name
- slug (unique)
- description
- price
- category (enum: NACIONAL, INTERNACIONAL)
- regionState (UF opcional)
- regionCity (opcional)
- league (opcional)
- team (opcional)
- isActive (bool)
- createdAt, updatedAt

### ProductImage
- id (PK)
- productId (FK → Product)
- url
- position (1..5)
- isPrimary (bool)

### Inventory
- id (PK)
- productId (FK → Product)
- size (enum: PP, P, M, G, GG)
- quantity (int)
- lowStockThreshold (int, opcional)

### BackInStockAlert
- id (PK)
- productId (FK → Product)
- size (enum)
- email
- isNotified (bool)
- createdAt

### Review
- id (PK)
- productId (FK → Product)
- userId (FK → User)
- rating (1..5)
- title (opcional)
- comment (opcional)
- createdAt
- Constraints: somente se existir `Order` do `userId` com status `ENTREGUE` contendo `productId`

### Order
- id (PK)
- userId (FK → User)
- status (enum: PENDENTE, CONFIRMADO, ENVIADO, ENTREGUE, PROBLEMA, RESOLVIDO, CANCELADO)
- total
- createdAt, updatedAt

### OrderItem
- id (PK)
- orderId (FK → Order)
- productId (FK → Product)
- size (enum)
- unitPrice
- quantity

### OrderLink
- id (PK)
- orderId (FK → Order)
- token (unique)
- expiresAt (datetime)
- confirmedByAdmin (bool)
- confirmedAt (datetime, opcional)

## Regras
- `Product` deve ter entre 3 e 5 `ProductImage` (validado no admin)
- `Inventory.quantity = 0` → "Esgotado" e exibe botão "Avise-me"
- Ao atualizar `Inventory.quantity` de 0 para >0, enviar notificações pendentes em `BackInStockAlert`
- `OrderLink` expira se não confirmado até `expiresAt`; admin pode alterar o tempo padrão
