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
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const admins = users.filter(u => u.role === 'ADMIN');
  const customers = users.filter(u => u.role === 'CUSTOMER');
  const inputClass = "w-full bg-white/[0.03] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-eliteGold/50 focus:outline-none transition-colors";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-white tracking-tight">Usuários</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowNewAdmin(true)}
          className="flex items-center gap-2 px-4 py-2 bg-eliteGold/15 hover:bg-eliteGold/25 text-eliteGold rounded-lg transition-all text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
          Novo Admin
        </button>
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

      {/* Modal novo admin */}
      {showNewAdmin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowNewAdmin(false)}>
          <div className="bg-gray-900 border border-gray-800/60 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Novo Administrador</h2>
              <button onClick={() => setShowNewAdmin(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nome</label>
                <input type="text" value={newAdminData.name} onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">E-mail</label>
                <input type="email" value={newAdminData.email} onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Senha</label>
                <input type="password" value={newAdminData.password} onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })} className={inputClass} required minLength={6} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewAdmin(false)} className="flex-1 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 rounded-lg text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-eliteGold/15 hover:bg-eliteGold/25 text-eliteGold rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {submitting ? 'Criando...' : 'Criar Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Administradores */}
      <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800/60 flex items-center gap-2">
          <svg className="w-4 h-4 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 className="text-sm font-semibold text-white">Administradores</h2>
          <span className="text-xs text-gray-500 ml-1">({admins.length})</span>
        </div>
        
        <div className="divide-y divide-gray-800/40">
          {admins.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-eliteGold/10 rounded-lg flex items-center justify-center text-eliteGold font-bold text-xs">
                  {user.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.name || 'Sem nome'}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
              <span className="bg-eliteGold/10 text-eliteGold text-[10px] px-2 py-0.5 rounded-full font-medium ring-1 ring-eliteGold/20">
                ADMIN
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clientes */}
      <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800/60 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <h2 className="text-sm font-semibold text-white">Clientes</h2>
          <span className="text-xs text-gray-500 ml-1">({customers.length})</span>
        </div>
        
        {customers.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">Nenhum cliente cadastrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800/40">
                  <th className="px-5 py-3 font-medium">Nome</th>
                  <th className="px-5 py-3 font-medium">E-mail</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium text-center">Pedidos</th>
                  <th className="px-5 py-3 font-medium text-center">Reviews</th>
                  <th className="px-5 py-3 font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {customers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-white text-sm">{user.name || '-'}</td>
                    <td className="px-5 py-3 text-gray-400 text-sm">{user.email}</td>
                    <td className="px-5 py-3 text-eliteGold text-sm">{user.favoriteTeam || '-'}</td>
                    <td className="px-5 py-3 text-center text-gray-300 text-sm tabular-nums">{user._count.orders}</td>
                    <td className="px-5 py-3 text-center text-gray-300 text-sm tabular-nums">{user._count.reviews}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
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
