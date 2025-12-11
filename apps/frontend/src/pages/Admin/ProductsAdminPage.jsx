import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

export function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'NACIONAL',
    team: '',
    league: '',
    country: '',
    state: '',
    city: '',
    season: '',
    images: [''],
    stock: { P: 0, M: 0, G: 0, GG: 0, XG: 0 }
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await adminService.getProducts({ limit: 100 });
      setProducts(response.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await adminService.exportProductsCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'produtos.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao exportar CSV' });
    }
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'NACIONAL',
      team: '',
      league: '',
      country: 'Brasil',
      state: '',
      city: '',
      season: '2024',
      images: [''],
      stock: { P: 10, M: 15, G: 15, GG: 10, XG: 5 }
    });
    setShowForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      team: product.team,
      league: product.league || '',
      country: product.country || '',
      state: product.state || '',
      city: product.city || '',
      season: product.season || '',
      images: product.images.length > 0 ? product.images : [''],
      stock: product.inventory?.stock || { P: 0, M: 0, G: 0, GG: 0, XG: 0 }
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      images: formData.images.filter(img => img.trim() !== '')
    };

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, data);
        setMessage({ type: 'success', text: 'Produto atualizado!' });
      } else {
        await adminService.createProduct(data);
        setMessage({ type: 'success', text: 'Produto criado!' });
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await adminService.deleteProduct(id);
      setMessage({ type: 'success', text: 'Produto excluído!' });
      loadProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const updateImage = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl text-eliteGold">Produtos</h1>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary px-4 py-2 text-sm">
            📥 Exportar CSV
          </button>
          <button onClick={openNewProduct} className="btn-primary px-4 py-2 text-sm">
            ➕ Novo Produto
          </button>
        </div>
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

      {/* Busca */}
      <div className="card p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
        />
      </div>

      {/* Modal de formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Preço *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none min-h-[80px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                  >
                    <option value="NACIONAL">Nacional</option>
                    <option value="INTERNACIONAL">Internacional</option>
                    <option value="SELECAO">Seleção</option>
                    <option value="RETRO">Retrô</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Time *</label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Liga</label>
                  <input
                    type="text"
                    value={formData.league}
                    onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                    className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">País</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Temporada</label>
                  <input
                    type="text"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none"
                    placeholder="2024"
                  />
                </div>
              </div>

              {/* Imagens */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Imagens (URLs)</label>
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => updateImage(index, e.target.value)}
                      className="flex-1 bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none text-sm"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-eliteGold text-sm hover:underline"
                >
                  + Adicionar imagem
                </button>
              </div>

              {/* Estoque */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Estoque por tamanho</label>
                <div className="grid grid-cols-5 gap-2">
                  {['P', 'M', 'G', 'GG', 'XG'].map((size) => (
                    <div key={size}>
                      <label className="block text-xs text-gray-500 text-center mb-1">{size}</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock[size]}
                        onChange={(e) => setFormData({
                          ...formData,
                          stock: { ...formData.stock, [size]: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-2 py-2 text-white text-center focus:border-eliteGold focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary py-2 disabled:opacity-50"
                >
                  {submitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de produtos */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Produto</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Categoria</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Preço</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Estoque</th>
                <th className="text-right text-gray-400 text-sm font-medium px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredProducts.map((product) => {
                const totalStock = product.inventory 
                  ? Object.values(product.inventory.stock).reduce((a, b) => a + b, 0)
                  : 0;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="text-white">{product.name}</p>
                          <p className="text-gray-400 text-sm">{product.team}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 text-sm">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-eliteGold">R$ {product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${totalStock > 10 ? 'text-green-400' : totalStock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {totalStock} un
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditProduct(product)}
                        className="text-blue-400 hover:text-blue-300 text-sm mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <p className="text-gray-400 text-center py-8">Nenhum produto encontrado</p>
        )}
      </div>
    </div>
  );
}
