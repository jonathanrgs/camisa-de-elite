import { Link } from 'react-router-dom';
import { useState } from 'react';

// Fallback: Camisa do Brasil
const FALLBACK_IMAGE = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';

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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <Link to={`/produto/${product.slug}`} className="card group block">
      <div 
        className="relative aspect-[3/4] overflow-hidden rounded-md mb-3 bg-eliteBlackCard"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: isHovered ? 'scale(1.8)' : 'scale(1)',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          }}
          onError={() => setImageError(true)}
        />

        {!hasStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">Esgotado</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-white group-hover:text-eliteGold transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {product.team && <span className="text-xs text-gray-400">{product.team}</span>}
          {product.category && (
            <span className="bg-eliteGold/20 text-eliteGold px-2 py-0.5 rounded text-xs">
              {product.category}
            </span>
          )}
        </div>

        <p className="text-eliteGold font-semibold mt-2 text-lg">
          R$ {Number(product.price).toFixed(2).replace('.', ',')}
        </p>
      </div>
    </Link>
  );
}
