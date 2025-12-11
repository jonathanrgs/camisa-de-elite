import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminService.getStats();
      setStats(response.stats);
      setRecentOrders(response.recentOrders);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-3 border-eliteGold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const iconMap = {
    products: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    orders: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    pending: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    users: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  };

  const statCards = [
    { label: 'Produtos', value: stats?.totalProducts || 0, icon: iconMap.products, color: 'blue', bgColor: 'from-blue-500/20 to-blue-600/10', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400' },
    { label: 'Pedidos', value: stats?.totalOrders || 0, icon: iconMap.orders, color: 'green', bgColor: 'from-green-500/20 to-green-600/10', iconBg: 'bg-green-500/20', iconColor: 'text-green-400' },
    { label: 'Pendentes', value: stats?.pendingOrders || 0, icon: iconMap.pending, color: 'yellow', bgColor: 'from-yellow-500/20 to-yellow-600/10', iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-400' },
    { label: 'Clientes', value: stats?.totalUsers || 0, icon: iconMap.users, color: 'purple', bgColor: 'from-purple-500/20 to-purple-600/10', iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400' },
  ];

  const statusColors = {
    PENDENTE: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMADO: 'bg-blue-500/20 text-blue-400',
    ENVIADO: 'bg-purple-500/20 text-purple-400',
    ENTREGUE: 'bg-green-500/20 text-green-400',
    CANCELADO: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Bem-vindo ao painel administrativo</p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-eliteGold/50 text-gray-300 hover:text-white rounded-lg transition-all disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} border border-gray-800 rounded-xl p-4 lg:p-5`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} ${stat.iconColor} p-2.5 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
            {/* Decoração */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${stat.iconBg} rounded-full opacity-30 blur-2xl`} />
          </div>
        ))}
      </div>

      {/* Receita Total */}
      <div className="bg-gradient-to-r from-eliteGold/20 via-eliteGold/10 to-transparent border border-eliteGold/20 rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-gray-400 text-sm mb-1">Receita Total</p>
            <p className="text-3xl lg:text-4xl font-bold text-eliteGold">
              R$ {(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-16 h-16 bg-eliteGold/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-eliteGold/5 rounded-full blur-3xl" />
      </div>

      {/* Pedidos recentes */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 lg:p-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Pedidos Recentes
          </h2>
          <Link to="/admin/pedidos" className="text-eliteGold text-sm hover:text-eliteGoldLight transition-colors flex items-center gap-1">
            Ver todos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-400">Nenhum pedido ainda</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-eliteGold/30 to-eliteGold/10 rounded-full flex items-center justify-center text-eliteGold font-bold text-sm">
                    {order.customerName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{order.customerName}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="text-eliteGold font-semibold">
                    R$ {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/admin/produtos" className="group bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-xl p-5 transition-all hover:bg-blue-500/5">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-white font-medium group-hover:text-blue-400 transition-colors">Adicionar Produto</p>
          <p className="text-gray-500 text-sm mt-1">Cadastre novos itens</p>
        </Link>
        
        <Link to="/admin/pedidos" className="group bg-gray-900/50 border border-gray-800 hover:border-green-500/50 rounded-xl p-5 transition-all hover:bg-green-500/5">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <p className="text-white font-medium group-hover:text-green-400 transition-colors">Gerenciar Pedidos</p>
          <p className="text-gray-500 text-sm mt-1">Atualize status de envio</p>
        </Link>
        
        <Link to="/admin/avaliacoes" className="group bg-gray-900/50 border border-gray-800 hover:border-yellow-500/50 rounded-xl p-5 transition-all hover:bg-yellow-500/5">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-white font-medium group-hover:text-yellow-400 transition-colors">Moderar Avaliações</p>
          <p className="text-gray-500 text-sm mt-1">Aprove ou rejeite reviews</p>
        </Link>
      </div>
    </div>
  );
}
