import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

// Função para buscar endereço pelo CEP
async function fetchAddressByCep(cep) {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}

// Função para formatar CEP
function formatCep(value) {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    favoriteTeam: user?.favoriteTeam || '',
    address: user?.address || '',
    neighborhood: user?.neighborhood || '',
    number: user?.number || '',
    complement: user?.complement || '',
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
  const [loadingCep, setLoadingCep] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'zipCode') {
      const formatted = formatCep(value);
      setFormData({ ...formData, [name]: formatted });
      
      // Buscar endereço automaticamente quando CEP tiver 8 dígitos
      const cleanCep = value.replace(/\D/g, '');
      if (cleanCep.length === 8) {
        handleCepSearch(cleanCep);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCepSearch = async (cep) => {
    setLoadingCep(true);
    const address = await fetchAddressByCep(cep);
    setLoadingCep(false);
    
    if (address) {
      setFormData(prev => ({
        ...prev,
        address: address.logradouro || prev.address,
        neighborhood: address.bairro || '',
        city: address.localidade || '',
        state: address.uf || ''
      }));
    }
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

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">CEP</label>
              <div className="relative">
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                  placeholder="00000-000"
                  maxLength={9}
                />
                {loadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-eliteGold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Digite o CEP para preencher automaticamente</p>
            </div>
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bairro</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Rua/Logradouro</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                placeholder="Rua, Avenida..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Número</label>
              <input
                type="text"
                name="number"
                value={formData.number || ''}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Complemento</label>
              <input
                type="text"
                name="complement"
                value={formData.complement || ''}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                placeholder="Apto, Bloco, Casa..."
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
