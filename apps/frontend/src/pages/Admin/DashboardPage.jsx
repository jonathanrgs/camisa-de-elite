import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.stats);
      setRecentOrders(response.recentOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Produtos', value: stats?.totalProducts || 0, icon: '👕', color: 'blue' },
    { label: 'Pedidos', value: stats?.totalOrders || 0, icon: '📦', color: 'green' },
    { label: 'Pendentes', value: stats?.pendingOrders || 0, icon: '⏳', color: 'yellow' },
    { label: 'Clientes', value: stats?.totalUsers || 0, icon: '👥', color: 'purple' },
  ];

  const statusColors = {
    PENDENTE: 'text-yellow-400',
    CONFIRMADO: 'text-blue-400',
    ENVIADO: 'text-purple-400',
    ENTREGUE: 'text-green-400',
    CANCELADO: 'text-red-400'
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-eliteGold">Dashboard</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Receita */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400">Receita Total</p>
            <p className="text-3xl font-bold text-eliteGold">
              R$ {(stats?.totalRevenue || 0).toFixed(2)}
            </p>
          </div>
          <span className="text-4xl">💰</span>
        </div>
      </div>

      {/* Pedidos recentes */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Pedidos Recentes</h2>
          <Link to="/admin/pedidos" className="text-eliteGold text-sm hover:underline">
            Ver todos →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhum pedido ainda</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                <div>
                  <p className="text-white">{order.customerName}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-eliteGold font-medium">
                    R$ {order.totalAmount.toFixed(2)}
                  </p>
                  <p className={`text-sm ${statusColors[order.status]}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/admin/produtos" className="card p-4 hover:border-eliteGold transition-colors group">
          <span className="text-2xl">➕</span>
          <p className="text-white mt-2 group-hover:text-eliteGold">Adicionar Produto</p>
        </Link>
        <Link to="/admin/pedidos" className="card p-4 hover:border-eliteGold transition-colors group">
          <span className="text-2xl">📋</span>
          <p className="text-white mt-2 group-hover:text-eliteGold">Gerenciar Pedidos</p>
        </Link>
        <Link to="/admin/avaliacoes" className="card p-4 hover:border-eliteGold transition-colors group">
          <span className="text-2xl">✅</span>
          <p className="text-white mt-2 group-hover:text-eliteGold">Moderar Avaliações</p>
        </Link>
      </div>
    </div>
  );
}
