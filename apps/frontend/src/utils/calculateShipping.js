// Função utilitária para cálculo de frete consistente em todo o frontend
export function calculateShipping({ shipping, total, city, state }) {
  if (!shipping) return 0;
  // Frete grátis acima do valor mínimo
  if (shipping.freeShippingMin && Number(total) >= Number(shipping.freeShippingMin)) return 0;
  // Região de Uberaba (MG) - frete fixo
  if (
    city && state &&
    city.trim().toLowerCase() === 'uberaba' &&
    state.trim().toLowerCase() === 'mg'
  ) {
    return Number(shipping.fixedShipping) || 0;
  }
  // Se não informado cidade/estado, assume fixo (comportamento igual FloatingCart/CartPage)
  return Number(shipping.fixedShipping) || 0;
}
