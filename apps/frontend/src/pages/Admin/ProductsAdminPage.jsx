// Scrollbar custom para modal de mídia
if (typeof window !== 'undefined' && !document.getElementById('media-modal-scroll-style')) {
  const scrollStyle = document.createElement('style');
  scrollStyle.id = 'media-modal-scroll-style';
  scrollStyle.innerHTML = `
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #FFD70033 #18181b;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      background: #18181b;
      border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #FFD70055 0%, #FFD70022 100%);
      border-radius: 8px;
      border: 2px solid #18181b;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #FFD700;
    }
  `;
  document.head.appendChild(scrollStyle);
}
import './media-modal-scroll.css';
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
import { MediaManager } from './MediaManager.jsx';
import { adminService } from '../../services/adminService';
import { ImageUploader } from '../../components/admin/ImageUploader';

export function ProductsAdminPage() {
  // Modal de mídia
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaSelectIndex, setMediaSelectIndex] = useState(null); // para saber qual campo de imagem está selecionando
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
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'

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
    console.log('[DEBUG] handleSubmit chamado', formData);
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

    // Separar imagens já hospedadas (URL) das novas (DataURL)
    const isUrl = (img) => typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'));
    // Filtra imagens válidas (remove null, string vazia, undefined)
    const cleanImages = (arr) => (arr || []).filter(img => !!img && img !== 'null' && img !== null && img !== undefined && img.trim && img.trim() !== '');
    const existingImages = cleanImages(formData.images).filter(img => isUrl(img));
    const newImagesDataUrl = cleanImages(formData.images).filter(img => !isUrl(img) && img && img.startsWith('data:image/'));
    let uploadedUrls = [];

    try {
      if (editingProduct) {
        // Edição: upload das novas imagens (se houver) e update normal
        for (let dataUrl of newImagesDataUrl) {
          const file = dataURLtoFile(dataUrl, 'imagem.jpg');
          const result = await import('../../services/imageService').then(mod => mod.imageService.uploadSingle(file));
          uploadedUrls.push(result.url);
        }
        const data = {
          ...formData,
          price: parseFloat(formData.price),
          images: cleanImages([...existingImages, ...uploadedUrls])
        };
        await adminService.updateProduct(editingProduct.id, data);
        setMessage({ type: 'success', text: 'Produto atualizado!' });
      } else {
        // Criação: 1) cria produto sem imagens, 2) faz upload das imagens vinculando ao produto
        const dataSemImagens = {
          ...formData,
          price: parseFloat(formData.price),
          images: []
        };
        // Aqui você pode criar o produto e depois fazer upload das imagens, se necessário
        // await adminService.createProduct(dataSemImagens);
        setMessage({ type: 'success', text: 'Produto criado!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
      loadProducts();
      setShowForm(false);
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
        <div className="flex gap-2 items-center">
          <button onClick={handleExportCSV} className="btn-secondary px-4 py-2 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Exportar CSV
          </button>
          <button onClick={openNewProduct} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Novo Produto
          </button>
          <div className="flex gap-1 ml-2 bg-gray-900/80 border border-eliteGold/30 rounded-lg p-1">
            <button
              type="button"
              className={`px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-eliteGold/90 text-black' : 'text-eliteGold hover:bg-eliteGold/20'}`}
              onClick={() => setViewMode('list')}
              title="Visualizar em lista"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              Lista
            </button>
            <button
              type="button"
              className={`px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium transition-colors ${viewMode === 'grid' ? 'bg-eliteGold/90 text-black' : 'text-eliteGold hover:bg-eliteGold/20'}`}
              onClick={() => setViewMode('grid')}
              title="Visualizar em quadrados"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>
              Quadrados
            </button>
          </div>
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
                          <div className="flex flex-wrap gap-2 items-center">
                            <button
                              type="button"
                              className="px-4 py-2 bg-eliteGold/10 hover:bg-eliteGold/20 text-eliteGold rounded-lg font-medium border border-eliteGold/30 transition-all"
                              onClick={() => { setShowMediaModal(true); setMediaSelectIndex(null); }}
                            >
                              Gerenciar Mídia
                            </button>
                            <span className="text-xs text-gray-500">Clique para abrir o gerenciador de mídia e inserir imagens hospedadas</span>
                          </div>
                          <div className="flex gap-1 flex-wrap mt-2 justify-start">
                            {formData.images.filter(img => img && img.trim()).map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={img}
                                  alt={`Imagem ${idx + 1}`}
                                  className="w-14 h-14 object-cover rounded-lg border border-eliteGold/30 bg-gray-800 shadow-sm"
                                  style={{ minWidth: 40, minHeight: 40 }}
                                  onClick={() => { setShowMediaModal(true); setMediaSelectIndex(idx); }}
                                  title="Clique para trocar imagem"
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                                  onClick={() => removeImage(idx)}
                                  tabIndex={-1}
                                  title="Remover imagem"
                                >×</button>
                                {idx === 0 && (
                                  <span className="absolute left-1 top-1 bg-eliteGold text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow">Principal</span>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              className="w-14 h-14 flex items-center justify-center border-2 border-dashed border-eliteGold/30 rounded-lg text-eliteGold bg-gray-900/60 hover:bg-eliteGold/10 transition"
                              onClick={() => { setShowMediaModal(true); setMediaSelectIndex(formData.images.length); }}
                              title="Adicionar nova imagem"
                            >
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                          </div>
                          {formErrors.images && (
                            <div className="text-red-400 text-xs mt-1">{formErrors.images}</div>
                          )}

                          {/* Modal de gerenciamento de mídia */}
                          {showMediaModal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
                              <div className="bg-gray-950 rounded-2xl border border-eliteGold/30 shadow-2xl w-full max-w-4xl p-4 relative animate-fade-in"
                                style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                                <button
                                  type="button"
                                  className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white bg-black/20 rounded-full"
                                  onClick={() => { setShowMediaModal(false); setMediaSelectIndex(null); }}
                                  title="Fechar"
                                >
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                <div style={{ overflowY: 'auto', maxHeight: '75vh', paddingRight: 4 }} className="custom-scrollbar">
                                  <MediaManager
                                    onSelect={(selected) => {
                                      setShowMediaModal(false);
                                      setTimeout(() => setMediaSelectIndex(null), 200);
                                      // Suporta múltiplas imagens
                                      const urls = Array.isArray(selected) ? selected : [selected];
                                      setFormData(prev => {
                                        let imgs = prev.images.filter(img => img && img.trim());
                                        if (mediaSelectIndex === null || mediaSelectIndex === undefined || mediaSelectIndex >= imgs.length) {
                                          // Adiciona todas as novas imagens
                                          imgs = [...imgs, ...urls];
                                        } else {
                                          // Substitui imagem existente e adiciona as demais
                                          imgs[mediaSelectIndex] = urls[0];
                                          if (urls.length > 1) imgs = [...imgs, ...urls.slice(1)];
                                        }
                                        return { ...prev, images: imgs };
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                {/* Aba 3: Estoque */}
                      {activeTab === 3 && (
                        <div className="space-y-6 animate-fade-in">
                          <p className="text-base text-eliteGold font-semibold mb-2 text-center tracking-wide">Defina a quantidade em estoque para cada tamanho</p>
                          <div className="flex flex-row items-end justify-center gap-3 w-full max-w-2xl mx-auto">
                            {['P', 'M', 'G', 'XL', '2XL', '3XL', '4XL'].map((size) => {
                              const stockValue = formData.stock[size] || 0;
                              const status = stockValue > 10 ? 'Bom' : 'Baixo';
                              const statusColor = stockValue > 10 ? 'text-green-400' : 'text-yellow-400';
                              const borderColor = stockValue > 10 ? 'border-green-400' : 'border-yellow-400';
                              return (
                                <div key={size} className={`flex flex-col items-center justify-end bg-gradient-to-b from-gray-900 to-gray-950 border-2 ${borderColor} rounded-xl px-2 py-3 shadow-lg transition-all`} style={{ minWidth: 60 }}>
                                  <span className="text-xs text-eliteGold font-bold mb-1 tracking-widest uppercase drop-shadow">{size}</span>
                                  <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center bg-eliteGold/20 hover:bg-eliteGold/40 text-eliteGold rounded-full mb-1 transition"
                                    onClick={() => setFormData({ ...formData, stock: { ...formData.stock, [size]: stockValue + 1 } })}
                                    tabIndex={-1}
                                    aria-label={`Aumentar estoque de ${size}`}
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" /></svg>
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={stockValue}
                                    onChange={e => setFormData({ ...formData, stock: { ...formData.stock, [size]: Math.max(0, Number(e.target.value)) } })}
                                    className="w-12 h-10 text-center bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-eliteGold text-lg font-bold text-white hide-arrows outline-none transition-all shadow-sm"
                                    style={{ fontVariantNumeric: 'tabular-nums' }}
                                  />
                                  <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center bg-eliteGold/20 hover:bg-eliteGold/40 text-eliteGold rounded-full mt-1 transition"
                                    onClick={() => setFormData({ ...formData, stock: { ...formData.stock, [size]: Math.max(0, stockValue - 1) } })}
                                    tabIndex={-1}
                                    aria-label={`Diminuir estoque de ${size}`}
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                  </button>
                                  <span className={`text-xs mt-2 font-semibold ${statusColor}`}>{status}</span>
                                </div>
                              );
                            })}
                          </div>
                          {/* Total em estoque */}
                          <div className="mt-4 bg-gray-900/90 border border-eliteGold/30 rounded-2xl px-6 py-3 flex flex-col items-center justify-center max-w-xs mx-auto shadow-lg">
                            <span className="text-gray-300 text-base font-medium mb-1">Total em estoque:</span>
                            <span className="text-2xl font-extrabold text-eliteGold tracking-wider">{Object.values(formData.stock).reduce((a, b) => a + Number(b), 0)} <span className="text-base text-gray-400 font-normal">unidades</span></span>
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
      {viewMode === 'list' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Produto</th>
                  <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Categoria</th>
                  <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Preço</th>
                  <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Estoque</th>
                  <th className="text-center text-gray-400 text-sm font-medium px-4 py-3">Status</th>
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
                      <td className="px-4 py-3 text-center">
                        {product.isActive ? (
                          <span className="inline-flex items-center gap-1 text-green-400 font-semibold text-xs"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Ativo</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-500 font-semibold text-xs"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Inativo</span>
                        )}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const totalStock = product.inventory
              ? Object.values(product.inventory.stock).reduce((a, b) => a + b, 0)
              : 0;
            return (
              <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-4 flex flex-col gap-3 hover:border-eliteGold/60 transition-all">
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-eliteGold/30 bg-gray-800"
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white truncate" title={product.name}>{product.name}</h3>
                    <p className="text-xs text-gray-400 truncate">{product.team}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-eliteGold/10 text-eliteGold font-bold">{product.category}</span>
                  <span className="text-xs text-green-400 font-semibold">{totalStock} un</span>
                </div>
                <div className="flex gap-2 justify-end items-center mt-2">
                  <span className="text-sm font-bold text-eliteGold flex items-center gap-1 mr-auto">
                    <svg className="w-4 h-4 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="7" width="20" height="10" rx="2" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11.37a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7v10M18 7v10"/></svg>
                    R$ {Number(product.price).toFixed(2)}
                  </span>
                  {product.isActive ? (
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold text-xs mr-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Ativo</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500 font-semibold text-xs mr-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Inativo</span>
                  )}
                  <button onClick={() => openEditProduct(product)} className="text-blue-400 hover:underline text-xs font-medium">Editar</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:underline text-xs font-medium">Excluir</button>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 && (
            <p className="text-gray-400 text-center py-8 col-span-full">Nenhum produto encontrado</p>
          )}
        </div>
      )}
    </div>
  );
}