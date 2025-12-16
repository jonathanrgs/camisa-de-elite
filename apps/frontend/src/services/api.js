const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Função para obter token do localStorage
const getToken = () => localStorage.getItem('token');

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, config);
  
  // Não tenta parsear JSON para download de arquivos
  if (options.responseType === 'blob') {
    if (!response.ok) {
      throw new Error('Erro no download');
    }
    return response.blob();
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Erro na requisição');
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, body) => request(endpoint, { method: 'DELETE', ...(body && { body: JSON.stringify(body) }) })
};

export default api;
