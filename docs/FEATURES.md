# Features e Regras de Negócio — Camisa de Elite

---

## Catálogo

- Filtros: Nacional, Internacional, Retrô, Seleção
- Filtros por estado, cidade, liga, time
- Busca por texto em nome, descrição e time
- Paginação com contagem total
- Produtos inativos não aparecem no catálogo público

## Produto

- Galeria com múltiplas imagens (Cloudinary). Primeira imagem = principal
- Estoque por tamanho: P, M, G, XL, 2XL, 3XL, 4XL
- Status do estoque: Disponível / Esgotado (por tamanho)
- Botão "Avise-me" quando esgotado → cadastra e-mail para alerta
- Avaliações com nota 1-5 e comentário (moderadas pelo admin)
- Slug único para URLs amigáveis

## Carrinho & Reserva de Estoque

- Carrinho persistente via localStorage (sessão baseada em sessionId)
- Reserva de estoque por 30 minutos ao adicionar item ao carrinho
- Heartbeat a cada 20 minutos para estender reservas ativas
- Liberação automática após 30min de inatividade
- Verificação de estoque real descontando reservas ativas de outros usuários
- Limpeza automática de reservas expiradas a cada 5min (job background)

## Checkout

- Checkout sem pagamento online (pedido via WhatsApp)
- Dados: nome, telefone, email, endereço completo, observações
- Suporta cupom de desconto na finalização
- Cálculo de frete (fixo ou por regra de cidade)
- Gera link público com token único e expiração
- Redirecionamento para WhatsApp com mensagem formatada contendo link do pedido
- Suporta checkout anônimo ou logado

## Cupons de Desconto

- Tipos: `percent` (porcentagem), `fixed` (valor fixo R$), `free_shipping` (frete grátis)
- Validação: código, valor mínimo, limite de usos, data de expiração, ativo/inativo
- Aplicação: calcula desconto no subtotal e/ou frete
- Admin pode criar, editar, excluir, ativar/desativar
- Rastreamento de uso via CouponRedemption

## Pedidos

- Status: PENDENTE → CONFIRMADO → EM_ROTA → ENVIADO → ENTREGUE (ou CANCELADO a qualquer momento)
- Link público de pedido com token e expiração
- Admin altera status via painel
- Exibição de desconto, frete e total final
- Itens com personalização (nome e número na camisa)
- Histórico de pedidos na área do usuário logado

## Avaliações

- Nota de 1 a 5 estrelas + comentário opcional
- Nome do autor (obrigatório)
- Moderação pelo admin: aprovar ou rejeitar
- Média de avaliações exibida na página do produto
- Usuários logados podem ver seus produtos pendentes de avaliação

## Frete

- Frete fixo padrão configurável pelo admin
- Valor mínimo para frete grátis configurável
- Regras por cidade: valor fixo ou cálculo por km
- CEP de origem e raio configuráveis
- Config global via painel admin (ShippingConfig)

## Admin

- Dashboard com KPIs: total de produtos, pedidos, pendentes, clientes, receita total
- Pedidos recentes no dashboard
- CRUD completo de produtos com abas (básico, classificação, imagens, estoque)
- Gestão de imagens via Cloudinary (upload, delete, reorder, MediaManager)
- Exportação de produtos em CSV
- Gestão de pedidos com filtro por status e busca
- Alteração de status de pedido
- Moderação de avaliações pendentes
- Gestão de usuários (lista de admins e clientes)
- Criação de novos admins
- Configuração de frete
- CRUD de cupons com indicadores visuais

## Gerenciador de Mídia

- Lista todas as imagens no Cloudinary
- Upload de novas imagens (drag-and-drop)
- Exclusão individual ou em lote (seleção múltipla)
- Renomeação de imagens
- Busca por nome de arquivo
- Integração com formulário de produto (selecionar imagens do acervo)

## Segurança & Privacidade

- JWT para autenticação, bcrypt para senhas
- Roles: CUSTOMER, ADMIN (RBAC simples)
- Rotas admin protegidas por middleware `authenticate + authorizeAdmin`
- CORS configurado para domínios específicos (Vercel, Render, localhost)
- Tokens de OrderLink com expiração temporal

## Notificações

- BackInStock: cadastro de e-mail para alerta quando produto esgotado for reposto
- Alertas de estoque baixo (StockAlert) gerados automaticamente
