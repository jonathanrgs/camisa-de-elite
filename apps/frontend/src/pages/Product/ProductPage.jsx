import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../hooks/useCart';
import { ProductGallery, Button, Spinner } from '../../components';

// Ordem dos tamanhos para exibição
const SIZE_ORDER = ['P', 'M', 'G', 'GG', 'XG'];

// Componente para exibir estrelas
function StarRating({ rating, size = 'md' }) {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
  return (
    <span className={`text-eliteGold ${sizes[size]}`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { addItem, stockError, clearStockError } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-400">{error || 'Produto não encontrado'}</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize || adding) return;
    
    clearStockError();
    setAdding(true);
    
    try {
      const success = await addItem(product, selectedSize);
      if (success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } finally {
      setAdding(false);
    }
  };

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  // Pegar estoque do produto (formato: { P: 10, M: 15, G: 20, GG: 5, XG: 3 })
  const stock = product.stock || {};
  
  // Ordenar tamanhos conforme SIZE_ORDER
  const sizes = SIZE_ORDER.filter(size => stock[size] !== undefined).map(size => ({
    size,
    quantity: stock[size] || 0
  }));
  
  // Calcular estoque total
  const totalStock = Object.values(stock).reduce((sum, qty) => sum + qty, 0);
  const availableSizes = sizes.filter(s => s.quantity > 0).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galeria */}
        <ProductGallery images={product.images} />

        {/* Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="bg-eliteGold/20 text-eliteGold px-3 py-1 rounded text-sm inline-block mb-2">
                {product.category}
              </span>
            )}
            <h1 className="font-heading text-3xl text-white">{product.name}</h1>
            {product.team && (
              <p className="text-gray-400 mt-1">{product.team} • {product.league}</p>
            )}
          </div>

          {avgRating && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-white font-medium">{avgRating}</span>
              <span className="text-gray-500">({product.reviews.length} avaliações)</span>
            </div>
          )}

          <p className="text-eliteGold text-3xl font-bold">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </p>

          {/* Estoque disponível */}
          <div className="flex items-center gap-4 text-sm">
            <span className={`px-3 py-1 rounded ${totalStock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {totalStock > 0 ? `${totalStock} unidades em estoque` : 'Produto esgotado'}
            </span>
            {availableSizes > 0 && (
              <span className="text-gray-400">
                {availableSizes} tamanho{availableSizes > 1 ? 's' : ''} disponíve{availableSizes > 1 ? 'is' : ''}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-300">{product.description}</p>
          )}

          {/* Tamanhos */}
          <div>
            <h3 className="font-semibold mb-3 text-white">Selecione o tamanho</h3>
            <div className="flex flex-wrap gap-3">
              {sizes.map(({ size, quantity }) => {
                const available = quantity > 0;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={!available}
                    onClick={() => setSelectedSize(size)}
                    className={`relative w-14 h-14 rounded-lg border-2 font-semibold transition-all ${
                      isSelected
                        ? 'border-eliteGold bg-eliteGold text-eliteBlack'
                        : available
                          ? 'border-eliteGold/40 hover:border-eliteGold text-white'
                          : 'border-gray-700 text-gray-600 cursor-not-allowed line-through'
                    }`}
                  >
                    {size}
                    {available && quantity <= 3 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded">
                        {quantity}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedSize && stock[selectedSize] <= 5 && (
              <p className="text-orange-400 text-sm mt-2">
                ⚠️ Apenas {stock[selectedSize]} unidade(s) em estoque
              </p>
            )}
          </div>

          {/* Adicionar ao carrinho */}
          <div className="flex flex-col gap-3">
            {stockError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{stockError}</span>
                <button onClick={clearStockError} className="text-red-400 hover:text-red-300">✕</button>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || adding}
                className={`flex-1 ${!selectedSize || adding ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {adding ? 'Verificando estoque...' : added ? '✓ Adicionado ao carrinho!' : 'Adicionar ao Carrinho'}
              </Button>
              
              {added && (
                <Link to="/carrinho">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Ver Carrinho
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Avaliações */}
          {product.reviews?.length > 0 && (
            <div className="border-t border-eliteGold/20 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white text-lg">Avaliações dos Clientes</h3>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(avgRating)} size="lg" />
                  <span className="text-white font-bold text-lg">{avgRating}</span>
                  <span className="text-gray-400">({product.reviews.length})</span>
                </div>
              </div>
              
              {/* Resumo das avaliações */}
              <div className="bg-eliteBlackSoft p-4 rounded-lg mb-4">
                <div className="grid grid-cols-5 gap-2 text-center text-sm">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = product.reviews.filter(r => r.rating === star).length;
                    const percent = (count / product.reviews.length) * 100;
                    return (
                      <div key={star} className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-eliteGold">★</span>
                          <span className="text-gray-400">{star}</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-eliteGold rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-gray-500 text-xs">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Lista de avaliações */}
              <div className="space-y-4">
                {product.reviews.map(review => (
                  <div key={review.id} className="bg-eliteBlackSoft p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-white font-medium">{review.user?.name || 'Cliente'}</span>
                        </div>
                        {review.title && (
                          <p className="font-semibold text-white">{review.title}</p>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Sem avaliações */}
          {(!product.reviews || product.reviews.length === 0) && (
            <div className="border-t border-eliteGold/20 pt-6 mt-6">
              <h3 className="font-semibold text-white text-lg mb-3">Avaliações</h3>
              <div className="bg-eliteBlackSoft p-6 rounded-lg text-center">
                <p className="text-gray-400">Este produto ainda não possui avaliações.</p>
                <p className="text-gray-500 text-sm mt-1">Seja o primeiro a avaliar após a compra!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
