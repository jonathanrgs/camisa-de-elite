import { useState, useEffect } from 'react';
import { imageService } from '../../services/imageService';

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
  const [selected, setSelected] = useState([]);
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const imgs = await imageService.listMedia();
      setImages(imgs);
    } catch {
      setError('Erro ao buscar imagens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const filteredImages = images.filter(img => {
    const fileName = img.split('/').pop()?.split('?')[0] || '';
    return fileName.toLowerCase().includes(search.toLowerCase());
  });

  const handleUpload = async (e, filesArg) => {
    const files = filesArg || e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      let newImages = [];
      for (const file of files) {
        const data = await imageService.uploadSingle(file);
        const imageUrl = data.data?.url || data.url;
        if (imageUrl) newImages.push(imageUrl);
      }
      if (newImages.length > 0) setImages(prev => [...newImages, ...prev]);
    } catch (err) {
      setError(err.message || 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
      if (e && e.target) e.target.value = '';
    }
  };

  const handleDeleteMany = async (urls) => {
    if (!window.confirm(urls.length > 1 ? 'Deseja excluir as imagens selecionadas?' : 'Deseja excluir esta imagem?')) return;
    setLoading(true);
    setError('');
    try {
      await imageService.deleteMedia(urls);
      setImages(prev => prev.filter(img => !urls.includes(img)));
      setSelected(sel => sel.filter(u => !urls.includes(u)));
    } catch (err) {
      setError(err.message || 'Erro ao excluir imagens');
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (img) => {
    if (!renameValue.trim()) return;
    setLoading(true);
    setError('');
    try {
      const cleanName = renameValue.replace(/\.[^/.]+$/, '').replace(/\s+/g, ' ').trim();
      const newUrl = await imageService.renameMedia(img, cleanName);
      setImages(prev => prev.map(u => u === img ? newUrl : u));
      setRenaming(null);
    } catch (err) {
      setError(err.message || 'Erro ao renomear imagem');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.03] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-eliteGold/50 focus:outline-none transition-colors";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-white tracking-tight">Mídia</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Carregando...' : `${filteredImages.length} imagen${filteredImages.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button
              onClick={() => handleDeleteMany(selected)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Excluir ({selected.length})
            </button>
          )}
          <label className="inline-flex items-center gap-1.5 cursor-pointer px-4 py-2 bg-eliteGold/15 hover:bg-eliteGold/25 text-eliteGold rounded-lg text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
            Enviar
            <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth={1.5} /><path strokeLinecap="round" strokeWidth={1.5} d="m21 21-4.35-4.35" /></svg>
        <input
          type="text"
          placeholder="Buscar imagem por nome..."
          className={`${inputClass} pl-9`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Status messages */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="animate-spin w-4 h-4 border-2 border-eliteGold border-t-transparent rounded-full" />
          Enviando imagem...
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
          </div>
          <p className="text-gray-500 text-sm">Nenhuma mídia encontrada</p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 transition-colors rounded-xl ${dragOver ? 'ring-2 ring-eliteGold/40 ring-dashed bg-eliteGold/[0.02]' : ''}`}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); e.stopPropagation(); setDragOver(false); if (e.dataTransfer.files?.length) handleUpload(null, e.dataTransfer.files); }}
        >
          {filteredImages.map((img) => {
            const fileName = img.split('/').pop()?.split('?')[0] || 'imagem';
            const isSelected = selected.includes(img);
            return (
              <div key={img} className={`relative group rounded-xl overflow-hidden border transition-all ${isSelected ? 'border-eliteGold/60 ring-1 ring-eliteGold/30' : 'border-gray-800/60 hover:border-gray-700'}`}>
                {/* Checkbox */}
                <div
                  className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${isSelected ? 'bg-eliteGold border-eliteGold' : 'bg-black/50 border-gray-600 hover:border-gray-400'}`}
                  onClick={() => setSelected(sel => isSelected ? sel.filter(u => u !== img) : [...sel, img])}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>

                {/* Image */}
                <div
                  className="aspect-square cursor-pointer overflow-hidden bg-gray-900/50"
                  onClick={() => setSelected(sel => isSelected ? sel.filter(u => u !== img) : [...sel, img])}
                >
                  <img
                    src={img}
                    alt={fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Overlay actions (visible on hover) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white/80 truncate mb-2" title={decodeURIComponent(fileName)}>{decodeURIComponent(fileName)}</p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      title="Visualizar"
                      onClick={e => { e.stopPropagation(); window.open(img, '_blank'); }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <button
                      type="button"
                      className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
                      title="Excluir"
                      onClick={e => { e.stopPropagation(); handleDeleteMany([img]); }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                {/* Rename modal */}
                {renaming === img && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 p-3" onClick={() => setRenaming(null)}>
                    <div className="bg-gray-900 border border-gray-800/60 rounded-xl p-4 w-full max-w-xs space-y-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Renomear</p>
                        <button onClick={() => setRenaming(null)} className="text-gray-500 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <input
                        className={inputClass}
                        value={renameValue}
                        onChange={e => {
                          let val = e.target.value;
                          val = val.replace(/\.[^/.]+$/, '');
                          val = val.replace(/[^\w\s.-]/g, '');
                          setRenameValue(val);
                        }}
                        autoFocus
                        maxLength={80}
                        placeholder="Novo nome"
                        spellCheck={false}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleRename(img)} className="flex-1 px-3 py-1.5 bg-eliteGold/15 hover:bg-eliteGold/25 text-eliteGold rounded-lg text-xs font-medium transition-colors">Salvar</button>
                        <button onClick={() => setRenaming(null)} className="flex-1 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] text-gray-400 rounded-lg text-xs font-medium transition-colors">Cancelar</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating select button for ProductsAdminPage integration */}
      {onSelect && selected.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[110] pointer-events-none">
          <button
            className="px-5 py-2.5 bg-eliteGold text-black font-bold rounded-xl shadow-lg border border-eliteGold/40 hover:bg-yellow-400 transition-all pointer-events-auto text-sm"
            onClick={() => onSelect(selected)}
          >
            Selecionar {selected.length} imagem{selected.length > 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}

export default MediaManager;
