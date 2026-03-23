import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

// Imagem padrão quando o produto não tem imagens
const FALLBACK_IMG = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';

const statusConfig = {
  PENDENTE: { 
    bg: 'bg-amber-500/15', 
    text: 'text-amber-400',
    ring: 'ring-1 ring-amber-500/20',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  CONFIRMADO: { 
    bg: 'bg-blue-500/15', 
    text: 'text-blue-400',
    ring: 'ring-1 ring-blue-500/20',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  EM_ROTA: { 
    bg: 'bg-indigo-500/15', 
    text: 'text-indigo-400',
    ring: 'ring-1 ring-indigo-500/20',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  },
  ENVIADO: { 
    bg: 'bg-purple-500/15', 
    text: 'text-purple-400',
    ring: 'ring-1 ring-purple-500/20',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    )
  },
  ENTREGUE: { 
    bg: 'bg-emerald-500/15', 
    text: 'text-emerald-400',
    ring: 'ring-1 ring-emerald-500/20',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  },
  CANCELADO: { 
    bg: 'bg-red-500/15', 
    text: 'text-red-400',
    ring: 'ring-1 ring-red-500/20',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-white tracking-tight">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">{filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone ou ID..."
              className="w-full bg-white/[0.03] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:border-eliteGold/50 focus:outline-none transition-colors"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/[0.03] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-eliteGold/50 focus:outline-none transition-colors"
          >
            <option value="">Todos os status</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl p-10 text-center">
            <svg className="w-10 h-10 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm">Nenhum pedido encontrado</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-gray-900/30 border border-gray-800/60 rounded-xl overflow-hidden">
              {/* Header do pedido */}
              <div 
                className="px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.text} ${statusConfig[order.status]?.ring} p-2 rounded-lg`}>
                      {statusConfig[order.status]?.icon}
                    </span>
                    <div>
                      <p className="text-white font-medium text-sm">{order.customerName}</p>
                      <p className="text-gray-600 text-xs">
                        #{order.id.slice(0, 8)} · {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      {order.discountAmount && order.discountAmount > 0 && (
                        <span className="text-emerald-400 text-xs">-R$ {order.discountAmount.toFixed(2)}</span>
                      )}
                      <span className="text-eliteGold font-semibold text-sm tabular-nums">
                        R$ {(order.discountedTotal ?? order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.text} border-0 rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer`}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <svg className={`w-4 h-4 text-gray-600 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Detalhes expandidos */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-800/60 px-5 py-4 space-y-4 bg-white/[0.01]">
                  {/* Dados do cliente */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Contato</p>
                      <p className="text-white text-sm">{order.customerPhone}</p>
                      {order.customerEmail && (
                        <p className="text-gray-500 text-xs mt-0.5">{order.customerEmail}</p>
                      )}
                    </div>
                    {order.address && (
                      <div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Endereço</p>
                        <p className="text-white text-sm">
                          {order.address}
                          {order.city && `, ${order.city}`}
                          {order.state && ` - ${order.state}`}
                        </p>
                        {order.zipCode && (
                          <p className="text-gray-500 text-xs mt-0.5">CEP: {order.zipCode}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Itens */}
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">Itens do pedido</p>
                    <div className="space-y-1.5">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-white/[0.02] border border-gray-800/40 rounded-lg p-2.5">
                          <img
                            src={item.product.images?.[0] || FALLBACK_IMG}
                            alt={item.product.name}
                            className="w-11 h-11 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{item.product.name}</p>
                            <p className="text-gray-500 text-xs">
                              Tam: {item.size} · Qtd: {item.quantity} · R$ {item.unitPrice.toFixed(2)}
                            </p>
                            {item.customName && (
                              <p className="text-eliteGold text-xs">
                                {item.customName} {item.customNumber}
                              </p>
                            )}
                          </div>
                          <p className="text-white text-sm font-medium tabular-nums">
                            R$ {(item.unitPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notas */}
                  {order.notes && (
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Observações</p>
                      <p className="text-white text-sm">{order.notes}</p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-800/40">
                    {order.orderLink && (
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/pedido/${order.orderLink.token}`;
                          navigator.clipboard.writeText(link);
                          setMessage({ type: 'success', text: 'Link copiado!' });
                        }}
                        className="bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Copiar Link
                      </button>
                    )}
                    
                    {order.status === 'PENDENTE' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'CONFIRMADO')}
                        className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                        Confirmar
                      </button>
                    )}
                    {order.status === 'CONFIRMADO' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'EM_ROTA')}
                          className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                          Em Rota
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'ENVIADO')}
                          className="bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                          Enviado
                        </button>
                      </>
                    )}
                    {(order.status === 'EM_ROTA' || order.status === 'ENVIADO') && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'ENTREGUE')}
                        className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                        Entregue
                      </button>
                    )}
                    {order.status !== 'CANCELADO' && order.status !== 'ENTREGUE' && (
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja cancelar este pedido?')) {
                            handleStatusChange(order.id, 'CANCELADO');
                          }
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        Cancelar
                      </button>
                    )}
                    
                    <a
                      href={`https://wa.me/55${order.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                  
                  {/* Status banners */}
                  {order.status === 'ENTREGUE' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-emerald-400 text-xs">Pedido entregue com sucesso</span>
                    </div>
                  )}
                  {order.status === 'CANCELADO' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      <span className="text-red-400 text-xs">Pedido cancelado</span>
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
