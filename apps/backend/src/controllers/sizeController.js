import { prisma } from '../config/prisma.js';

export const sizeController = {
  // ========================
  // PÚBLICO
  // ========================

  // GET /api/size-groups — lista grupos ativos com tamanhos ativos
  async listPublic(req, res) {
    const groups = await prisma.sizeGroup.findMany({
      where: { isActive: true },
      include: {
        sizes: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json({ data: groups });
  },

  // GET /api/size-groups/:id — detalhe público de um grupo
  async getPublic(req, res) {
    const { id } = req.params;
    const group = await prisma.sizeGroup.findUnique({
      where: { id },
      include: {
        sizes: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    if (!group || !group.isActive) {
      return res.status(404).json({ error: 'Grupo de tamanhos não encontrado' });
    }
    res.json({ data: group });
  },

  // ========================
  // ADMIN
  // ========================

  // GET /api/admin/size-groups — lista todos os grupos (admin)
  async listAll(req, res) {
    const groups = await prisma.sizeGroup.findMany({
      include: {
        sizes: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json({ data: groups });
  },

  // POST /api/admin/size-groups — criar grupo
  async createGroup(req, res) {
    const { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    const groupSlug = slug || name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await prisma.sizeGroup.findUnique({ where: { slug: groupSlug } });
    if (existing) {
      return res.status(400).json({ error: 'Já existe um grupo com este nome/slug' });
    }

    const group = await prisma.sizeGroup.create({
      data: { name, slug: groupSlug },
      include: { sizes: true }
    });
    res.status(201).json({ data: group });
  },

  // PUT /api/admin/size-groups/:id — atualizar grupo
  async updateGroup(req, res) {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (isActive !== undefined) data.isActive = isActive;

    const group = await prisma.sizeGroup.update({
      where: { id },
      data,
      include: {
        sizes: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { products: true } }
      }
    });
    res.json({ data: group });
  },

  // DELETE /api/admin/size-groups/:id — deletar grupo (só se sem produtos)
  async deleteGroup(req, res) {
    const { id } = req.params;
    const count = await prisma.product.count({ where: { sizeGroupId: id } });
    if (count > 0) {
      return res.status(400).json({
        error: `Não é possível excluir: ${count} produto(s) usam este grupo de tamanhos`
      });
    }
    await prisma.sizeGroup.delete({ where: { id } });
    res.json({ message: 'Grupo de tamanhos excluído' });
  },

  // POST /api/admin/size-groups/:id/sizes — adicionar tamanho ao grupo
  async createSize(req, res) {
    const { id } = req.params;
    const { label, sortOrder, comprimento, largura, altura, peso } = req.body;
    if (!label) {
      return res.status(400).json({ error: 'Label é obrigatório' });
    }

    const existing = await prisma.size.findUnique({
      where: { sizeGroupId_label: { sizeGroupId: id, label } }
    });
    if (existing) {
      return res.status(400).json({ error: `Tamanho "${label}" já existe neste grupo` });
    }

    const maxSort = await prisma.size.findFirst({
      where: { sizeGroupId: id },
      orderBy: { sortOrder: 'desc' }
    });

    const size = await prisma.size.create({
      data: {
        sizeGroupId: id,
        label,
        sortOrder: sortOrder ?? (maxSort ? maxSort.sortOrder + 1 : 1),
        comprimento,
        largura,
        altura,
        peso
      }
    });
    res.status(201).json({ data: size });
  },

  // PUT /api/admin/sizes/:id — atualizar tamanho individual
  async updateSize(req, res) {
    const { id } = req.params;
    const { label, sortOrder, comprimento, largura, altura, peso, isActive } = req.body;

    const data = {};
    if (label !== undefined) data.label = label;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (comprimento !== undefined) data.comprimento = comprimento;
    if (largura !== undefined) data.largura = largura;
    if (altura !== undefined) data.altura = altura;
    if (peso !== undefined) data.peso = peso;
    if (isActive !== undefined) data.isActive = isActive;

    const size = await prisma.size.update({ where: { id }, data });
    res.json({ data: size });
  },

  // DELETE /api/admin/sizes/:id — remover tamanho
  async deleteSize(req, res) {
    const { id } = req.params;
    await prisma.size.delete({ where: { id } });
    res.json({ message: 'Tamanho excluído' });
  },

  // PUT /api/admin/size-groups/:id/sizes/reorder — reordenar tamanhos
  async reorderSizes(req, res) {
    const { sizes } = req.body; // [{ id, sortOrder }]
    if (!Array.isArray(sizes)) {
      return res.status(400).json({ error: 'Array de tamanhos é obrigatório' });
    }
    await prisma.$transaction(
      sizes.map(s => prisma.size.update({
        where: { id: s.id },
        data: { sortOrder: s.sortOrder }
      }))
    );
    res.json({ message: 'Ordem atualizada' });
  }
};
