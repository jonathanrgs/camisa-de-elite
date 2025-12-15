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
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]); // array de urls
  const [renaming, setRenaming] = useState(null); // url da imagem a renomear
  const [renameValue, setRenameValue] = useState('');

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

  // Filtro de busca
  const filteredImages = images.filter(img => {
    const fileName = img.split('/').pop()?.split('?')[0] || '';
    return fileName.toLowerCase().includes(search.toLowerCase());
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <h2 className="text-xl font-heading font-bold text-eliteGold whitespace-nowrap">Gerenciador de Mídia</h2>
          <input
            type="text"
            placeholder="Buscar imagem..."
            className="ml-4 px-3 py-2 rounded border border-gray-700 bg-black/40 text-gray-200 focus:outline-none focus:border-eliteGold w-full max-w-xs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition"
              onClick={async () => {
                if (!window.confirm('Deseja excluir as imagens selecionadas?')) return;
                setLoading(true);
                setError('');
                try {
                  const token = localStorage.getItem('token');
                  const res = await fetch('/api/admin/media', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ urls: selected })
                  });
                  if (!res.ok) throw new Error('Erro ao excluir imagens');
                  setImages(prev => prev.filter(img => !selected.includes(img)));
                  setSelected([]);
                } catch (err) {
                  setError('Erro ao excluir imagens');
                } finally {
                  setLoading(false);
                }
              }}
            >Excluir Selecionadas</button>
          )}
          <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-eliteGold/10 hover:bg-eliteGold/20 text-eliteGold rounded-lg font-medium transition-all border border-eliteGold/30">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span>Enviar Imagem</span>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
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
      ) : filteredImages.length === 0 ? (
        <div className="text-gray-400 text-center py-12">Nenhuma mídia encontrada no sistema.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((img, idx) => {
            let fileName = img.split('/').pop()?.split('?')[0] || 'imagem';
            const isSelected = selected.includes(img);
            return (
              <div key={img} className={`relative group border-2 rounded-lg overflow-hidden shadow transition-all bg-gray-900/60 ${isSelected ? 'border-eliteGold' : 'border-gray-800 hover:border-eliteGold/60'}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={e => {
                    setSelected(sel => e.target.checked ? [...sel, img] : sel.filter(u => u !== img));
                  }}
                  className="absolute top-2 left-2 z-10 w-4 h-4 accent-eliteGold bg-black/60 border border-gray-700 rounded"
                  title="Selecionar imagem"
                />
                <img
                  src={img}
                  alt={fileName}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                  title={fileName}
                  onClick={() => window.open(img, '_blank')}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-eliteGold px-2 py-1 truncate flex items-center gap-1">
                  <span className="flex-1 truncate">{fileName}</span>
                  <button
                    className="ml-1 text-xs text-blue-400 hover:text-blue-200 underline"
                    title="Renomear"
                    onClick={() => {
                      setRenaming(img);
                      setRenameValue(fileName.replace(/\.[^/.]+$/, ''));
                    }}
                  >Renomear</button>
                  <button
                    className="ml-1 text-xs text-red-400 hover:text-red-200 underline"
                    title="Excluir"
                    onClick={async () => {
                      if (!window.confirm('Deseja excluir esta imagem?')) return;
                      setLoading(true);
                      setError('');
                      try {
                        const token = localStorage.getItem('token');
                        const res = await fetch('/api/admin/media', {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                          },
                          body: JSON.stringify({ urls: [img] })
                        });
                        if (!res.ok) throw new Error('Erro ao excluir imagem');
                        setImages(prev => prev.filter(u => u !== img));
                        setSelected(sel => sel.filter(u => u !== img));
                      } catch (err) {
                        setError('Erro ao excluir imagem');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >Excluir</button>
                </div>
                {/* Modal de renomear */}
                {renaming === img && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 p-4">
                    <div className="bg-gray-900 rounded-lg p-4 w-full max-w-xs flex flex-col gap-2 border border-eliteGold">
                      <label className="text-eliteGold text-sm font-bold">Novo nome:</label>
                      <input
                        className="px-3 py-2 rounded border border-gray-700 bg-black/40 text-gray-200 focus:outline-none focus:border-eliteGold text-base w-full"
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value.replace(/[^\w\s.-]/g, ''))}
                        autoFocus
                        maxLength={80}
                        placeholder="Novo nome da imagem"
                        spellCheck={false}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          className="flex-1 px-2 py-1 bg-eliteGold text-black rounded font-bold hover:bg-yellow-400"
                          onClick={async () => {
                            if (!renameValue.trim()) return;
                            setLoading(true);
                            setError('');
                            try {
                              const ext = fileName.substring(fileName.lastIndexOf('.'));
                              const token = localStorage.getItem('token');
                              const res = await fetch('/api/admin/media/rename', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`
                                },
                                // Envia o nome com espaços, mas backend deve tratar encode
                                body: JSON.stringify({ url: img, newName: (renameValue + ext).replace(/\s+/g, ' ').trim() })
                              });
                              if (!res.ok) throw new Error('Erro ao renomear imagem');
                              const data = await res.json();
                              setImages(prev => prev.map(u => u === img ? data.data?.newUrl || data.newUrl : u));
                              setRenaming(null);
                            } catch (err) {
                              setError('Erro ao renomear imagem');
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >Salvar</button>
                        <button
                          className="flex-1 px-2 py-1 bg-gray-700 text-white rounded font-bold hover:bg-gray-600"
                          onClick={() => setRenaming(null)}
                        >Cancelar</button>
                      </div>
                    </div>
                  </div>
                )}
                {onSelect && (
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-eliteGold/80 text-eliteBlack text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onSelect(img)}
                  >Selecionar</button>
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
