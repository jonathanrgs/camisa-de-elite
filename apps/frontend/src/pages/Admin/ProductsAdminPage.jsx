// Esconde as setas do input type number para melhor UX
const style = document.createElement('style');
style.innerHTML = `
  input.hide-arrows::-webkit-outer-spin-button,
  input.hide-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input.hide-arrows[type=number] {
    -moz-appearance: textfield;
  }
`;
if (typeof window !== 'undefined' && !document.getElementById('hide-arrows-style')) {
  style.id = 'hide-arrows-style';
  document.head.appendChild(style);
}
import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { ImageUploader } from '../../components/admin/ImageUploader';

export function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
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
    stock: { P: 0, M: 0, G: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0 }
  });
  // Debug: log sempre que as imagens mudarem
  useEffect(() => {
    console.log('Imagens atuais do formulário:', formData.images);
  }, [formData.images]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formErrors, setFormErrors] = useState({});
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
    setActiveTab(0);
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
      stock: { P: 0, M: 0, G: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0 }
    });
    setShowForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab(0);
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
      stock: product.inventory?.stock || { P: 0, M: 0, G: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0 }
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validação dos campos obrigatórios
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.price || isNaN(Number(formData.price))) errors.price = 'Preço é obrigatório';
    if (!formData.category) errors.category = 'Categoria é obrigatória';
    if (!formData.team.trim()) errors.team = 'Time é obrigatório';
    if (!formData.images.filter(img => img && img.trim()).length) errors.images = 'Pelo menos uma imagem é obrigatória';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitting(false);
      setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios.' });
      return;
    }

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
        <div className={`p-3 rounded-lg ${message.type === 'success'
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

      {/* Modal de formulário com abas */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: 0 }}>
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl w-full max-w-3xl border border-gray-800 shadow-2xl" style={{ marginTop: 0 }}>
            {/* Header do modal */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
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
                  <h2 className="text-lg font-semibold text-white">
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowForm(false); setActiveTab(0); }}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Abas de navegação */}
            <div className="flex border-b border-gray-800">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ),

                  label: 'Básico'
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h8zm0 0V5a2 2 0 00-2-2H10a2 2 0 00-2 2v2" />
                    </svg>
                  ),
                  label: 'Classificação'
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                      <circle cx="8.5" cy="8.5" r="2.5" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15l-5-5-4 4-6-6" />
                    </svg>
                  ),
                  label: 'Imagens'
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3v4M8 3v4" />
                    </svg>
                  ),
                  label: 'Estoque'
                }
              ].map((tab, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all border-b-2 ${activeTab === index
                    ? 'border-eliteGold text-eliteGold bg-eliteGold/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Conteúdo das abas */}
              <div className="p-6">
                {/* Aba 0: Informações Básicas */}
                {activeTab === 0 && (
                  <div className="space-y-4 animate-fade-in">
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
                            className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl pl-12 pr-4 py-3 text-white outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                        className="w-full bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-3 text-white outline-none transition-all min-h-[120px] resize-none"
                        placeholder="Descreva os detalhes do produto..."
                      />
                    </div>
                  </div>
                )}

                {/* Aba 1: Classificação */}
                {activeTab === 1 && (
                  <div className="space-y-4 animate-fade-in">
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
                )}

                {/* Aba 2: Imagens */}
                {activeTab === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <ImageUploader
                      productId={editingProduct?.id}
                      images={formData.images.filter(img => img && img.trim())}
                      onImagesChange={(newImages) => setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] })}
                      onError={(err) => setMessage({ type: 'error', text: err })}
                    />
                    {/* Preview das imagens antes de enviar */}
                    <div className="flex gap-2 flex-wrap mt-2">
                      {formData.images.filter(img => img && img.trim()).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Imagem ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded border border-gray-700"
                        />
                      ))}
                    </div>
                    {formErrors.images && (
                      <div className="text-red-400 text-xs mt-1">{formErrors.images}</div>
                    )}
                    {/* Preview das imagens */}
                    <div className="flex gap-2 flex-wrap mt-2">
                      {formData.images.filter(img => img && img.trim()).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Imagem ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded border border-gray-700"
                        />
                      ))}
                    </div>

                    {/* Opção de adicionar URL manualmente */}
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300 flex items-center gap-2">
                        <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Adicionar URL manualmente
                      </summary>
                      <div className="mt-3 space-y-2 pl-6">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            id="manual-url-input"
                            placeholder="https://exemplo.com/imagem.jpg"
                            className="flex-1 bg-gray-900/80 border border-gray-700 hover:border-gray-600 focus:border-eliteGold rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('manual-url-input');
                              if (input.value.trim()) {
                                const currentImages = formData.images.filter(img => img && img.trim());
                                setFormData({ ...formData, images: [...currentImages, input.value.trim()] });
                                input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white text-sm transition-colors"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </details>
                  </div>
                )}

                {/* Aba 3: Estoque */}
                {activeTab === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <p className="text-sm text-gray-400 mb-2">Defina a quantidade em estoque para cada tamanho</p>
                    <div className="grid grid-cols-3 gap-6 w-full max-w-lg mx-auto">
                      {['P', 'M', 'G', 'XL', '2XL', '3XL', '4XL'].map((size) => {
                        const stockValue = formData.stock[size] || 0;
                        const status = stockValue > 10 ? 'Bom' : 'Baixo';
                        const statusColor = stockValue > 10 ? 'text-green-400' : 'text-yellow-400';
                        const borderColor = stockValue > 10 ? 'border-green-500' : 'border-yellow-500';
                        return (
                          <div key={size} className={`flex flex-col items-center gap-2 !mt-0 border-2 rounded-xl px-2 py-3 ${borderColor}`}>
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 text-white font-bold text-lg border border-eliteGold shadow-lg">{size}</span>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => setFormData({ ...formData, stock: { ...formData.stock, [size]: Math.max(0, stockValue - 1) } })} className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 text-lg">-</button>
                              <input
                                type="number"
                                min="0"
                                value={stockValue}
                                onChange={e => setFormData({ ...formData, stock: { ...formData.stock, [size]: Math.max(0, Number(e.target.value)) } })}
                                className="w-16 text-center bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-lg hide-arrows"
                                style={{ MozAppearance: 'textfield', marginTop: 0 }}
                                onWheel={e => e.target.blur()}
                              />
                              <button type="button" onClick={() => setFormData({ ...formData, stock: { ...formData.stock, [size]: stockValue + 1 } })} className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 text-lg">+</button>
                            </div>
                            <span className={`text-xs font-semibold mt-1 ${statusColor}`}>{status}</span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Total em estoque */}
                    <div className="mt-6 bg-gray-900/80 border border-gray-700 rounded-xl px-6 py-4 flex items-center justify-between max-w-lg mx-auto">
                      <span className="text-gray-300 text-base font-medium">Total em estoque:</span>
                      <span className="text-2xl font-bold text-eliteGold">{Object.values(formData.stock).reduce((a, b) => a + Number(b), 0)} <span className="text-base text-gray-400 font-normal">unidades</span></span>
                    </div>
                  </div>
                )}
                {/* Botão de submit */}
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="btn-primary px-6 py-2 rounded-xl text-white font-semibold"
                    disabled={submitting}
                  >
                    {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
                  </button>
                </div>
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
