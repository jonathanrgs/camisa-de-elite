import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/admin/produtos', label: 'Produtos', icon: '👕' },
    { path: '/admin/pedidos', label: 'Pedidos', icon: '📦' },
    { path: '/admin/avaliacoes', label: 'Avaliações', icon: '⭐' },
    { path: '/admin/usuarios', label: 'Usuários', icon: '👥' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-eliteBlack">
      {/* Header Admin */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-eliteGold font-heading text-xl">
              Camisa de Elite
            </Link>
            <span className="bg-eliteGold/20 text-eliteGold text-xs px-2 py-1 rounded">
              ADMIN
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:block">
              {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <nav className="lg:col-span-1">
            <div className="card p-4 sticky top-4">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item)
                        ? 'bg-eliteGold/20 text-eliteGold'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              <hr className="border-gray-700 my-4" />

              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <span>🏠</span>
                Ver site
              </Link>
            </div>
          </nav>

          {/* Conteúdo */}
          <main className="lg:col-span-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
