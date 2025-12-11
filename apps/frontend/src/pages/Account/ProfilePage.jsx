import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    favoriteTeam: user?.favoriteTeam || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.user);
      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Dados pessoais */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Dados Pessoais</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">WhatsApp</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Time do coração ⚽</label>
            <input
              type="text"
              name="favoriteTeam"
              value={formData.favoriteTeam}
              onChange={handleChange}
              className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
              placeholder="Ex: Flamengo, Corinthians..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">E-mail</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado</p>
          </div>

          <hr className="border-gray-700" />

          <h3 className="text-lg font-medium text-white">Endereço de entrega</h3>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Endereço</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
              placeholder="Rua, número, complemento"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cidade</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Estado</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                placeholder="MG"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">CEP</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                placeholder="00000-000"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>

      {/* Alterar senha */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Alterar Senha</h2>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Senha atual</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nova senha</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirmar nova senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-secondary px-6 py-2 disabled:opacity-50"
          >
            Alterar senha
          </button>
        </form>
      </div>
    </div>
  );
}
