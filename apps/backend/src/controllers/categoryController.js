import { prisma } from '../config/prisma.js';

export const categoryController = {
  // ========================
  // PÚBLICO
  // ========================

  // GET /api/categories — lista categorias ativas
  async listPublic(req, res) {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json({ data: categories });
  },

  // ========================
  // ADMIN
  // ========================

  // GET /api/admin/categories — lista todas
  async listAll(req, res) {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' }
    });
    res.json({ data: categories });
  },

  // POST /api/admin/categories
  async create(req, res) {
    const { name, emoji, sortOrder } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'Já existe uma categoria com este nome' });
    }

    const maxSort = await prisma.category.findFirst({ orderBy: { sortOrder: 'desc' } });
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        emoji: emoji || null,
        sortOrder: sortOrder ?? (maxSort ? maxSort.sortOrder + 1 : 1)
      }
    });
    res.status(201).json({ data: category });
  },

  // PUT /api/admin/categories/:id
  async update(req, res) {
    const { id } = req.params;
    const { name, emoji, isActive, sortOrder } = req.body;

    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (emoji !== undefined) data.emoji = emoji;
    if (isActive !== undefined) data.isActive = isActive;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const category = await prisma.category.update({
      where: { id },
      data,
      include: { _count: { select: { products: true } } }
    });
    res.json({ data: category });
  },

  // DELETE /api/admin/categories/:id
  async delete(req, res) {
    const { id } = req.params;
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return res.status(400).json({
        error: `Não é possível excluir: ${count} produto(s) usam esta categoria`
      });
    }
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Categoria excluída' });
  }
};
