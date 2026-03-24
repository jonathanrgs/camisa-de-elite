import { prisma } from '../config/prisma.js';

export const productTypeController = {
  // ========================
  // PÚBLICO
  // ========================

  // GET /api/product-types — lista tipos ativos
  async listPublic(req, res) {
    const types = await prisma.productType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json({ data: types });
  },

  // ========================
  // ADMIN
  // ========================

  // GET /api/admin/product-types — lista todos
  async listAll(req, res) {
    const types = await prisma.productType.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' }
    });
    res.json({ data: types });
  },

  // POST /api/admin/product-types
  async create(req, res) {
    const { name, sortOrder } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await prisma.productType.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'Já existe um tipo com este nome' });
    }

    const maxSort = await prisma.productType.findFirst({ orderBy: { sortOrder: 'desc' } });
    const type = await prisma.productType.create({
      data: {
        name,
        slug,
        sortOrder: sortOrder ?? (maxSort ? maxSort.sortOrder + 1 : 1)
      }
    });
    res.status(201).json({ data: type });
  },

  // PUT /api/admin/product-types/:id
  async update(req, res) {
    const { id } = req.params;
    const { name, isActive, sortOrder } = req.body;

    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (isActive !== undefined) data.isActive = isActive;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const type = await prisma.productType.update({
      where: { id },
      data,
      include: { _count: { select: { products: true } } }
    });
    res.json({ data: type });
  },

  // DELETE /api/admin/product-types/:id
  async delete(req, res) {
    const { id } = req.params;
    const count = await prisma.product.count({ where: { productTypeId: id } });
    if (count > 0) {
      return res.status(400).json({
        error: `Não é possível excluir: ${count} produto(s) usam este tipo`
      });
    }
    await prisma.productType.delete({ where: { id } });
    res.json({ message: 'Tipo de produto excluído' });
  }
};
