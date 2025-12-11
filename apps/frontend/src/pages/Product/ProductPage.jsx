import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../hooks/useCart';
import { ProductGallery, Button, Spinner } from '../../components';

// Ordem dos tamanhos para exibição
const SIZE_ORDER = ['P', 'M', 'G', 'GG', 'XG'];

export function ProductPage() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

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

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
              <span className="text-eliteGold">★</span>
              <span>{avgRating}</span>
              <span className="text-gray-500">({product.reviews.length} avaliações)</span>
            </div>
          )}

          <p className="text-eliteGold text-3xl font-bold">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </p>

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
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`flex-1 ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {added ? '✓ Adicionado ao carrinho!' : 'Adicionar ao Carrinho'}
            </Button>
            
            {added && (
              <Link to="/carrinho">
                <Button variant="outline" className="w-full sm:w-auto">
                  Ver Carrinho
                </Button>
              </Link>
            )}
          </div>

          {/* Avaliações */}
          {product.reviews?.length > 0 && (
            <div className="border-t border-eliteGold/20 pt-6 mt-6">
              <h3 className="font-semibold mb-4 text-white">Avaliações</h3>
              <div className="space-y-4">
                {product.reviews.map(review => (
                  <div key={review.id} className="bg-eliteBlackSoft p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-eliteGold">{'★'.repeat(review.rating)}</span>
                      <span className="text-gray-400 text-sm">{review.user?.name}</span>
                    </div>
                    {review.title && <p className="font-medium text-white">{review.title}</p>}
                    {review.comment && <p className="text-gray-300 text-sm">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
