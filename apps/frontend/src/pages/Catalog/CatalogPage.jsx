import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../../components';

// Componente de dropdown customizado
function FilterDropdown({ label, value, options, onChange, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all w-full lg:w-auto ${
          value 
            ? 'bg-eliteGold/10 border-eliteGold/50 text-eliteGold' 
            : 'bg-gray-900/80 border-gray-700 text-gray-300 hover:border-gray-600'
        }`}
      >
        {icon}
        <span className="flex-1 text-left">{selectedOption.label}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[200px] animate-fade-in">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between ${
                  value === option.value 
                    ? 'bg-eliteGold/10 text-eliteGold' 
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {option.label}
                {value === option.value && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  // Sincronizar estado local com URL
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const filters = {
    q: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    state: searchParams.get('state') || undefined,
    page: searchParams.get('page') || 1,
    pageSize: 12
  };

  const { items, pagination, loading, error } = useProducts(filters);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set('q', search.trim());
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearch('');
    setSearchParams({});
  };

  const hasActiveFilters = filters.q || filters.category || filters.state;

  const categoryOptions = [
    { value: '', label: 'Todas categorias' },
    { value: 'NACIONAL', label: 'Nacional' },
    { value: 'INTERNACIONAL', label: 'Internacional' },
    { value: 'SELECAO', label: 'Seleção' },
    { value: 'RETRO', label: 'Retrô' },
  ];

  const stateOptions = [
    { value: '', label: 'Todos estados' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'PR', label: 'Paraná' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'BA', label: 'Bahia' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'CE', label: 'Ceará' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl lg:text-4xl text-eliteGold">Catálogo</h1>
          <p className="text-gray-400 mt-1">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </span>
            ) : (
              `${pagination?.total || 0} produtos encontrados`
            )}
          </p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 lg:p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Linha principal */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Campo de busca */}
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nome, time, liga..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 focus:border-eliteGold rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-500 outline-none transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); handleFilterChange('q', ''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdowns de filtro */}
            <div className="flex flex-col sm:flex-row gap-3">
              <FilterDropdown
                label="Categoria"
                value={filters.category || ''}
                options={categoryOptions}
                onChange={(value) => handleFilterChange('category', value)}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                }
              />
              
              <FilterDropdown
                label="Estado"
                value={filters.state || ''}
                options={stateOptions}
                onChange={(value) => handleFilterChange('state', value)}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
            </div>

            {/* Botão de busca */}
            <button 
              type="submit"
              className="bg-eliteGold hover:bg-eliteGoldLight text-eliteBlack font-semibold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-eliteGold/20 hover:shadow-eliteGold/30"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>

          {/* Tags de filtros ativos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-800">
              <span className="text-gray-500 text-sm">Filtros:</span>
              
              {filters.q && (
                <span className="inline-flex items-center gap-2 bg-eliteGold/15 text-eliteGold text-sm px-3 py-1.5 rounded-lg border border-eliteGold/30">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  "{filters.q}"
                  <button onClick={() => { setSearch(''); handleFilterChange('q', ''); }} className="hover:text-white ml-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.category && (
                <span className="inline-flex items-center gap-2 bg-blue-500/15 text-blue-400 text-sm px-3 py-1.5 rounded-lg border border-blue-500/30">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {categoryOptions.find(o => o.value === filters.category)?.label}
                  <button onClick={() => handleFilterChange('category', '')} className="hover:text-white ml-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.state && (
                <span className="inline-flex items-center gap-2 bg-purple-500/15 text-purple-400 text-sm px-3 py-1.5 rounded-lg border border-purple-500/30">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {stateOptions.find(o => o.value === filters.state)?.label}
                  <button onClick={() => handleFilterChange('state', '')} className="hover:text-white ml-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              <button 
                onClick={handleClearFilters}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 ml-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Resetar tudo
              </button>
            </div>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Grid de produtos */}
      <ProductGrid products={items} loading={loading} />

      {/* Mensagem de nenhum resultado */}
      {!loading && items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl text-white mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Não encontramos produtos com os filtros selecionados. Tente ajustar sua busca.
          </p>
          <button 
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 bg-eliteGold/10 text-eliteGold px-5 py-2.5 rounded-lg border border-eliteGold/30 hover:bg-eliteGold/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpar filtros e ver todos
          </button>
        </div>
      )}

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {[...Array(pagination.totalPages)].map((_, i) => {
            const page = i + 1;
            const isNearCurrent = Math.abs(page - pagination.page) <= 2;
            const isFirst = page === 1;
            const isLast = page === pagination.totalPages;
            
            if (!isNearCurrent && !isFirst && !isLast) {
              if (page === 2 || page === pagination.totalPages - 1) {
                return <span key={i} className="text-gray-600 px-2">•••</span>;
              }
              return null;
            }
            
            return (
              <button
                key={i}
                onClick={() => handlePageChange(page)}
                className={`w-11 h-11 rounded-xl font-medium transition-all ${
                  pagination.page === page
                    ? 'bg-eliteGold text-eliteBlack shadow-lg shadow-eliteGold/30'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
