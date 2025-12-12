import { Link } from 'react-router-dom';
import { useState } from 'react';

// Fallback: Camisa do Brasil
const FALLBACK_IMAGE = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';

// Componente de estrelas
function StarRating({ rating, reviews }) {
  const stars = [1, 2, 3, 4, 5];
  const avgRating = rating || 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${star <= avgRating ? 'text-eliteGold' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {reviews > 0 && (
        <span className="text-xs text-gray-500">({reviews})</span>
      )}
    </div>
  );
}

export function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // images agora é um array de strings (URLs)
  const primaryImage = !imageError && Array.isArray(product.images) && product.images[0] 
    ? product.images[0] 
    : FALLBACK_IMAGE;
  
  // Verifica estoque no novo formato (JSON string parseado)
  const hasStock = product.inventory ? 
    Object.values(typeof product.inventory.stock === 'string' 
      ? JSON.parse(product.inventory.stock) 
      : product.inventory.stock || {}
    ).some(qty => qty > 0) 
    : true;

  // Calcular total de estoque
  const totalStock = product.inventory ? 
    Object.values(typeof product.inventory.stock === 'string' 
      ? JSON.parse(product.inventory.stock) 
      : product.inventory.stock || {}
    ).reduce((acc, qty) => acc + qty, 0) 
    : 0;

  // Verifica se é produto novo (criado nos últimos 7 dias)
  const isNew = product.createdAt ? 
    (new Date() - new Date(product.createdAt)) < (7 * 24 * 60 * 60 * 1000) 
    : false;

  // Calcular média de avaliações
  const avgRating = product._count?.reviews > 0 && product.reviews?.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : product.avgRating || 0;

  const reviewCount = product._count?.reviews || product.reviewCount || 0;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <Link to={`/produto/${product.slug}`} className="card-hover group block overflow-hidden">
      <div 
        className="relative aspect-[3/4] overflow-hidden rounded-xl mb-3 bg-eliteBlackCard border border-gray-800/50 group-hover:border-eliteGold/30 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          }}
          onError={() => setImageError(true)}
        />

        {/* Overlay gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-eliteBlack/70 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Badges no topo */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {isNew && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-lg animate-fade-in">
                Novo
              </span>
            )}
            {totalStock > 0 && totalStock <= 5 && (
              <span className="bg-orange-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg">
                Últimas {totalStock}!
              </span>
            )}
          </div>
          
          {/* Badge de avaliação */}
          {avgRating > 0 && (
            <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3 text-eliteGold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white text-xs font-medium">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {!hasStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-sm font-medium border border-red-500/30">
              Esgotado
            </span>
          </div>
        )}

        {/* Quick view hint */}
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 bg-eliteGold text-eliteBlack px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-lg ${isHovered && hasStock ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Ver Detalhes
        </div>
      </div>

      <div className="px-1">
        {/* Categoria e Time */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {product.category && (
            <span className="bg-eliteGold/10 text-eliteGold/90 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border border-eliteGold/20">
              {product.category}
            </span>
          )}
          {product.team && (
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">{product.team}</span>
          )}
        </div>

        {/* Nome do produto */}
        <h3 className="font-semibold text-white group-hover:text-eliteGold transition-colors duration-300 line-clamp-2 text-sm leading-tight mb-2">
          {product.name}
        </h3>

        {/* Avaliação */}
        <div className="mb-2">
          <StarRating rating={Math.round(avgRating)} reviews={reviewCount} />
        </div>

        {/* Preço e estoque */}
        <div className="flex items-center justify-between">
          <p className="text-eliteGold font-bold text-lg group-hover:text-eliteGoldLight transition-colors">
            R$ {Number(product.price).toFixed(2).replace('.', ',')}
          </p>
          
          {hasStock && totalStock > 0 && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              totalStock <= 5 
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              {totalStock <= 5 ? `${totalStock} restantes` : 'Em estoque'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
