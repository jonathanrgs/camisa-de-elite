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
          <button onClick={handleExportCSV} className="btn-secondary px-4 py-2 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Exportar CSV
          </button>
          <button onClick={openNewProduct} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Novo Produto
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

      {/* Modal de formulário melhorado */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl w-full max-w-3xl my-8 border border-gray-800 shadow-2xl">
            {/* Header do modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editingProduct ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {editingProduct ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {editingProduct ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600">
              {/* Seção: Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-eliteGold mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium uppercase tracking-wide">Informações Básicas</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-400 flex items-center gap-1">
                      Nome do produto
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-3 text-white outline-none transition-all"
                      placeholder="Ex: Camisa Flamengo 2024"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-400 flex items-center gap-1">
                      Preço (R$)
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl pl-12 pr-4 py-3 text-white outline-none transition-all"
                        placeholder="99.90"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-400">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-3 text-white outline-none transition-all min-h-[100px] resize-none"
                    placeholder="Descreva os detalhes do produto..."
                  />
                </div>
              </div>

              {/* Seção: Classificação */}
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-blue-400 mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm font-medium uppercase tracking-wide">Classificação</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-400 flex items-center gap-1">
                      Categoria
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-3 text-white outline-none transition-all appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                    >
                      <option value="NACIONAL">🇧🇷 Nacional</option>
                      <option value="INTERNACIONAL">🌍 Internacional</option>
                      <option value="SELECAO">⭐ Seleção</option>
                      <option value="RETRO">🏆 Retrô</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-400 flex items-center gap-1">
                      Time
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.team}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-3 text-white outline-none transition-all"
                      placeholder="Ex: Flamengo"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-400">Liga / Campeonato</label>
                    <input
                      type="text"
                      value={formData.league}
                      onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                      className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-3 text-white outline-none transition-all"
                      placeholder="Ex: Brasileirão"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-400">País</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-3 text-white outline-none transition-all"
                      placeholder="Ex: Brasil"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-400">Temporada</label>
                    <input
                      type="text"
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-3 text-white outline-none transition-all"
                      placeholder="Ex: 2024/25"
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Imagens */}
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium uppercase tracking-wide">Imagens do Produto</span>
                  </div>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-sm text-eliteGold hover:text-eliteGoldLight flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar imagem
                  </button>
                </div>

                {/* Preview de imagens */}
                {formData.images.some(img => img.trim()) && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {formData.images.filter(img => img.trim()).map((img, index) => (
                      <div key={index} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-700 relative group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{index + 1}ª</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="w-6 h-6 rounded-lg bg-gray-800 text-gray-500 text-xs flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => updateImage(index, e.target.value)}
                        className="flex-1 bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all"
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remover imagem"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção: Estoque */}
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-sm font-medium uppercase tracking-wide">Estoque por Tamanho</span>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {['P', 'M', 'G', 'GG', 'XG'].map((size) => {
                    const stockValue = formData.stock[size];
                    const stockColor = stockValue > 10 ? 'border-emerald-500/50' 
                      : stockValue > 0 ? 'border-yellow-500/50' 
                      : 'border-gray-700';
                    const statusColor = stockValue > 10 ? 'text-emerald-400' 
                      : stockValue > 0 ? 'text-yellow-400' 
                      : 'text-gray-500';
                    
                    const increment = () => setFormData({
                      ...formData,
                      stock: { ...formData.stock, [size]: stockValue + 1 }
                    });
                    
                    const decrement = () => setFormData({
                      ...formData,
                      stock: { ...formData.stock, [size]: Math.max(0, stockValue - 1) }
                    });
                    
                    return (
                      <div key={size} className="space-y-1.5">
                        <label className="block text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800 text-white font-semibold text-sm border border-gray-700">
                            {size}
                          </span>
                        </label>
                        <div className={`flex items-center border ${stockColor} rounded-xl bg-gray-900/80 overflow-hidden`}>
                          <button
                            type="button"
                            onClick={decrement}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={formData.stock[size]}
                            onChange={(e) => setFormData({
                              ...formData,
                              stock: { ...formData.stock, [size]: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full bg-transparent py-2 text-white text-center font-medium outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={increment}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <p className={`text-center text-xs ${statusColor}`}>
                          {stockValue > 10 ? 'Bom' : stockValue > 0 ? 'Baixo' : 'Zerado'}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl border border-gray-800">
                  <span className="text-gray-400 text-sm">Total em estoque:</span>
                  <span className="text-white font-semibold">
                    {Object.values(formData.stock).reduce((a, b) => a + b, 0)} unidades
                  </span>
                </div>
              </div>
            </form>

            {/* Footer do modal */}
            <div className="flex gap-3 p-6 border-t border-gray-800 bg-gray-900/50">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
              <button
                type="submit"
                form="product-form"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-eliteGold hover:bg-eliteGoldLight disabled:opacity-50 disabled:cursor-not-allowed text-eliteBlack font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-eliteGold/20"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
                  </>
                )}
              </button>
            </div>
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
