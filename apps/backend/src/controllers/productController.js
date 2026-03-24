import { prisma } from '../config/prisma.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/apiResponse.js';
import { slugify } from '../utils/slugify.js';

export const productController = {
  // GET /api/products
  async list(req, res) {
    const { q, category, state, city, page = 1, pageSize = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    // Construir filtro apenas com valores válidos
    const where = {
      isActive: true
    };

    // Apenas adicionar filtros se os valores existirem e não forem "undefined"
    if (category && category !== 'undefined') {
      where.category = category;
    }
    if (state && state !== 'undefined') {
      where.state = state;
    }
    if (city && city !== 'undefined') {
      where.city = city;
    }
    
    // Busca textual (SQLite não suporta mode: insensitive)
    if (q && q !== 'undefined' && q.trim() !== '') {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { team: { contains: q } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          inventory: true,
          reviews: {
            where: { isApproved: true },
            select: { rating: true }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    // Parse images JSON string e calcular média de avaliações
    const parsedItems = items.map(item => {
      const reviews = item.reviews || [];
      const avgRating = reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0;
      
      return {
        ...item,
        images: item.images ? JSON.parse(item.images) : [],
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        reviews: undefined // Remove reviews array da resposta
      };
    });

    return paginatedResponse(res, parsedItems, total, Number(page), take);
  },

  // GET /api/products/:slug
  async getBySlug(req, res) {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        inventory: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product || !product.isActive) {
      return errorResponse(res, 'Produto não encontrado', 'PRODUCT_NOT_FOUND', 404);
    }

    // Parse images JSON
    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      stock: product.inventory?.stock ? JSON.parse(product.inventory.stock) : {}
    };

    return successResponse(res, parsedProduct);
  },

  // POST /api/admin/products
  async create(req, res) {
    const { name, description, price, category, state, city, country, league, team, season, images } = req.body;
    const slug = slugify(name);

    const product = await prisma.product.create({
      data: { 
        name, 
        slug, 
        description, 
        price, 
        category, 
        state, 
        city, 
        country,
        league, 
        team,
        season,
        images: images ? JSON.stringify(images) : '[]'
      }
    });

    return successResponse(res, product, 201);
  },

  // PUT /api/admin/products/:id
  async update(req, res) {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.name) {
      data.slug = slugify(data.name);
    }

    if (data.images && Array.isArray(data.images)) {
      data.images = JSON.stringify(data.images);
    }

    const product = await prisma.product.update({ where: { id }, data });
    return successResponse(res, product);
  },

  // DELETE /api/admin/products/:id (exclusão permanente)
  async delete(req, res) {
    const { id } = req.params;

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return errorResponse(res, 'Produto não encontrado', 'PRODUCT_NOT_FOUND', 404);
    }

    // Usar transação para remover registros dependentes e o produto
    await prisma.$transaction(async (tx) => {
      // Remover itens de pedidos que referenciam este produto
      await tx.orderItem.deleteMany({ where: { productId: id } });
      // Remover reservas de carrinho
      await tx.cartReservation.deleteMany({ where: { productId: id } });
      // Deletar o produto (cascade remove inventory, reviews, alerts)
      await tx.product.delete({ where: { id } });
    });

    return successResponse(res, { message: 'Produto excluído permanentemente' });
  }
};
