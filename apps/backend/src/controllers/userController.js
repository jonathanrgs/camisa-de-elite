import { prisma } from '../config/prisma.js';

// Listar pedidos do usuário
export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

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

    res.json({ orders: ordersWithParsedImages });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
};

// Obter detalhes de um pedido
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { 
        id,
        userId: req.user.id 
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Parse images JSON
    const orderWithParsedImages = {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: JSON.parse(item.product.images || '[]')
        }
      }))
    };

    res.json({ order: orderWithParsedImages });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
};

// Criar pedido (a partir do carrinho)
export const createOrder = async (req, res) => {
  try {
    const { items, address, city, state, zipCode, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // Calcular total e validar produtos
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(400).json({ error: `Produto não encontrado: ${item.productId}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        size: item.size,
        quantity: item.quantity,
        unitPrice: product.price,
        customName: item.customName,
        customNumber: item.customNumber
      });
    }

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        customerName: req.user.name || 'Cliente',
        customerPhone: req.user.phone || '',
        customerEmail: req.user.email,
        totalAmount,
        address: address || req.user.address,
        city: city || req.user.city,
        state: state || req.user.state,
        zipCode: zipCode || req.user.zipCode,
        notes,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.status(201).json({ 
      message: 'Pedido criado com sucesso',
      order 
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

// Listar avaliações do usuário
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Parse images JSON
    const reviewsWithParsedImages = reviews.map(review => ({
      ...review,
      product: {
        ...review.product,
        images: JSON.parse(review.product.images || '[]')
      }
    }));

    res.json({ reviews: reviewsWithParsedImages });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
};

// Criar avaliação
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ error: 'Produto e nota são obrigatórios' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Nota deve ser entre 1 e 5' });
    }

    // Verificar se produto existe
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Verificar se usuário já avaliou este produto
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: req.user.id
      }
    });

    if (existingReview) {
      // Atualizar avaliação existente
      const review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment,
          isApproved: false // Volta para moderação
        }
      });
      return res.json({ message: 'Avaliação atualizada', review });
    }

    // Criar nova avaliação
    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        authorName: req.user.name || 'Cliente',
        rating,
        comment,
        isApproved: false
      }
    });

    res.status(201).json({ message: 'Avaliação enviada para moderação', review });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
};

// Obter produtos que o usuário pode avaliar (pedidos entregues sem avaliação)
export const getProductsToReview = async (req, res) => {
  try {
    // Buscar pedidos entregues do usuário
    const deliveredOrders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
        status: 'ENTREGUE'
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true
              }
            }
          }
        }
      }
    });

    // Buscar avaliações existentes do usuário
    const existingReviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      select: { productId: true }
    });

    const reviewedProductIds = new Set(existingReviews.map(r => r.productId));

    // Filtrar produtos não avaliados
    const productsToReview = [];
    for (const order of deliveredOrders) {
      for (const item of order.items) {
        if (!reviewedProductIds.has(item.product.id)) {
          productsToReview.push({
            ...item.product,
            images: JSON.parse(item.product.images || '[]'),
            orderId: order.id,
            orderDate: order.createdAt
          });
          reviewedProductIds.add(item.product.id); // Evitar duplicatas
        }
      }
    }

    res.json({ products: productsToReview });
  } catch (error) {
    console.error('Erro ao buscar produtos para avaliar:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};
