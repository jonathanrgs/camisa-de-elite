import { api } from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Registro
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obter perfil
  getProfile: () => api.get('/auth/profile'),

  // Atualizar perfil
  updateProfile: (data) => api.put('/auth/profile', data),

  // Alterar senha
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/password', { currentPassword, newPassword }),

  // Verificar se está logado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Obter usuário do localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar se é admin
  isAdmin: () => {
    const user = authService.getUser();
    return user?.role === 'ADMIN';
  }
};
