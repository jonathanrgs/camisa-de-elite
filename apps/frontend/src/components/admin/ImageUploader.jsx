import { useState, useRef } from 'react';
import { imageService } from '../../services/imageService';

export function ImageUploader({ productId, images = [], onImagesChange, onError }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Upload de novas imagens
  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    // Validar arquivos
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        onError?.(`Arquivo ${file.name} não é uma imagem válida`);
        return false;
      }
      if (file.size > maxSize) {
        onError?.(`Arquivo ${file.name} é muito grande (máx 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      if (productId) {
        // Produto já existe - upload direto para o produto
        const result = await imageService.uploadProductImages(productId, validFiles);
        onImagesChange?.(result.images);
      } else {
        // Produto novo - upload genérico e retorna URLs
        const uploadedUrls = [];
        for (let i = 0; i < validFiles.length; i++) {
          const result = await imageService.uploadSingle(validFiles[i]);
          uploadedUrls.push(result.url);
        }
        onImagesChange?.([...images, ...uploadedUrls]);
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      onError?.(err.message || 'Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
    }
  };

  // Deletar imagem
  const handleDelete = async (imageUrl, index) => {
    if (productId) {
      // Produto existe - deletar via API
      try {
        const result = await imageService.deleteProductImage(productId, imageUrl);
        onImagesChange?.(result.images);
      } catch (err) {
        console.error('Erro ao deletar:', err);
        onError?.(err.response?.data?.message || 'Erro ao deletar imagem');
      }
    } else {
      // Produto novo - só remove do array local
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange?.(newImages);
    }
  };

  // Reordenar imagens (mover para cima/baixo)
  const handleReorder = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onImagesChange?.(newImages);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Área de upload com drag and drop */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
          ${dragActive 
            ? 'border-eliteGold bg-eliteGold/10' 
            : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/30'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-eliteGold border-t-transparent animate-spin" />
            <p className="text-gray-400">Enviando imagens...</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gray-800 flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-300 font-medium mb-1">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-gray-500 text-sm">
              JPG, PNG ou WebP • Máximo 5MB cada • Até 10 imagens
            </p>
          </>
        )}
      </div>

      {/* Preview das imagens */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{images.length} imagem(ns)</p>
            <p className="text-xs text-gray-500">Arraste para reordenar • A 1ª será a principal</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div 
                key={index} 
                className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-700 hover:border-gray-500 bg-gray-900"
              >
                <img 
                  src={img} 
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%239CA3AF" font-size="12">Erro</text></svg>';
                  }}
                />
                
                {/* Badge de posição */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-eliteGold text-black text-xs font-bold rounded">
                    Principal
                  </div>
                )}
                {index > 0 && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-black/70 text-white text-xs font-medium rounded flex items-center justify-center">
                    {index + 1}
                  </div>
                )}

                {/* Controles ao passar o mouse */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  {/* Botões de reordenar */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleReorder(index, index - 1); }}
                      disabled={index === 0}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Mover para esquerda"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleReorder(index, index + 1); }}
                      disabled={index === images.length - 1}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Mover para direita"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Botão de deletar */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(img, index); }}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                    title="Remover imagem"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
