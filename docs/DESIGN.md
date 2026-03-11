# Guia de Design — Camisa de Elite

---

## Identidade Visual

- Estilo **premium esportivo**: fundo escuro com detalhes dourados
- Marca: coroa + brasão com bola (logo fornecida)
- Sensação: luxo, exclusividade, qualidade

---

## Paleta de Cores

| Nome              | Hex       | Uso                          |
|-------------------|-----------|------------------------------|
| Elite Black       | `#0a0a0a` | Fundo principal              |
| Black Card        | `#1a1a1a` | Cards, superfícies elevadas  |
| Elite Gold        | `#c9a227` | CTAs, destaques, ícones      |
| Gold Light        | `#d4b848` | Hover states                 |
| Gold Dark         | `#a68a1f` | Bordas, acentos sutis        |
| White             | `#ffffff` | Texto principal              |
| Gray 400          | `#9ca3af` | Texto secundário             |
| Gray 500          | `#6b7280` | Labels, placeholders         |
| Gray 700          | `#374151` | Bordas de input              |
| Gray 800          | `#1f2937` | Divisores, bordas de card    |
| Gray 900          | `#111827` | Fundos de input              |
| Green 400         | `#4ade80` | Sucesso, disponível          |
| Green 500         | `#22c55e` | Confirmado                   |
| Yellow 400        | `#facc15` | Estoque baixo, pendente      |
| Red 400           | `#f87171` | Erro, esgotado, cancelado    |
| Blue 400          | `#60a5fa` | Info, confirmado, edição     |
| Purple 400        | `#c084fc` | Enviado                      |
| Indigo 400        | `#818cf8` | Em rota                      |

---

## Tipografia

| Uso              | Fonte   | Classe Tailwind  |
|------------------|---------|------------------|
| Corpo (body)     | Inter   | `font-sans`      |
| Títulos/headings | Cinzel  | `font-heading`   |

> Cinzel é uma fonte serif elegante que reforça o estilo premium da marca.

---

## Tamanhos de Produto

Os tamanhos de camisa disponíveis são:  
**P, M, G, XL, 2XL, 3XL, 4XL**

---

## Componentes UI

### Botões
- **btn-primary**: Fundo dourado, texto escuro, hover mais claro
- **btn-secondary**: Border dourado/cinza, fundo transparente, hover com fundo sutil

### Inputs
- Background: `bg-gray-900/80`
- Border: `border-gray-700` → `hover:border-gray-600` → `focus:border-eliteGold`
- Radius: `rounded-xl` (formulários) ou `rounded-lg` (filtros)
- Padding: `px-4 py-3`

### Cards
- Background: `bg-gray-900/50` ou gradiente `from-gray-900 to-gray-950`
- Border: `border-gray-800`
- Radius: `rounded-xl` ou `rounded-2xl`
- Hover: `hover:border-eliteGold/60`

### Status Badges
| Status     | Cor de fundo          | Cor de texto      |
|------------|-----------------------|-------------------|
| PENDENTE   | `bg-yellow-500/20`    | `text-yellow-400` |
| CONFIRMADO | `bg-blue-500/20`      | `text-blue-400`   |
| EM_ROTA    | `bg-indigo-500/20`    | `text-indigo-400` |
| ENVIADO    | `bg-purple-500/20`    | `text-purple-400` |
| ENTREGUE   | `bg-green-500/20`     | `text-green-400`  |
| CANCELADO  | `bg-red-500/20`       | `text-red-400`    |

### Tabelas
- Header: `bg-gray-800/50`, texto `text-gray-400`, `text-sm`, `font-medium`
- Rows: `divide-y divide-gray-800`, hover `hover:bg-gray-800/30`
- Padding: `px-4 py-3`

---

## Animações Customizadas

| Nome           | Tipo                  | Uso                          |
|----------------|-----------------------|------------------------------|
| fade-in        | opacity 0→1           | Entrada de elementos         |
| fade-in-up     | opacity + translateY  | Cards, seções                |
| fade-in-down   | opacity + translateY  | Dropdowns                    |
| slide-in       | translateX            | Sidebar                      |
| scale-in       | scale 0.95→1          | Modais                       |
| glow-pulse     | box-shadow pulsante   | Destaques                    |
| spin-slow      | rotate 360°           | Loading alternativo          |
| float          | translateY sutil      | Elementos decorativos        |

---

## Admin Panel Design

### Layout
- **Sidebar** fixa (desktop): 256px de largura, fundo `bg-gray-900/50`, borda direita
- **Sidebar** (mobile): Drawer deslizante com overlay (`bg-black/60`)
- **Header mobile**: Sticky top, hamburger + logo + logout
- **Content area**: Padding `p-4 lg:p-6`

### Sidebar
- Logo no topo com fundo `bg-eliteGold/10`
- Menu items: ícone + label, active state com `bg-eliteGold/15 text-eliteGold border-l-2`
- Seção separada para "Ações" (Ver Site)
- User info no rodapé com avatar, nome, email, botão de logout

### Cards de Estatísticas (Dashboard)
- Grid 2x2 (mobile) ou 4 colunas (desktop)
- Gradientes coloridos por tema (blue, green, yellow, purple)
- Ícone no canto superior direito
- Decoração: blur circular no canto inferior

### Formulários
- Modais centralizados com overlay escuro (`bg-black/90`)
- Abas de navegação com ícones
- Campos com labels em `text-gray-400` e asterisco vermelho para obrigatórios

---

## Scrollbar Customizada

```css
scrollbar-width: thin;
scrollbar-color: #FFD70033 #18181b;
/* Webkit */
::-webkit-scrollbar { width: 8px; background: #18181b; }
::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #FFD70055, #FFD70022); }
::-webkit-scrollbar-thumb:hover { background: #FFD700; }
```

---

## Responsividade

- **Mobile-first**: Breakpoints para grid de produtos (1→2→3→4 colunas)
- **Admin sidebar**: Hidden em mobile, drawer com overlay
- **Tabelas**: `overflow-x-auto` para scroll horizontal em telas pequenas
- **Cards de stats**: 2 colunas mobile, 4 desktop
- **Formulários**: Stack em mobile, grid 2-3 colunas em desktop
