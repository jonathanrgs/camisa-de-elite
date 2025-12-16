import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';

const statusColors = {
  PENDENTE: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMADO: 'bg-blue-500/20 text-blue-400',
  ENVIADO: 'bg-purple-500/20 text-purple-400',
  ENTREGUE: 'bg-green-500/20 text-green-400',
  CANCELADO: 'bg-red-500/20 text-red-400'
};

const statusLabels = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  ENVIADO: 'Enviado',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado'
};

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      
      {orders.map((order) => (
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
            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-gray-800/50 rounded-lg p-2">
                <img
                  src={item.product.images[0] || '/placeholder.jpg'}
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
      ))}
    </div>
  );
}
