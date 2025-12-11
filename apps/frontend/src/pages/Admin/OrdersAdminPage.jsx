import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const statusConfig = {
  PENDENTE: { 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-400',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  CONFIRMADO: { 
    bg: 'bg-blue-500/20', 
    text: 'text-blue-400',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  EM_ROTA: { 
    bg: 'bg-indigo-500/20', 
    text: 'text-indigo-400',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  },
  ENVIADO: { 
    bg: 'bg-purple-500/20', 
    text: 'text-purple-400',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  },
  ENTREGUE: { 
    bg: 'bg-green-500/20', 
    text: 'text-green-400',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  CANCELADO: { 
    bg: 'bg-red-500/20', 
    text: 'text-red-400',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    )
  }
};

const statusOptions = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'EM_ROTA', label: 'Em Rota' },
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
                className="p-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.text} p-2 rounded-lg`}>
                      {statusConfig[order.status]?.icon}
                    </span>
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
                      className={`${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.text} border border-current rounded-lg px-3 py-1 text-sm focus:outline-none cursor-pointer`}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
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
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800">
                    {/* Link do pedido */}
                    {order.orderLink && (
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/pedido/${order.orderLink.token}`;
                          navigator.clipboard.writeText(link);
                          setMessage({ type: 'success', text: 'Link copiado!' });
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Copiar Link
                      </button>
                    )}
                    
                    {/* Botões de status rápido */}
                    {order.status === 'PENDENTE' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'CONFIRMADO')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Confirmar Pedido
                      </button>
                    )}
                    {order.status === 'CONFIRMADO' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'EM_ROTA')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                          Em Rota de Entrega
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'ENVIADO')}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                          Marcar como Enviado
                        </button>
                      </>
                    )}
                    {order.status === 'EM_ROTA' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'ENTREGUE')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Marcar como Entregue
                      </button>
                    )}
                    {order.status === 'ENVIADO' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'ENTREGUE')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Marcar como Entregue
                      </button>
                    )}
                    {order.status !== 'CANCELADO' && order.status !== 'ENTREGUE' && (
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja cancelar este pedido?')) {
                            handleStatusChange(order.id, 'CANCELADO');
                          }
                        }}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Cancelar
                      </button>
                    )}
                    
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                  
                  {/* Status entregue/cancelado */}
                  {order.status === 'ENTREGUE' && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-green-400">Pedido entregue com sucesso!</span>
                    </div>
                  )}
                  {order.status === 'CANCELADO' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      <span className="text-red-400">Pedido cancelado</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
