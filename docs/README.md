# Camisa de Elite

Catálogo e loja de camisetas de futebol com checkout via WhatsApp, painel admin, avaliações, filtros avançados e controle de estoque.

## Escopo do MVP
- Catálogo responsivo com filtros (Nacional/Internacional, Estado/Cidade), busca e paginação
- Página de produto (galeria 3-5 imagens, estoque por tamanho, avaliações)
- Carrinho e checkout (sem pagamento online) com link único do pedido
- Redirecionamento para WhatsApp com mensagem automática contendo o link do pedido
- Painel admin para gerenciar produtos, estoque, pedidos e avaliações
- Links externos de pedido com expiração configurável e confirmação de admin

## Fluxo de Pedido
1. Cliente monta carrinho
2. Faz checkout → gera link único (ex.: `/pedido/abc123`)
3. Redireciona para WhatsApp com mensagem automática
4. Admin confirma ou rejeita; se não confirmar até a expiração, o link expira

Status possíveis:
- `PENDENTE` → `CONFIRMADO` → `ENVIADO` → `ENTREGUE`
- Intermediários: `PROBLEMA` (tratado via WhatsApp) → `RESOLVIDO`
- Terminal: `CANCELADO`

## Regras de Avaliação
- Apenas pedidos com status `ENTREGUE` podem avaliar
- Problemas são resolvidos no WhatsApp; não geram avaliações durante o status `PROBLEMA`

## Tech Stack Sugerida
- Frontend: React + Vite + TypeScript, Tailwind CSS
- Backend: Node.js (Express/Fastify), JWT Auth
- Banco: PostgreSQL + Prisma
- Uploads: Cloudinary ou S3
- Deploy: Vercel (front) + Railway (back)

## Próximos passos
- Validar arquitetura e entidades
- Detalhar endpoints e contratos
- Iniciar scaffolding de monorepo (opcional)