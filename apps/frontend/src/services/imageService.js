const API_BASE = '/api';

// Função para obter token do localStorage
const getToken = () => localStorage.getItem('token');

export const imageService = {
  /**
   * Upload de múltiplas imagens para um produto
   * @param {string} productId - ID do produto
   * @param {FileList|File[]} files - Arquivos de imagem
   */
  async uploadProductImages(productId, files) {
    const formData = new FormData();
    
    // Adicionar cada arquivo ao FormData
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    const token = getToken();
    const response = await fetch(`${API_BASE}/admin/products/${productId}/images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro no upload');
    }

    return data;
  },

  /**
   * Deletar uma imagem de um produto
   * @param {string} productId - ID do produto
   * @param {string} imageUrl - URL da imagem a ser deletada
   */
  async deleteProductImage(productId, imageUrl) {
    const token = getToken();
    const response = await fetch(`${API_BASE}/admin/products/${productId}/images`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro ao deletar');
    }

    return data;
  },

  /**
   * Reordenar imagens de um produto
   * @param {string} productId - ID do produto
   * @param {string[]} images - Array de URLs na nova ordem
   */
  async reorderProductImages(productId, images) {
    const token = getToken();
    const response = await fetch(`${API_BASE}/admin/products/${productId}/images/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ images }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro ao reordenar');
    }

    return data;
  },

  /**
   * Upload genérico de uma única imagem
   * @param {File} file - Arquivo de imagem
   */
  async uploadSingle(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = getToken();
    const response = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro no upload');
    }

    return data;
  },
};

export default imageService;
