import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

export function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewAdmin, setShowNewAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await adminService.createAdmin(newAdminData);
      setMessage({ type: 'success', text: 'Admin criado com sucesso!' });
      setShowNewAdmin(false);
      setNewAdminData({ email: '', password: '', name: '' });
      loadUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  const admins = users.filter(u => u.role === 'ADMIN');
  const customers = users.filter(u => u.role === 'CUSTOMER');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-eliteGold">Usuários</h1>
        <button
          onClick={() => setShowNewAdmin(true)}
          className="btn-primary px-4 py-2 text-sm"
        >
          ➕ Novo Admin
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Modal novo admin */}
      {showNewAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Novo Administrador</h2>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">E-mail</label>
                <input
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Senha</label>
                <input
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAdmin(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary py-2 disabled:opacity-50"
                >
                  {submitting ? 'Criando...' : 'Criar Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Administradores */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          🛡️ Administradores ({admins.length})
        </h2>
        
        <div className="space-y-3">
          {admins.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <div>
                <p className="text-white">{user.name || 'Sem nome'}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              <span className="bg-eliteGold/20 text-eliteGold text-xs px-2 py-1 rounded">
                ADMIN
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clientes */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          👥 Clientes ({customers.length})
        </h2>
        
        {customers.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhum cliente cadastrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="pb-2">Nome</th>
                  <th className="pb-2">E-mail</th>
                  <th className="pb-2">Time ⚽</th>
                  <th className="pb-2 text-center">Pedidos</th>
                  <th className="pb-2 text-center">Avaliações</th>
                  <th className="pb-2">Cadastro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {customers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 text-white">{user.name || '-'}</td>
                    <td className="py-2 text-gray-400">{user.email}</td>
                    <td className="py-2 text-eliteGold">{user.favoriteTeam || '-'}</td>
                    <td className="py-2 text-center text-gray-300">{user._count.orders}</td>
                    <td className="py-2 text-center text-gray-300">{user._count.reviews}</td>
                    <td className="py-2 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
