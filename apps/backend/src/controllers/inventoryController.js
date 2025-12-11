import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const inventoryController = {
  // GET /api/products/:id/inventory
  async getByProduct(req, res) {
    const { id: productId } = req.params;

    const inventory = await prisma.inventory.findUnique({
      where: { productId }
    });

    if (!inventory) {
      return successResponse(res, { stock: {} });
    }

    // Parse JSON stock
    const parsedInventory = {
      ...inventory,
      stock: inventory.stock ? JSON.parse(inventory.stock) : {}
    };

    return successResponse(res, parsedInventory);
  },

  // PUT /api/admin/products/:id/inventory
  async update(req, res) {
    const { id: productId } = req.params;
    const { stock } = req.body; // { P: 10, M: 15, G: 20, GG: 5 }

    const inventory = await prisma.inventory.upsert({
      where: { productId },
      update: { stock: JSON.stringify(stock) },
      create: { 
        productId, 
        stock: JSON.stringify(stock),
        lowStockThreshold: 5
      }
    });

    // Verificar alertas de estoque baixo
    const stockData = stock;
    for (const [size, qty] of Object.entries(stockData)) {
      if (qty <= inventory.lowStockThreshold && qty > 0) {
        await prisma.stockAlert.create({
          data: {
            inventoryId: inventory.id,
            size,
            currentQty: qty,
            message: `Estoque baixo: ${size} com apenas ${qty} unidades`
          }
        });
      }
    }

    return successResponse(res, {
      ...inventory,
      stock: JSON.parse(inventory.stock)
    });
  },

  // POST /api/alerts/back-in-stock (simplificado)
  async createAlert(req, res) {
    const { productId, size, email } = req.body;

    // Buscar inventário
    const inventory = await prisma.inventory.findUnique({
      where: { productId }
    });

    if (!inventory) {
      return errorResponse(res, 'Produto não encontrado', 'PRODUCT_NOT_FOUND', 404);
    }

    // Criar alerta
    const alert = await prisma.stockAlert.create({
      data: { 
        inventoryId: inventory.id,
        size,
        currentQty: 0,
        message: `Alerta de volta ao estoque solicitado: ${email}`
      }
    });

    return successResponse(res, alert, 201);
  }
};
