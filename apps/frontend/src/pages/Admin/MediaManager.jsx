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

  // Upload de nova(s) imagem(ns)
  const handleUpload = async (e, filesArg) => {
    const files = filesArg || e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      let newImages = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
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
        const imageUrl = data.data?.url || data.url;
        if (imageUrl) {
          newImages.push(imageUrl);
        }
      }
      if (newImages.length > 0) {
        setImages((prev) => [...newImages, ...prev]);
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
      if (e && e.target) e.target.value = '';
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
        <div className="flex items-center gap-2" 
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleUpload(null, e.dataTransfer.files);
            }
          }}
        >
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
            <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="hidden" />
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
        <div className="grid gap-3 justify-start" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 0fr))'}}>
          {filteredImages.map((img, idx) => {
            let fileName = img.split('/').pop()?.split('?')[0] || 'imagem';
            const isSelected = selected.includes(img);
            return (
              <div key={img} className={`relative group border-2 rounded-lg overflow-hidden shadow transition-all bg-gray-900/60 ${isSelected ? 'border-eliteGold' : 'border-gray-800 hover:border-eliteGold/60'} max-w-[320px] mx-auto`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="absolute top-2 left-2 z-10 w-4 h-4 accent-eliteGold bg-black/60 border border-gray-700 rounded pointer-events-none"
                  tabIndex={-1}
                  title="Selecionar imagem"
                />
                <div className="relative w-full h-64 cursor-pointer group"
                  onClick={() => setSelected(sel => isSelected ? sel.filter(u => u !== img) : [...sel, img])}
                  title={isSelected ? 'Desmarcar imagem' : 'Selecionar imagem'}
                >
                  <img
                    src={img}
                    alt={fileName}
                    className={`w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200 border-b-2 border-eliteGold/30 ${isSelected ? 'ring-4 ring-eliteGold/60' : ''}`}
                    style={{ boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
                    title="Visualizar imagem em nova aba"
                    onClick={e => { e.stopPropagation(); window.open(img, '_blank'); }}
                  >
                    <svg className="w-5 h-5 mx-auto my-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-7 9-9 9s-9-4-9-9 7-9 9-9 9 4 9 9z" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-4 py-3 flex flex-col items-center gap-2">
                  <span className="block text-eliteGold text-base font-bold truncate w-full text-center drop-shadow" title={decodeURIComponent(fileName)}>{decodeURIComponent(fileName)}</span>
                  <div className="flex justify-center gap-3 w-full">
                    <button
                      className="flex-1 px-2 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow"
                      title="Renomear"
                      onClick={() => {
                        setRenaming(img);
                        setRenameValue(fileName.replace(/\.[^/.]+$/, ''));
                      }}
                    >Renomear</button>
                    <button
                      className="flex-1 px-2 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition shadow"
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
                {/* Botão de seleção individual removido para seleção múltipla */}
                    {/* Botão de seleção múltipla para integração com ProductsAdminPage */}
                    {onSelect && selected.length > 0 && (
                      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[110] pointer-events-none">
                        <button
                          className="px-6 py-3 bg-eliteGold text-black font-bold rounded-xl shadow-lg border border-eliteGold/40 hover:bg-yellow-400 transition-all pointer-events-auto"
                          style={{ minWidth: 220 }}
                          onClick={() => onSelect(selected)}
                        >
                          Selecionar {selected.length} imagem{selected.length > 1 ? 's' : ''}
                        </button>
                      </div>
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
