import { prisma } from './config/prisma.js';
import bcrypt from 'bcryptjs';

// Imagem padrão: Camisa do Brasil
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop';
const BRASIL_FRONT = 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&h=800&fit=crop';
const BRASIL_BACK = 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=800&fit=crop';

const products = [
  {
    name: 'Camisa Flamengo I 2024',
    slug: 'camisa-flamengo-i-2024',
    description: 'Camisa do Flamengo temporada 2024. Material de alta qualidade, tecido respirável.',
    price: 149.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_661890-MLA54200771498_032023-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_661890-MLA54200771498_032023-O.webp'
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
    description: 'Camisa do Corinthians temporada 2024. Tradição e qualidade em cada detalhe.',
    price: 139.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_904612-MLA72569671498_112023-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_904612-MLA72569671498_112023-O.webp'
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
    description: 'Camisa do Real Madrid temporada 2024/25. Design clássico em branco.',
    price: 189.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_664742-MLA74851920945_032024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_664742-MLA74851920945_032024-O.webp'
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
    description: 'Camisa do Barcelona temporada 2024/25. Design clássico blaugrana.',
    price: 179.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_677609-MLA75515929841_042024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_677609-MLA75515929841_042024-O.webp'
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
    description: 'Camisa do Manchester City temporada 2024/25. Azul celeste tradicional.',
    price: 199.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_986498-MLA75533619633_042024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_986498-MLA75533619633_042024-O.webp'
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
    description: 'Camisa do Palmeiras temporada 2024. Verde tradicional.',
    price: 149.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_645816-MLA72576252113_112023-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_645816-MLA72576252113_112023-O.webp'
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
    name: 'Camisa Santos Retrô',
    slug: 'camisa-santos-retro-pele',
    description: 'Camisa retrô do Santos. Estilo clássico dos anos dourados.',
    price: 169.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_862617-MLB52325820573_112022-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_862617-MLB52325820573_112022-O.webp'
    ]),
    category: 'RETRO',
    team: 'Santos',
    league: 'Brasileirão',
    country: 'Brasil',
    state: 'SP',
    city: 'Santos',
    season: 'Retrô'
  },
  {
    name: 'Camisa Seleção Brasileira I 2024',
    slug: 'camisa-selecao-brasileira-i-2024',
    description: 'Camisa da Seleção Brasileira 2024. A canarinho em amarelo vibrante.',
    price: 219.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp'
    ]),
    category: 'SELECAO',
    team: 'Brasil',
    country: 'Brasil',
    season: '2024'
  },
  {
    name: 'Camisa Liverpool I 2024/25',
    slug: 'camisa-liverpool-i-2024-25',
    description: 'Camisa do Liverpool temporada 2024/25. Vermelho tradicional.',
    price: 189.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_756987-MLA75486667417_042024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_756987-MLA75486667417_042024-O.webp'
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
    description: 'Camisa do São Paulo FC temporada 2024. Tricolor paulista.',
    price: 139.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_870659-MLA72642433681_112023-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_870659-MLA72642433681_112023-O.webp'
    ]),
    category: 'NACIONAL',
    team: 'São Paulo',
    league: 'Brasileirão',
    country: 'Brasil',
    state: 'SP',
    city: 'São Paulo',
    season: '2024'
  },
  {
    name: 'Camisa Juventus I 2024/25',
    slug: 'camisa-juventus-i-2024-25',
    description: 'Camisa da Juventus temporada 2024/25. Design em preto e branco.',
    price: 179.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_810988-MLA75523632849_042024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_810988-MLA75523632849_042024-O.webp'
    ]),
    category: 'INTERNACIONAL',
    team: 'Juventus',
    league: 'Serie A',
    country: 'Itália',
    season: '2024/25'
  },
  {
    name: 'Camisa Argentina I 2024',
    slug: 'camisa-argentina-i-2024',
    description: 'Camisa da Seleção Argentina 2024. Design albiceleste tradicional.',
    price: 199.90,
    images: JSON.stringify([
      'https://http2.mlstatic.com/D_NQ_NP_991685-MLA75490709193_042024-O.webp',
      'https://http2.mlstatic.com/D_NQ_NP_991685-MLA75490709193_042024-O.webp'
    ]),
    category: 'SELECAO',
    team: 'Argentina',
    country: 'Argentina',
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
  await prisma.cartReservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.size.deleteMany();
  await prisma.sizeGroup.deleteMany();
  await prisma.category.deleteMany();
  await prisma.productType.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // ========================================
  // GRUPOS DE TAMANHO (SizeGroup + Size)
  // ========================================
  const masculinoGroup = await prisma.sizeGroup.create({
    data: {
      name: 'Masculino',
      slug: 'masculino',
      sizes: {
        create: [
          { label: 'P',   sortOrder: 1, comprimento: '69-71', largura: '53-55', altura: '162-170', peso: '50-62' },
          { label: 'M',   sortOrder: 2, comprimento: '71-73', largura: '55-57', altura: '170-176', peso: '62-78' },
          { label: 'G',   sortOrder: 3, comprimento: '73-75', largura: '57-58', altura: '176-182', peso: '78-83' },
          { label: 'XL',  sortOrder: 4, comprimento: '75-78', largura: '58-60', altura: '182-190', peso: '83-90' },
          { label: '2XL', sortOrder: 5, comprimento: '78-81', largura: '60-62', altura: '190-195', peso: '90-97' },
          { label: '3XL', sortOrder: 6, comprimento: '81-83', largura: '62-64', altura: '195-197', peso: '97-104' },
          { label: '4XL', sortOrder: 7, comprimento: '83-85', largura: '64-65', altura: '197-200', peso: '104-110' },
        ]
      }
    }
  });
  console.log('✅ Grupo de tamanhos Masculino criado');

  const femininoGroup = await prisma.sizeGroup.create({
    data: {
      name: 'Feminino',
      slug: 'feminino',
      sizes: {
        create: [
          { label: 'P',   sortOrder: 1, comprimento: '60-62', largura: '44-46', altura: '155-162', peso: '45-52' },
          { label: 'M',   sortOrder: 2, comprimento: '62-64', largura: '46-48', altura: '162-168', peso: '52-60' },
          { label: 'G',   sortOrder: 3, comprimento: '64-66', largura: '48-50', altura: '168-174', peso: '60-68' },
          { label: 'XL',  sortOrder: 4, comprimento: '66-68', largura: '50-52', altura: '174-180', peso: '68-76' },
          { label: '2XL', sortOrder: 5, comprimento: '68-70', largura: '52-54', altura: '180-185', peso: '76-84' },
          { label: '3XL', sortOrder: 6, comprimento: '70-72', largura: '54-56', altura: '185-190', peso: '84-92' },
          { label: '4XL', sortOrder: 7, comprimento: '72-74', largura: '56-58', altura: '190-195', peso: '92-100' },
        ]
      }
    }
  });
  console.log('✅ Grupo de tamanhos Feminino criado');

  // ========================================
  // CATEGORIAS
  // ========================================
  const categoryMap = {};
  const categories = [
    { name: 'Nacional',      slug: 'nacional',      emoji: '🇧🇷', sortOrder: 1 },
    { name: 'Internacional', slug: 'internacional', emoji: '🌍', sortOrder: 2 },
    { name: 'Seleção',      slug: 'selecao',       emoji: '⭐', sortOrder: 3 },
    { name: 'Retrô',        slug: 'retro',         emoji: '🏆', sortOrder: 4 },
  ];
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug.toUpperCase()] = created.id;
  }
  // Map legacy values
  categoryMap['NACIONAL'] = categoryMap['NACIONAL'] || categoryMap['nacional'.toUpperCase()];
  categoryMap['INTERNACIONAL'] = categoryMap['INTERNACIONAL'] || categoryMap['internacional'.toUpperCase()];
  categoryMap['SELECAO'] = categoryMap['SELECAO'] || categoryMap['selecao'.toUpperCase()];
  categoryMap['RETRO'] = categoryMap['RETRO'] || categoryMap['retro'.toUpperCase()];
  console.log('✅ Categorias criadas');

  // ========================================
  // TIPOS DE PRODUTO
  // ========================================
  const masculinoType = await prisma.productType.create({
    data: { name: 'Masculina', slug: 'masculina', sortOrder: 1 }
  });
  await prisma.productType.create({
    data: { name: 'Feminina', slug: 'feminina', sortOrder: 2 }
  });
  await prisma.productType.create({
    data: { name: 'Unissex', slug: 'unissex', sortOrder: 3 }
  });
  console.log('✅ Tipos de produto criados');

  // Criar usuário admin com senha criptografada
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@camisadeelite.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('✅ Usuário admin criado:', admin.email);

  // Criar produtos com estoque
  for (const productData of products) {
    // Mapear category string legada para categoryId
    const legacyCategory = productData.category;
    const categoryId = categoryMap[legacyCategory] || null;

    const product = await prisma.product.create({
      data: {
        ...productData,
        categoryId: categoryId,
        productTypeId: masculinoType.id,
        sizeGroupId: masculinoGroup.id,
      }
    });

    // Criar estoque para cada produto (P, M, G, GG, XG)
    // Criar estoque para cada produto (P, M, G, XL, 2XL, 3XL, 4XL)
    const stockData = {
      P: Math.floor(Math.random() * 15) + 5,
      M: Math.floor(Math.random() * 20) + 10,
      G: Math.floor(Math.random() * 20) + 10,
      XL: Math.floor(Math.random() * 10) + 3,
      '2XL': Math.floor(Math.random() * 8) + 2,
      '3XL': Math.floor(Math.random() * 5) + 1,
      '4XL': Math.floor(Math.random() * 3)
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
