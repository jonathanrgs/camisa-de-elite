// Exclusão definitiva de produto
export const deleteProductPermanent = async (req, res) => {
  try {
    const { id } = req.params;
    // Remove o produto do banco de dados
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Produto excluído permanentemente com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir permanentemente produto:', error);
    res.status(500).json({ error: 'Erro ao excluir permanentemente produto' });
  }
};
// ========================
// FRETE (SHIPPING CONFIG)
// ========================

// Buscar configuração de frete (sempre retorna a mais recente)
export const getShippingConfig = async (req, res) => {
  try {
    const configs = await prisma.shippingConfig.findMany();
    if (!configs.length) {
      return res.json({ config: null });
    }
    // Sempre retorna o primeiro (único)
    const config = configs[0];
    res.json({
      config: {
        id: config.id,
        freeShippingMin: config.freeShippingMin,
        fixedShipping: config.fixedShipping,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt
      }
    });
  } catch (error) {
    console.error('Erro ao buscar config de frete:', error);
    res.status(500).json({ error: 'Erro ao buscar configuração de frete' });
  }
};

// Salvar/atualizar configuração de frete (sempre cria nova versão)
export const saveShippingConfig = async (req, res) => {
  try {
    const { freeShippingMin, fixedShipping, cityRules, originCep, originNumber, radiusKm } = req.body;
    // Remove todos os registros existentes
    await prisma.shippingConfig.deleteMany();
    // Cria o novo registro
    const config = await prisma.shippingConfig.create({
      data: {
        freeShippingMin: parseFloat(freeShippingMin),
        fixedShipping: parseFloat(fixedShipping),
        cityRules: JSON.stringify(cityRules || []),
        originCep,
        originNumber,
        radiusKm: radiusKm ? parseInt(radiusKm) : null
      }
    });
    res.status(201).json({ message: 'Configuração de frete salva', config: {
      id: config.id,
      freeShippingMin: config.freeShippingMin,
      fixedShipping: config.fixedShipping,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt
    }});
  } catch (error) {
    console.error('Erro ao salvar config de frete:', error);
    res.status(500).json({ error: 'Erro ao salvar configuração de frete' });
  }
};
import { prisma } from '../config/prisma.js';

// ========================
// PRODUTOS
// ========================

// Listar todos os produtos (com paginação)
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { team: { contains: search } },
        { description: { contains: search } }
      ];
    }
    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          inventory: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    // Parse images JSON e inventory.stock para objeto
    const productsWithParsed = products.map(p => {
      let images = [];
      try { images = JSON.parse(p.images || '[]'); } catch { images = []; }
      let inventory = null;
      if (p.inventory) {
        let stock = {};
        try { stock = JSON.parse(p.inventory.stock || '{}'); } catch { stock = {}; }
        inventory = { ...p.inventory, stock };
      }
      return { ...p, images, inventory };
    });

    res.json({
      products: productsWithParsed,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

// Criar produto
export const createProduct = async (req, res) => {
  try {
    const { 
      name, slug, description, price, images, 
      category, team, league, country, state, city, season,
      stock 
    } = req.body;

    if (!name || !price || !category || !team) {
      return res.status(400).json({ error: 'Nome, preço, categoria e time são obrigatórios' });
    }

    // Gerar slug se não fornecido
    const productSlug = slug || name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Verificar se slug já existe
    const existingProduct = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (existingProduct) {
      return res.status(400).json({ error: 'Já existe um produto com este slug' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description,
        price: parseFloat(price),
        images: JSON.stringify(images || []),
        category,
        team,
        league,
        country,
        state,
        city,
        season
      }
    });

    // Criar inventário
    await prisma.inventory.create({
      data: {
        productId: product.id,
        stock: JSON.stringify(stock || { P: 0, M: 0, G: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0 }),
        lowStockThreshold: 5
      }
    });

    res.status(201).json({ 
      message: 'Produto criado com sucesso',
      product: {
        ...product,
        images: images || []
      }
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// Atualizar produto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, description, price, images, 
      category, team, league, country, state, city, season,
      isActive, stock 
    } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        images: images ? JSON.stringify(images) : undefined,
        category,
        team,
        league,
        country,
        state,
        city,
        season,
        isActive
      }
    });

    // Atualizar estoque se fornecido
    if (stock) {
      await prisma.inventory.upsert({
        where: { productId: id },
        update: { stock: JSON.stringify(stock) },
        create: {
          productId: id,
          stock: JSON.stringify(stock),
          lowStockThreshold: 5
        }
      });
    }

    res.json({ 
      message: 'Produto atualizado',
      product: {
        ...product,
        images: JSON.parse(product.images || '[]')
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// Deletar produto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({ where: { id }, data: { isActive: false } });
    res.json({ message: 'Produto excluído (soft delete) com sucesso', product });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
};

// Exportar produtos para CSV
export const exportProductsCSV = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { inventory: true },
      orderBy: { name: 'asc' }
    });

    // Cabeçalho CSV
    const headers = [
      'ID', 'Nome', 'Slug', 'Descrição', 'Preço', 'Categoria', 
      'Time', 'Liga', 'País', 'Estado', 'Cidade', 'Temporada',
      'Ativo', 'Estoque P', 'Estoque M', 'Estoque G', 'Estoque XL', 'Estoque 2XL', 'Estoque 3XL', 'Estoque 4XL',
      'Criado em'
    ];

    const rows = products.map(p => {
      const stock = p.inventory ? JSON.parse(p.inventory.stock || '{}') : {};
      return [
        p.id,
        `"${p.name}"`,
        p.slug,
        `"${(p.description || '').replace(/"/g, '""')}"`,
        p.price.toFixed(2),
        p.category,
        p.team,
        p.league || '',
        p.country || '',
        p.state || '',
        p.city || '',
        p.season || '',
        p.isActive ? 'Sim' : 'Não',
        stock.P || 0,
        stock.M || 0,
        stock.G || 0,
        stock.XL || 0,
        stock['2XL'] || 0,
        stock['3XL'] || 0,
        stock['4XL'] || 0,
        p.createdAt.toISOString().split('T')[0]
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=produtos.csv');
    res.send('\uFEFF' + csv); // BOM para Excel reconhecer UTF-8
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    res.status(500).json({ error: 'Erro ao exportar produtos' });
  }
};

// ========================
// PEDIDOS
// ========================

// Listar todos os pedidos
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { customerEmail: { contains: search } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, images: true }
              }
            }
          },
          orderLink: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    // Parse images JSON
    const ordersWithParsedImages = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: JSON.parse(item.product.images || '[]')
        }
      }))
    }));

    res.json({
      orders: ordersWithParsedImages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
};

// Atualizar status do pedido
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDENTE', 'CONFIRMADO', 'EM_ROTA', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json({ message: 'Status atualizado', order });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
};

// Obter estatísticas
export const getStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      totalUsers,
      recentOrders
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDENTE' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          customerName: true,
          totalAmount: true,
          status: true,
          createdAt: true
        }
      })
    ]);

    // Calcular receita total
    const orders = await prisma.order.findMany({
      where: { status: { not: 'CANCELADO' } },
      select: { totalAmount: true }
    });
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        pendingOrders,
        totalUsers,
        totalRevenue
      },
      recentOrders
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
};

// ========================
// AVALIAÇÕES
// ========================

// Listar avaliações pendentes
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: false },
      include: {
        product: {
          select: { id: true, name: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Erro ao listar avaliações:', error);
    res.status(500).json({ error: 'Erro ao listar avaliações' });
  }
};

// Aprovar/Rejeitar avaliação
export const moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { approve } = req.body;

    if (approve) {
      const review = await prisma.review.update({
        where: { id },
        data: { isApproved: true }
      });
      res.json({ message: 'Avaliação aprovada', review });
    } else {
      await prisma.review.delete({ where: { id } });
      res.json({ message: 'Avaliação rejeitada e removida' });
    }
  } catch (error) {
    console.error('Erro ao moderar avaliação:', error);
    res.status(500).json({ error: 'Erro ao moderar avaliação' });
  }
};

// ========================
// USUÁRIOS
// ========================

// Listar todos os usuários
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        favoriteTeam: true,
        createdAt: true,
        _count: {
          select: { orders: true, reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};
