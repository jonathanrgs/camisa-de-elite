import { prisma } from '../config/prisma.js';

const couponController = {
  // Lista todos os cupons
  async list(req, res) {
    try {
      const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' }
      });
      // Adiciona campo redemptions (usos) se existir CouponRedemption
      // (opcional: pode ser ajustado para contar redemptions por cupom)
      res.json(coupons);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar cupons.' });
    }
  },

  // Ativa/Inativa cupom
  async toggleActive(req, res) {
    try {
      const { id } = req.params;
      const coupon = await prisma.coupon.findUnique({ where: { id } });
      if (!coupon) return res.status(404).json({ error: 'Cupom não encontrado.' });
      const updated = await prisma.coupon.update({ where: { id }, data: { isActive: !coupon.isActive } });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar status do cupom.' });
    }
  },

  // Cria um novo cupom
  async create(req, res) {
    try {
      const { code, discount, type, expiresAt, maxUses } = req.body;
      if (!code || !discount || !type) return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
      const data = {
        code: code.toUpperCase(),
        type,
        value: Number(discount),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUses: maxUses ? Number(maxUses) : null
      };
      const exists = await prisma.coupon.findUnique({ where: { code: data.code } });
      if (exists) return res.status(400).json({ error: 'Já existe um cupom com esse código.' });
      const coupon = await prisma.coupon.create({ data });
      res.status(201).json(coupon);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar cupom.' });
    }
  },

  // Atualiza um cupom existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const { code, discount, type, expiresAt, maxUses } = req.body;
      const data = {
        code: code?.toUpperCase(),
        type,
        value: Number(discount),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUses: maxUses ? Number(maxUses) : null
      };
      const coupon = await prisma.coupon.update({ where: { id: Number(id) }, data });
      res.json(coupon);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar cupom.' });
    }
  },

  // Remove um cupom
  async remove(req, res) {
    try {
      const { id } = req.params;
      await prisma.coupon.delete({ where: { id: Number(id) } });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover cupom.' });
    }
  },
  // Valida cupom pelo código e regras
  async validate(req, res) {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, reason: 'Informe o código do cupom.' });
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon) return res.status(404).json({ valid: false, reason: 'Cupom inválido.' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ valid: false, reason: 'Cupom expirado.' });
    if (coupon.minTotal && cartTotal < coupon.minTotal) return res.status(400).json({ valid: false, reason: `Valor mínimo de R$ ${coupon.minTotal}` });
    // TODO: checar maxUses, maxUsesPerUser, etc.
    return res.json({ valid: true, coupon });
  },

  // Aplica cupom e retorna desconto calculado
  async apply(req, res) {
    const { coupon, cartTotal, shipping } = req.body;
    if (!coupon) return res.status(400).json({ error: 'Cupom não informado.' });
    let discount = 0;
    let newShipping = shipping;
    let total = cartTotal;
    if (coupon.type === 'percent') {
      discount = (cartTotal * coupon.value) / 100;
      total = cartTotal - discount;
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
      total = Math.max(0, cartTotal - discount);
    } else if (coupon.type === 'free_shipping') {
      newShipping = 0;
    }
    return res.json({ discount, total, shipping: newShipping });
  }
};

export default couponController;
