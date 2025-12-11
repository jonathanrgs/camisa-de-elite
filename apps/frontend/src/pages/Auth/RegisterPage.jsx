import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    favoriteTeam: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        favoriteTeam: formData.favoriteTeam
      });
      navigate('/minha-conta');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="font-heading text-2xl text-eliteGold text-center mb-6">
            Criar Conta
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nome completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                placeholder="seu@email.com"
                required
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
                placeholder="(11) 99999-9999"
              />
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
              <label className="block text-sm text-gray-400 mb-1">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirmar senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Já tem conta?{' '}
            <Link to="/login" className="text-eliteGold hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
