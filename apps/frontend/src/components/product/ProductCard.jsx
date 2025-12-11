import { Link } from 'react-router-dom';

export function ProductCard({ product }) {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const hasStock = product.inventories?.some(inv => inv.quantity > 0);

  return (
    <Link to={`/produto/${product.slug}`} className="card group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md mb-3">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-eliteBlackCard flex items-center justify-center">
            <span className="text-gray-500">Sem imagem</span>
          </div>
        )}

        {!hasStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="badge-error">Esgotado</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-white group-hover:text-eliteGold transition-colors truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          {product.team && <span className="text-xs text-gray-400">{product.team}</span>}
          {product.category && (
            <span className="badge-gold text-xs">{product.category}</span>
          )}
        </div>

        <p className="text-eliteGold font-semibold mt-2">
          R$ {Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
