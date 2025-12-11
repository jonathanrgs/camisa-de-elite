import { useState } from 'react';

export function ProductGallery({ images = [] }) {
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[3/4] bg-eliteBlackCard rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Sem imagens</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-[3/4] overflow-hidden rounded-lg">
        <img
          src={images[selected]?.url}
          alt="Produto"
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                selected === i ? 'border-eliteGold' : 'border-transparent'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
