import { useState } from 'react';

// Fallback: Camisa do Brasil
const FALLBACK_IMAGE = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';

export function ProductGallery({ images = [] }) {
  const [selected, setSelected] = useState(0);
  const [imageError, setImageError] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Normaliza images - pode ser array de strings ou array de objetos
  const imageList = images.map((img, index) => {
    if (typeof img === 'string') return img;
    if (img?.url) return img.url;
    return FALLBACK_IMAGE;
  });

  // Se não houver imagens válidas, usa fallback
  const finalImages = imageList.length > 0 ? imageList : [FALLBACK_IMAGE];
  
  // Rótulos para as imagens (Frente/Verso/etc)
  const getImageLabel = (index) => {
    if (index === 0) return 'Frente';
    if (index === 1) return 'Verso';
    return `Imagem ${index + 1}`;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const currentImage = imageError[selected] ? FALLBACK_IMAGE : finalImages[selected];

  return (
    <div className="space-y-4">
      {/* Imagem principal com zoom */}
      <div 
        className="aspect-[3/4] overflow-hidden rounded-lg bg-eliteBlackCard cursor-zoom-in relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={currentImage}
          alt="Produto"
          className="w-full h-full object-cover transition-transform duration-200"
          style={{
            transform: isHovered ? 'scale(2)' : 'scale(1)',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          }}
          onError={() => setImageError(prev => ({ ...prev, [selected]: true }))}
        />
        
        {/* Indicador de zoom */}
        {!isHovered && (
          <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Passe o mouse para zoom
          </div>
        )}
      </div>

      {/* Miniaturas com labels Frente/Verso */}
      {finalImages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Visualizando:</span>
            <span className="text-eliteGold font-medium">{getImageLabel(selected)}</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {finalImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`flex-shrink-0 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selected === i 
                    ? 'border-eliteGold shadow-lg shadow-eliteGold/20' 
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="aspect-[3/4] relative">
                  <img 
                    src={imageError[i] ? FALLBACK_IMAGE : img} 
                    alt={getImageLabel(i)} 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(prev => ({ ...prev, [i]: true }))}
                  />
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-center text-xs py-1 text-gray-300">
                    {getImageLabel(i)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
