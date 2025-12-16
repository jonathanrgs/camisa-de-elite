// Serviço de cupons para validação e cálculo de desconto
// Exemplo simples: cupons hardcoded

const coupons = [
  {
    code: 'ELITE10',
    type: 'percent', // ou 'fixed'
    value: 10, // 10% de desconto
    minTotal: 0,
    expires: '2025-12-31',
  },
  {
    code: 'FRETEGRATIS',
    type: 'free_shipping',
    value: 0,
    minTotal: 100,
    expires: '2025-12-31',
  },
];

export function validateCoupon(code, cartTotal) {
  const coupon = coupons.find(c => c.code === code.toUpperCase());
  if (!coupon) return { valid: false, reason: 'Cupom inválido.' };
  if (coupon.minTotal && cartTotal < coupon.minTotal) return { valid: false, reason: `Valor mínimo de R$ ${coupon.minTotal}` };
  if (coupon.expires && new Date() > new Date(coupon.expires)) return { valid: false, reason: 'Cupom expirado.' };
  return { valid: true, coupon };
}

export function applyCoupon(coupon, cartTotal, shipping) {
  if (coupon.type === 'percent') {
    const discount = (cartTotal * coupon.value) / 100;
    return { discount, total: cartTotal - discount, shipping };
  }
  if (coupon.type === 'fixed') {
    const discount = coupon.value;
    return { discount, total: Math.max(0, cartTotal - discount), shipping };
  }
  if (coupon.type === 'free_shipping') {
    return { discount: 0, total: cartTotal, shipping: 0 };
  }
  return { discount: 0, total: cartTotal, shipping };
}
