import { useState, useEffect } from 'react';

// Página para rota /admin/midia
export function MediaManagerPage() {
  return <MediaManager />;
}

// Componente de gerenciamento de mídia (Cloudinary)
export function MediaManager({ onSelect }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Busca imagens já hospedadas no Cloudinary
  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/media', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Erro ao buscar imagens');
      }
      
      const data = await res.json();
      setImages(data.data?.images || data.images || []);
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
      setError('Erro ao buscar imagens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload de nova imagem
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao enviar imagem');
      }
      
      // Pega a URL da resposta (pode vir em data.url ou data.data.url)
      const imageUrl = data.data?.url || data.url;
      
      if (imageUrl) {
        setImages((prev) => [imageUrl, ...prev]);
      } else {
        setError('Erro ao enviar imagem');
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
      // Limpa o input para permitir reenviar o mesmo arquivo
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-heading font-bold text-eliteGold">Gerenciador de Mídia</h2>
        <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-eliteGold/10 hover:bg-eliteGold/20 text-eliteGold rounded-lg font-medium transition-all border border-eliteGold/30">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span>Enviar Imagem</span>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
          Enviando imagem...
        </div>
      )}
      {error && <div className="text-red-400 font-medium">{error}</div>}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
          Carregando imagens...
        </div>
      ) : images.length === 0 ? (
        <div className="text-gray-400 text-center py-12">Nenhuma mídia encontrada no sistema.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((img, idx) => {
            // Tenta extrair nome do arquivo da URL
            let fileName = img.split('/').pop()?.split('?')[0] || 'imagem';
            return (
              <div key={idx} className="relative group border border-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all bg-gray-900/60">
                <img
                  src={img}
                  alt={fileName}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                  title={fileName}
                  onClick={() => window.open(img, '_blank')}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-eliteGold px-2 py-1 truncate">
                  {fileName}
                </div>
                {onSelect && (
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-eliteGold/80 text-eliteBlack text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onSelect(img)}
                  >
                    Selecionar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MediaManager;
