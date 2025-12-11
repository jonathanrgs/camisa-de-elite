import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

export function ReviewsAdminPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await adminService.getPendingReviews();
      setReviews(response.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (reviewId, approve) => {
    try {
      await adminService.moderateReview(reviewId, approve);
      setMessage({ 
        type: 'success', 
        text: approve ? 'Avaliação aprovada!' : 'Avaliação rejeitada!' 
      });
      loadReviews();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-eliteGold">Avaliações Pendentes</h1>

      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl text-white mb-2">Nenhuma avaliação pendente</h2>
          <p className="text-gray-400">Todas as avaliações foram moderadas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-4">
              <div className="flex flex-wrap gap-4">
                {/* Info do produto e autor */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <p className="text-eliteGold font-medium">{review.product.name}</p>
                  <p className="text-gray-400 text-sm">
                    por {review.authorName}
                    {review.user && ` (${review.user.email})`}
                  </p>
                  
                  {review.comment && (
                    <p className="text-white mt-2 bg-gray-800/50 rounded-lg p-3">
                      "{review.comment}"
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleModerate(review.id, true)}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    ✓ Aprovar
                  </button>
                  <button
                    onClick={() => handleModerate(review.id, false)}
                    className="btn-secondary px-4 py-2 text-sm text-red-400 border-red-400/30 hover:bg-red-500/10"
                  >
                    ✕ Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
