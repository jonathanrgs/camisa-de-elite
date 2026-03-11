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

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-white tracking-tight">Avaliações</h1>
          <p className="text-gray-500 text-sm mt-1">{reviews.length} pendente{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl p-10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white font-medium text-sm">Tudo em dia</p>
          <p className="text-gray-500 text-xs mt-1">Nenhuma avaliação pendente de moderação</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900/30 border border-gray-800/60 rounded-xl px-5 py-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-gray-600 text-xs">
                      {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <p className="text-white font-medium text-sm">{review.product.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    por {review.authorName}
                    {review.user && ` · ${review.user.email}`}
                  </p>
                  
                  {review.comment && (
                    <p className="text-gray-300 text-sm mt-2 bg-white/[0.02] border border-gray-800/40 rounded-lg p-3 italic">
                      "{review.comment}"
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleModerate(review.id, true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg text-xs font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleModerate(review.id, false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    Rejeitar
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
