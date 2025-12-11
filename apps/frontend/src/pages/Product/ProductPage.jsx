import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../hooks/useCart';
import { ProductGallery, Button, Spinner } from '../../components';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galeria */}
        <ProductGallery images={product.images} />

        {/* Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="badge-gold mb-2">{product.category}</span>
            )}
            <h1 className="font-heading text-3xl text-white">{product.name}</h1>
            {product.team && (
              <p className="text-gray-400">{product.team} • {product.league}</p>
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
            R$ {Number(product.price).toFixed(2)}
          </p>

          {product.description && (
            <p className="text-gray-300">{product.description}</p>
          )}

          {/* Tamanhos */}
          <div>
            <h3 className="font-semibold mb-3">Tamanho</h3>
            <div className="flex flex-wrap gap-2">
              {product.inventories?.map(inv => {
                const available = inv.quantity > 0;
                return (
                  <button
                    key={inv.size}
                    disabled={!available}
                    onClick={() => setSelectedSize(inv.size)}
                    className={`w-12 h-12 rounded border-2 transition-colors ${
                      selectedSize === inv.size
                        ? 'border-eliteGold bg-eliteGold text-eliteBlack'
                        : available
                          ? 'border-eliteGold/40 hover:border-eliteGold'
                          : 'border-gray-600 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {inv.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Adicionar ao carrinho */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {added ? '✓ Adicionado!' : 'Adicionar ao Carrinho'}
            </Button>
          </div>

          {/* Avaliações */}
          {product.reviews?.length > 0 && (
            <div className="border-t border-eliteGold/20 pt-6 mt-6">
              <h3 className="font-semibold mb-4">Avaliações</h3>
              <div className="space-y-4">
                {product.reviews.map(review => (
                  <div key={review.id} className="bg-eliteBlackSoft p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-eliteGold">{'★'.repeat(review.rating)}</span>
                      <span className="text-gray-400 text-sm">{review.user?.name}</span>
                    </div>
                    {review.title && <p className="font-medium">{review.title}</p>}
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
