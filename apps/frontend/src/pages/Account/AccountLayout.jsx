import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AccountLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/minha-conta', label: 'Meus Dados', icon: '👤' },
    { path: '/minha-conta/pedidos', label: 'Meus Pedidos', icon: '📦' },
    { path: '/minha-conta/avaliacoes', label: 'Avaliações', icon: '⭐' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-2xl text-eliteGold mb-6">Minha Conta</h1>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Menu lateral */}
        <div className="md:col-span-1">
          <div className="card p-4">
            <div className="text-center mb-4 pb-4 border-b border-gray-700">
              <div className="w-16 h-16 bg-eliteGold/20 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                👤
              </div>
              <p className="text-white font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              {user?.favoriteTeam && (
                <p className="text-eliteGold text-sm mt-1">⚽ {user.favoriteTeam}</p>
              )}
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-eliteGold/20 text-eliteGold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <span>🚪</span>
                Sair
              </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
