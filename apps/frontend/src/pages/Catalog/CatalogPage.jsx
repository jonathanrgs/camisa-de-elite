import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid, Input, Select, Button } from '../../components';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

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
    if (search) {
      params.set('q', search);
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">Catálogo</h1>

      {/* Filtros */}
      <div className="bg-eliteBlackSoft rounded-lg p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome, time..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={[
              { value: '', label: 'Todas categorias' },
              { value: 'NACIONAL', label: '🇧🇷 Nacional' },
              { value: 'INTERNACIONAL', label: '🌍 Internacional' }
            ]}
          />

          <Select
            value={filters.state || ''}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            options={[
              { value: '', label: 'Todos estados' },
              { value: 'SP', label: 'São Paulo' },
              { value: 'RJ', label: 'Rio de Janeiro' },
              { value: 'MG', label: 'Minas Gerais' },
              { value: 'RS', label: 'Rio Grande do Sul' }
            ]}
          />

          <Button type="submit">Buscar</Button>
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* Grid de produtos */}
      <ProductGrid products={items} loading={loading} />

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 rounded ${
                pagination.page === i + 1
                  ? 'bg-eliteGold text-eliteBlack'
                  : 'bg-eliteBlackSoft text-white hover:bg-eliteGold/20'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
