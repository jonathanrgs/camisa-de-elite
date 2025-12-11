import { prisma } from './config/prisma.js';

const products = [
  {
    name: 'Camisa Flamengo I 2024',
    slug: 'camisa-flamengo-i-2024',
    description: 'Camisa oficial do Flamengo temporada 2024. Material de alta qualidade, tecido respirável com tecnologia Dri-Fit.',
    price: 149.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_959901-MLB74267153813_022024-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_959901-MLB74267153813_022024-O.webp'
    ]),
    category: 'NACIONAL',
    team: 'Flamengo',
    league: 'Brasileirão',
    country: 'Brasil',
    state: 'RJ',
    city: 'Rio de Janeiro',
    season: '2024'
  },
  {
    name: 'Camisa Corinthians I 2024',
    slug: 'camisa-corinthians-i-2024',
    description: 'Camisa oficial do Corinthians temporada 2024. Tradição e qualidade em cada detalhe.',
    price: 139.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_878319-MLB72569704953_112023-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_878319-MLB72569704953_112023-O.webp'
    ]),
    category: 'NACIONAL',
    team: 'Corinthians',
    league: 'Brasileirão',
    country: 'Brasil',
    state: 'SP',
    city: 'São Paulo',
    season: '2024'
  },
  {
    name: 'Camisa Real Madrid I 2024/25',
    slug: 'camisa-real-madrid-i-2024-25',
    description: 'Camisa oficial do Real Madrid temporada 2024/25. O maior clube do mundo, camisa branca clássica.',
    price: 189.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_767540-MLB75564067682_042024-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_767540-MLB75564067682_042024-O.webp'
    ]),
    category: 'INTERNACIONAL',
    team: 'Real Madrid',
    league: 'La Liga',
    country: 'Espanha',
    season: '2024/25'
  },
  {
    name: 'Camisa Barcelona I 2024/25',
    slug: 'camisa-barcelona-i-2024-25',
    description: 'Camisa oficial do Barcelona temporada 2024/25. Més que un club, design clássico blaugrana.',
    price: 179.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_604206-MLB75515958356_042024-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_604206-MLB75515958356_042024-O.webp'
    ]),
    category: 'INTERNACIONAL',
    team: 'Barcelona',
    league: 'La Liga',
    country: 'Espanha',
    season: '2024/25'
  },
  {
    name: 'Camisa Manchester City I 2024/25',
    slug: 'camisa-manchester-city-i-2024-25',
    description: 'Camisa oficial do Manchester City temporada 2024/25. Campeões da Premier League.',
    price: 199.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_930376-MLB75533655472_042024-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_930376-MLB75533655472_042024-O.webp'
    ]),
    category: 'INTERNACIONAL',
    team: 'Manchester City',
    league: 'Premier League',
    country: 'Inglaterra',
    season: '2024/25'
  },
  {
    name: 'Camisa Palmeiras I 2024',
    slug: 'camisa-palmeiras-i-2024',
    description: 'Camisa oficial do Palmeiras temporada 2024. Avanti Palestra! Verde tradicional.',
    price: 149.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_697568-MLB72576296681_112023-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_697568-MLB72576296681_112023-O.webp'
    ]),
    category: 'NACIONAL',
    team: 'Palmeiras',
    league: 'Brasileirão',
    country: 'Brasil',
    state: 'SP',
    city: 'São Paulo',
    season: '2024'
  },
  {
    name: 'Camisa Santos Retrô 1962',
    slug: 'camisa-santos-retro-1962',
    description: 'Camisa retrô do Santos da era Pelé. Edição especial comemorativa do bicampeonato mundial.',
    price: 169.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_666494-MLB52325820574_112022-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_666494-MLB52325820574_112022-O.webp'
    ]),
    category: 'RETRO',
    team: 'Santos',
    league: 'Brasileirão',
    country: 'Brasil',
    state: 'SP',
    city: 'Santos',
    season: '1962'
  },
  {
    name: 'Camisa Seleção Brasileira I 2024',
    slug: 'camisa-selecao-brasileira-i-2024',
    description: 'Camisa oficial da Seleção Brasileira 2024. A canarinho, a camisa mais bonita do mundo.',
    price: 219.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_825074-MLB72578199829_112023-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_825074-MLB72578199829_112023-O.webp'
    ]),
    category: 'SELECAO',
    team: 'Brasil',
    country: 'Brasil',
    season: '2024'
  },
  {
    name: 'Camisa Liverpool I 2024/25',
    slug: 'camisa-liverpool-i-2024-25',
    description: 'Camisa oficial do Liverpool temporada 2024/25. You Will Never Walk Alone!',
    price: 189.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_659951-MLB75486700552_042024-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_659951-MLB75486700552_042024-O.webp'
    ]),
    category: 'INTERNACIONAL',
    team: 'Liverpool',
    league: 'Premier League',
    country: 'Inglaterra',
    season: '2024/25'
  },
  {
    name: 'Camisa São Paulo I 2024',
    slug: 'camisa-sao-paulo-i-2024',
    description: 'Camisa oficial do São Paulo FC temporada 2024. Tricolor paulista, tradição e glória.',
    price: 139.90,
    images: JSON.stringify([
      'https://images.mlstatic.com/D_NQ_NP_936093-MLB72642477381_112023-F.webp',
      'https://images.mlstatic.com/D_NQ_NP_936093-MLB72642477381_112023-O.webp'
    ]),
    category: 'NACIONAL',
    team: 'São Paulo',
    league: 'Brasileirão',
    country: 'Brasil',
    state: 'SP',
    city: 'São Paulo',
    season: '2024'
  }
];

async function seed() {
  console.log('🌱 Iniciando seed...');

  // Limpar dados existentes (ordem importante por causa das foreign keys)
  await prisma.stockAlert.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderLink.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@camisadeelite.com',
      password: 'admin123', // Em produção, usar hash
      role: 'ADMIN'
    }
  });
  console.log('✅ Usuário admin criado:', admin.email);

  // Criar produtos com estoque
  for (const productData of products) {
    const product = await prisma.product.create({ data: productData });

    // Criar estoque para cada produto
    const stockData = {
      P: Math.floor(Math.random() * 15) + 5,
      M: Math.floor(Math.random() * 20) + 10,
      G: Math.floor(Math.random() * 20) + 10,
      GG: Math.floor(Math.random() * 10) + 3
    };

    await prisma.inventory.create({
      data: {
        productId: product.id,
        stock: JSON.stringify(stockData),
        lowStockThreshold: 5
      }
    });

    console.log('✅ Produto criado:', product.name);
  }

  console.log('');
  console.log('🎉 Seed concluído com sucesso!');
  console.log(`   📦 ${products.length} produtos criados`);
  console.log('   👤 1 usuário admin criado');
}

seed()
  .catch(e => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
