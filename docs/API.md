# API

Base URL: `/api`

## Auth
- POST `/auth/register` → cria usuário
- POST `/auth/login` → retorna JWT

## Produtos
- GET `/products` → lista com filtros, busca, paginação
  - Query: `q`, `category` (NACIONAL|INTERNACIONAL), `state`, `city`, `league`, `team`, `page`, `pageSize`
- GET `/products/:slug` → detalhes do produto
- GET `/products/:id/inventory` → estoque por tamanho

### Admin (Produtos)
- POST `/admin/products` → cria produto
- PUT `/admin/products/:id` → atualiza
- DELETE `/admin/products/:id` → desativa/arquiva
- POST `/admin/products/:id/images` → gerencia 3-5 imagens (upload)
- PUT `/admin/products/:id/inventory` → atualiza estoque por tamanho

## Avaliações
- GET `/products/:id/reviews` → lista
- POST `/products/:id/reviews` → cria (restrito: apenas pedidos ENTREGUE com o produto)

## Carrinho & Checkout
- POST `/cart` → cria/atualiza carrinho (server-side)
- POST `/checkout` → cria `Order` + `OrderLink` (gera token e expiração)
- GET `/orders/:orderId/link` → recupera link
- GET `/order-link/:token` → exibe página pública do pedido

## WhatsApp
- GET `/whatsapp/message/:orderId` → retorna texto pré-formatado para abrir no WhatsApp
  - Exemplo: "Olá! Quero finalizar meu pedido: https://camisadeelite.com/pedido/abc123"

## Admin (Pedidos)
- GET `/admin/orders` → lista pedidos
- GET `/admin/orders/:id` → detalhes
- PUT `/admin/orders/:id/status` → altera status (PENDENTE, CONFIRMADO, ENVIADO, ENTREGUE, PROBLEMA, RESOLVIDO, CANCELADO)
- PUT `/admin/orders/:id/expire` → ajusta expiração do `OrderLink`
- POST `/admin/orders/:id/confirm` → confirma pedido (marca `confirmedByAdmin`)

## Notificações (Avise-me)
- POST `/alerts/back-in-stock` → cria alerta (productId, size, email)
- POST `/admin/alerts/notify` → dispara notificações pendentes quando estoque reposto

## Respostas e Erros
- Todas as respostas em JSON
- Erros padronizados com `{ code, message, details }`
