import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/apiResponse.js';

export const orderController = {
  // POST /api/checkout
  async checkout(req, res) {
    const { customerName, customerPhone, customerEmail, items, address, neighborhood, number, complement, city, state, zipCode, notes, couponCode, shippingAmount } = req.body;
    // items: [{ productId, size, quantity, customName?, customNumber? }]

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return errorResponse(res, 'Dados obrigatórios faltando', 'MISSING_DATA', 400);
    }

    // Calcular total e verificar estoque
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ 
        where: { id: item.productId },
        include: { inventory: true }
      });
      
      if (!product) {
        return errorResponse(res, `Produto não encontrado`, 'PRODUCT_NOT_FOUND', 404);
      }

      // Verificar estoque
      if (product.inventory) {
        const stock = JSON.parse(product.inventory.stock || '{}');
        const available = stock[item.size] || 0;
        
        if (available < item.quantity) {
          return errorResponse(res, `Estoque insuficiente para ${product.name} (${item.size})`, 'OUT_OF_STOCK', 400);
        }
      }

      orderItems.push({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        unitPrice: product.price,
        customName: item.customName || null,
        customNumber: item.customNumber || null
      });

      totalAmount += Number(product.price) * item.quantity;
    }


    // Lógica de cupom e desconto
    let coupon = null;
    let couponId = null;
    let discountAmount = 0;
    let discountedTotal = totalAmount;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (!coupon || coupon.isActive === false) {
        return errorResponse(res, 'Cupom inválido ou inativo', 'INVALID_COUPON', 400);
      }
      // Só pode usar se não expirou
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return errorResponse(res, 'Cupom expirado', 'EXPIRED_COUPON', 400);
      }
      // Checar limite global de usos
      if (coupon.maxUses !== null && coupon.maxUses !== undefined) {
        const totalRedemptions = await prisma.couponRedemption.count({ where: { couponId: coupon.id } });
        if (totalRedemptions >= coupon.maxUses) {
          return errorResponse(res, 'Limite de usos do cupom atingido', 'COUPON_MAX_USES', 400);
        }
      }
      // Checar limite por usuário
      if (coupon.maxUsesPerUser !== null && coupon.maxUsesPerUser !== undefined && req.user?.id) {
        const userRedemptions = await prisma.couponRedemption.count({ where: { couponId: coupon.id, userId: req.user.id } });
        if (userRedemptions >= coupon.maxUsesPerUser) {
          return errorResponse(res, 'Você já atingiu o limite de uso deste cupom', 'COUPON_MAX_USES_USER', 400);
        }
      }
      couponId = coupon.id;

      // Aplicar desconto
      if (coupon.type === 'percent') {
        discountAmount = (totalAmount * coupon.value) / 100;
      } else if (coupon.type === 'fixed') {
        discountAmount = coupon.value;
      } else if (coupon.type === 'free_shipping') {
        discountAmount = 0;
      }
      if (discountAmount > totalAmount) discountAmount = totalAmount;
      discountedTotal = totalAmount - discountAmount;
    }

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId: req.user?.id || null, // Associa ao usuário se estiver logado
        customerName,
        customerPhone,
        customerEmail,
        totalAmount,
        discountAmount: discountAmount > 0 ? discountAmount : null,
        discountedTotal: discountedTotal !== totalAmount ? discountedTotal : null,
        shippingAmount: typeof shippingAmount === 'number' ? shippingAmount : (shippingAmount ? Number(shippingAmount) : null),
        address,
        neighborhood,
        number,
        complement,
        city,
        state,
        zipCode,
        notes,
        couponId,
        items: { create: orderItems }
      },
      include: { items: true }
    });

    // Registrar uso do cupom
    if (couponId) {
      await prisma.couponRedemption.create({
        data: {
          couponId,
          userId: req.user?.id || null,
          orderId: order.id
        }
      });
    }

    // Gerar link com token
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + (config.orderLink?.defaultExpirationHours || 48) * 60 * 60 * 1000);

    await prisma.orderLink.create({
      data: { orderId: order.id, token, expiresAt }
    });

    // Decrementar estoque (o estoque já foi reservado pelo carrinho, então apenas confirmamos)
    for (const item of items) {
      const inventory = await prisma.inventory.findUnique({
        where: { productId: item.productId }
      });
      
      if (inventory) {
        const stock = JSON.parse(inventory.stock || '{}');
        stock[item.size] = (stock[item.size] || 0) - item.quantity;
        
        await prisma.inventory.update({
          where: { productId: item.productId },
          data: { stock: JSON.stringify(stock) }
        });
      }
    }

    // Limpar reservas do carrinho para esta sessão (sessionId é enviado opcionalmente)
    const { sessionId } = req.body;
    if (sessionId) {
      await prisma.cartReservation.deleteMany({
        where: { sessionId }
      });
    }

    return successResponse(res, { order, token, expiresAt }, 201);
  },

  // GET /api/order-link/:token
  async getByToken(req, res) {
    const { token } = req.params;

    const link = await prisma.orderLink.findUnique({
      where: { token },
      include: {
        order: {
          include: {
            items: { include: { product: true } }
          }
        }
      }
    });

    if (!link) {
      return errorResponse(res, 'Link não encontrado', 'LINK_NOT_FOUND', 404);
    }

    if (new Date() > link.expiresAt && !link.isUsed) {
      return errorResponse(res, 'Link expirado', 'LINK_EXPIRED', 410);
    }

    return successResponse(res, link);
  },

  // GET /api/whatsapp/message/:orderId
  async getWhatsAppMessage(req, res) {
    const { orderId } = req.params;

    const link = await prisma.orderLink.findUnique({ where: { orderId } });
    if (!link) {
      return errorResponse(res, 'Link não encontrado', 'LINK_NOT_FOUND', 404);
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://camisadeelite.com';
    const orderUrl = `${baseUrl}/pedido/${link.token}`;
    const message = encodeURIComponent(`Olá! Quero finalizar meu pedido: ${orderUrl}`);
    const whatsappUrl = `https://wa.me/${config.whatsapp?.number || '5511999999999'}?text=${message}`;

    return successResponse(res, { message: `Olá! Quero finalizar meu pedido: ${orderUrl}`, whatsappUrl });
  },

  // GET /api/admin/orders
  async list(req, res) {
    const { status, page = 1, pageSize = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = status ? { status } : {};

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          orderLink: true
        }
      }),
      prisma.order.count({ where })
    ]);

    return paginatedResponse(res, items, total, Number(page), take);
  },

  // GET /api/admin/orders/:id
  async getById(req, res) {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
        orderLink: true
      }
    });

    if (!order) {
      return errorResponse(res, 'Pedido não encontrado', 'ORDER_NOT_FOUND', 404);
    }

    return successResponse(res, order);
  },

  // PUT /api/admin/orders/:id/status
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDENTE', 'CONFIRMADO', 'EM_ROTA', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Status inválido', 'INVALID_STATUS', 400);
    }

    const order = await prisma.order.update({ where: { id }, data: { status } });
    return successResponse(res, order);
  },

  // POST /api/admin/orders/:id/confirm
  async confirm(req, res) {
    const { id } = req.params;

    await prisma.orderLink.update({
      where: { orderId: id },
      data: { isUsed: true }
    });

    const order = await prisma.order.update({
      where: { id },
      data: { status: 'CONFIRMADO' }
    });

    return successResponse(res, order);
  },

  // PUT /api/admin/orders/:id/expire
  async updateExpiration(req, res) {
    const { id } = req.params;
    const { hours } = req.body;

    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const link = await prisma.orderLink.update({
      where: { orderId: id },
      data: { expiresAt }
    });

    return successResponse(res, link);
  }
};
