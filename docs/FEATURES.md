# Features e Regras de Negócio

## Catálogo
- Filtros: Nacional/Internacional, Estado/Cidade, Liga, Time
- Busca por texto em nome/descrição/time
- Paginação com contagem total
- Seções dinâmicas: Mais vendidos, Melhor avaliados, Novidades

## Produto
- Galeria com 3-5 imagens (tamanho padronizado), `isPrimary`
- Estoque por tamanho (PP, P, M, G, GG)
- Estado do estoque: Disponível / Esgotado
- Botão "Avise-me" quando esgotado

## Carrinho & Checkout
- Carrinho persistente (session/JWT)
- Checkout sem pagamento online
- Geração de link único com expiração configurável
- Redirecionamento para WhatsApp com mensagem automática

## Pedidos
- Status: PENDENTE, CONFIRMADO, ENVIADO, ENTREGUE, PROBLEMA, RESOLVIDO, CANCELADO
- Auditoria de mudanças de status
- Admin pode ajustar expiração de link

## Avaliações
- Permitidas apenas após `ENTREGUE`
- Moderadas pelo admin (opcional)
- Nota 1..5 + comentário

## Admin
- Dashboard com KPIs (pedidos, estoque baixo, reviews recentes)
- CRUD de produtos com validação (3-5 imagens)
- Gestão de estoque e alertas "Avise-me"
- Gestão de pedidos e status

## Notificações
- BackInStock: email para quem solicitou
- Templates customizáveis

## Segurança & Privacidade
- JWT, RBAC simples (roles: CUSTOMER, ADMIN)
- Tokens de link de pedido com TTL
- Rate limit básico em endpoints públicos
