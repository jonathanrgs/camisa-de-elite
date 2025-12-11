# Arquitetura

## Visão Geral
- Frontend (SPA) em React + Vite
- Backend (API REST) em Node.js (Express/Fastify)
- PostgreSQL como fonte de dados principal (Prisma ORM)
- Armazenamento de imagens em Cloudinary/S3
- Integração WhatsApp via link com mensagem pré-formatada
- Links de pedido públicos com token e expiração configurável

## Componentes
- Web App (Cliente)
- Admin App (pode ser rota protegida do mesmo front)
- API Gateway/Backend
- Banco de dados
- Storage de imagens
- Serviço de notificações (email/queue) para "Avise-me"

## Fluxos Principais
1. Auth: JWT para clientes e admins
2. Catálogo: listagem com filtros, busca e paginação
3. Produto: detalhes, galeria, estoque por tamanho, avaliações
4. Checkout: cria `Order` com `OrderItem`, gera `OrderLink` com expiração
5. WhatsApp: redireciona com mensagem contendo URL do pedido
6. Admin: confirma/cancela, ajusta estoque, gerencia expiração
7. Notificações: cadastro de alerta "Avise-me" por tamanho; ao repor estoque, disparo de e-mail

## Segurança
- Links de pedido usam token aleatório e expiração (TTL)
- Admin pode alterar o tempo de expiração (default 24h)
- Regras de acesso: rotas admin protegidas; endpoints de avaliação condicionados ao status `ENTREGUE`

## Observabilidade
- Logs de mudanças de status de pedido
- Auditoria em alterações de estoque e expiração

## Deploy
- Front: Vercel
- Back: Railway
- Banco: Railway PostgreSQL
- Storage: Cloudinary
