import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon } from '../../components/ui/EyeIcon';
import { userService } from '../../services/userService';

// Imagem padrão quando o produto não tem imagens
const FALLBACK_IMG = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';

const statusColors = {
  PENDENTE: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMADO: 'bg-blue-500/20 text-blue-400',
  ENVIADO: 'bg-purple-500/20 text-purple-400',
  EM_ROTA: 'bg-orange-500/20 text-orange-400',
  ENTREGUE: 'bg-green-500/20 text-green-400',
  CANCELADO: 'bg-red-500/20 text-red-400'
};

const statusLabels = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  ENVIADO: 'Enviado',
  EM_ROTA: 'Em rota de entrega',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado'
};

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await userService.getMyOrders();
      setOrders(response.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-400 mt-2">Carregando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
        <h2 className="text-xl text-white mb-2">Nenhum pedido ainda</h2>
        <p className="text-gray-400 mb-4">Você ainda não fez nenhum pedido.</p>
        <Link to="/catalogo" className="btn-primary px-6 py-2 inline-block">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Meus Pedidos</h2>
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        return (
          <div key={order.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm">Pedido #{order.id.slice(0, 8)}</p>
                <p className="text-white">
                  {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                <button
                  className="ml-2 text-eliteGold hover:text-eliteGold/80 transition-colors flex items-center gap-1 text-sm"
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  title={isExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
                >
                  <EyeIcon className={`w-5 h-5 ${isExpanded ? 'opacity-80' : 'opacity-50'}`} />
                  <span className="underline">{isExpanded ? 'Ocultar' : 'Ver'}</span>
                </button>
              </div>
            </div>

            {/* Resumo simples */}
            {!isExpanded && (
              <div className="flex flex-wrap gap-4 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-gray-800/50 rounded-lg p-2">
                    <img
                      src={item.product.images?.[0] || FALLBACK_IMG}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="text-white text-sm">{item.product.name}</p>
                      <p className="text-gray-400 text-xs">
                        Tam: {item.size} | Qtd: {item.quantity}
                      </p>
                      {item.customName && (
                        <p className="text-eliteGold text-xs">
                          {item.customName} {item.customNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Detalhes completos do pedido */}
            {isExpanded && (
              <div className="bg-eliteBlackSoft rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-white mb-3">Resumo do Pedido</h3>
                <div className="space-y-2 text-sm">
                  {order.items.map(item => {
                    // Priorizar unitPrice do backend, depois price, depois product.price
                    const price = Number(item.unitPrice) || Number(item.price) || (item.product && Number(item.product.price)) || 0;
                    return (
                      <div key={item.id} className="flex justify-between text-gray-300">
                        <span>{item.quantity}x {item.product.name} ({item.size})</span>
                        <span>R$ {(price * item.quantity).toFixed(2).replace('.', ',')}</span>
                      </div>
                    );
                  })}
                  <hr className="border-eliteGold/20 my-2" />
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>R$ {order.totalAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Frete</span>
                    <span className="text-green-400">
                      R$ {(order.shippingAmount || 0).toFixed(2).replace('.', ',')}
                      {/* Regras de frete */}
                      {order.shippingAmount === 0 && (
                        <span className="ml-2 text-xs text-eliteGold">(Frete grátis)</span>
                      )}
                    </span>
                  </div>
                  {/* Descontos detalhados */}
                  {order.couponCode && (
                    <div className="flex justify-between text-green-400">
                      <span>
                        Cupom: <span className="font-bold">{order.couponCode}</span>
                        {order.coupon && order.coupon.type === 'percent' && (
                          <span className="ml-2 text-xs text-eliteGold">({order.coupon.value}% OFF)</span>
                        )}
                        {order.coupon && order.coupon.type === 'fixed' && (
                          <span className="ml-2 text-xs text-eliteGold">(R$ {Number(order.coupon.value).toFixed(2).replace('.', ',')} OFF)</span>
                        )}
                        {order.coupon && order.coupon.type === 'free_shipping' && (
                          <span className="ml-2 text-xs text-eliteGold">(Frete grátis pelo cupom)</span>
                        )}
                      </span>
                      <span>- R$ {(order.discountAmount || 0).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {/* Linha de desconto antes do total, mesmo sem cupom */}
                  {!order.couponCode && order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Desconto</span>
                      <span>- R$ {order.discountAmount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {/* Outras regras de desconto/frete */}
                  {order.coupon && order.coupon.minTotal && (
                    <div className="text-xs text-gray-400 mt-1">Mínimo para cupom: R$ {Number(order.coupon.minTotal).toFixed(2).replace('.', ',')}</div>
                  )}
                  <div className="flex justify-between text-white font-bold text-base pt-2">
                    <span>Total</span>
                    <span className="text-eliteGold">R$ {(order.discountedTotal ?? order.totalAmount).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                {/* Endereço e dados do cliente */}
                <div className="mt-6">
                  <h4 className="font-semibold text-white mb-2">Endereço de Entrega</h4>
                  <div className="text-gray-300 text-sm">
                    {order.address && (
                      <p>{order.address}{order.number ? `, ${order.number}` : ''}{order.complement ? ` - ${order.complement}` : ''}</p>
                    )}
                    <p>
                      {order.neighborhood && `${order.neighborhood} • `}
                      {order.city}{order.state ? `/${order.state}` : ''}
                    </p>
                    {order.zipCode && <p>CEP: {order.zipCode}</p>}
                  </div>
                  {order.notes && (
                    <div className="mt-2 text-gray-400 text-xs">Obs: {order.notes}</div>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-white mb-2">Dados do Cliente</h4>
                  <div className="text-gray-300 text-sm">
                    <p>Nome: {order.customerName}</p>
                    {order.customerPhone && <p>Telefone: {order.customerPhone}</p>}
                    {order.customerEmail && <p>Email: {order.customerEmail}</p>}
                  </div>
                </div>

                {/* Link do pedido se existir */}
                {order.token && (
                  <div className="bg-eliteBlack rounded-lg p-3 mt-6">
                    <p className="text-gray-400 text-xs mb-1">Link do seu pedido:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/pedido/${order.token}`}
                        className="flex-1 bg-eliteBlack border border-eliteGold/30 rounded px-3 py-2 text-white text-xs"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/pedido/${order.token}`);
                          alert('Link copiado!');
                        }}
                        className="bg-eliteGold text-eliteBlack px-3 py-1 rounded font-semibold text-xs hover:bg-eliteGold/90 transition-colors"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rodapé simples */}
            <div className="flex flex-col gap-1 pt-4 border-t border-gray-700">
              {order.discountAmount && order.discountAmount > 0 && (
                <p className="text-green-400 text-sm">
                  Desconto aplicado: -R$ {order.discountAmount.toFixed(2)}
                </p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-eliteGold font-semibold">
                  Total: R$ {(order.discountedTotal ?? order.totalAmount).toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
