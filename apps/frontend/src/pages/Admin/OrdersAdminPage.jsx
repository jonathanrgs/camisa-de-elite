import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const statusColors = {
  PENDENTE: 'bg-yellow-500/20 text-yellow-400',
  CONFIRMADO: 'bg-blue-500/20 text-blue-400',
  ENVIADO: 'bg-purple-500/20 text-purple-400',
  ENTREGUE: 'bg-green-500/20 text-green-400',
  CANCELADO: 'bg-red-500/20 text-red-400'
};

const statusOptions = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'ENTREGUE', label: 'Entregue' },
  { value: 'CANCELADO', label: 'Cancelado' }
];

export function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const params = {};
      if (filter) params.status = filter;
      const response = await adminService.getOrders(params);
      setOrders(response.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setMessage({ type: 'success', text: 'Status atualizado!' });
      loadOrders();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const filteredOrders = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.customerPhone.includes(search) ||
    o.id.includes(search)
  );

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-eliteGold">Pedidos</h1>

      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Filtros */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone ou ID..."
            className="flex-1 min-w-[200px] bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
          >
            <option value="">Todos os status</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-400">Nenhum pedido encontrado</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="card">
              {/* Header do pedido */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-800/30"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`w-3 h-3 rounded-full ${statusColors[order.status].replace('text-', 'bg-').replace('/20', '')}`}></span>
                    <div>
                      <p className="text-white font-medium">{order.customerName}</p>
                      <p className="text-gray-400 text-sm">
                        #{order.id.slice(0, 8)} • {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <p className="text-eliteGold font-semibold">
                      R$ {order.totalAmount.toFixed(2)}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`${statusColors[order.status]} bg-transparent border border-current rounded-lg px-3 py-1 text-sm focus:outline-none cursor-pointer`}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-400">
                      {expandedOrder === order.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detalhes expandidos */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-800 p-4 space-y-4">
                  {/* Dados do cliente */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Contato</p>
                      <p className="text-white">{order.customerPhone}</p>
                      {order.customerEmail && (
                        <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                      )}
                    </div>
                    {order.address && (
                      <div>
                        <p className="text-gray-400 text-sm">Endereço</p>
                        <p className="text-white">
                          {order.address}
                          {order.city && `, ${order.city}`}
                          {order.state && ` - ${order.state}`}
                        </p>
                        {order.zipCode && (
                          <p className="text-gray-400 text-sm">CEP: {order.zipCode}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Itens */}
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Itens do pedido</p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-2">
                          <img
                            src={item.product.images[0] || '/placeholder.jpg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm">{item.product.name}</p>
                            <p className="text-gray-400 text-xs">
                              Tam: {item.size} | Qtd: {item.quantity} | R$ {item.unitPrice.toFixed(2)}
                            </p>
                            {item.customName && (
                              <p className="text-eliteGold text-xs">
                                Personalização: {item.customName} {item.customNumber}
                              </p>
                            )}
                          </div>
                          <p className="text-white text-sm">
                            R$ {(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notas */}
                  {order.notes && (
                    <div>
                      <p className="text-gray-400 text-sm">Observações</p>
                      <p className="text-white">{order.notes}</p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2 pt-2">
                    <a
                      href={`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
