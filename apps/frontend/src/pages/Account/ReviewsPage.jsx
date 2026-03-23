import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';

// Imagem padrão quando o produto não tem imagens
const FALLBACK_IMG = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';

export function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [productsToReview, setProductsToReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsRes, pendingRes] = await Promise.all([
        userService.getMyReviews(),
        userService.getProductsToReview()
      ]);
      setReviews(reviewsRes.reviews);
      setProductsToReview(pendingRes.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openReviewForm = (product) => {
    setSelectedProduct(product);
    setFormData({ rating: 5, comment: '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await userService.createReview({
        productId: selectedProduct.id,
        rating: formData.rating,
        comment: formData.comment
      });
      setMessage({ type: 'success', text: 'Avaliação enviada para moderação!' });
      setShowForm(false);
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, editable = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={editable ? 'button' : undefined}
            onClick={editable ? () => setFormData({ ...formData, rating: star }) : undefined}
            className={`text-xl ${editable ? 'cursor-pointer' : ''} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-400 mt-2">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Produtos para avaliar */}
      {productsToReview.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Produtos para avaliar
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Avalie os produtos dos seus pedidos entregues
          </p>
          
          <div className="grid gap-4">
            {productsToReview.map((product) => (
              <div key={product.id} className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-3">
                <img
                  src={product.images?.[0] || FALLBACK_IMG}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-white">{product.name}</p>
                  <p className="text-gray-400 text-sm">
                    Pedido de {new Date(product.orderDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => openReviewForm(product)}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Avaliar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de avaliação */}
      {showForm && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">
              Avaliar {selectedProduct.name}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sua nota</label>
                {renderStars(formData.rating, true)}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Comentário (opcional)</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-eliteBlack border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-eliteGold focus:outline-none min-h-[100px]"
                  placeholder="Conte sua experiência com o produto..."
                />
              </div>

              <div className="flex gap-3">
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
                  {submitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Minhas avaliações */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-eliteGold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          Minhas Avaliações
        </h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-eliteGold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </div>
            <p className="text-gray-400">Você ainda não fez nenhuma avaliação.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={review.product.images?.[0] || FALLBACK_IMG}
                    alt={review.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link 
                      to={`/produto/${review.product.slug}`}
                      className="text-white hover:text-eliteGold transition-colors"
                    >
                      {review.product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        review.isApproved 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {review.isApproved ? 'Publicada' : 'Em moderação'}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-400 text-sm mt-2">{review.comment}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
