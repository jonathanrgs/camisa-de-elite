import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const inputClass = "w-full bg-white/[0.03] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-eliteGold/50 focus:outline-none transition-colors";

export function CategoriesAdminPage() {
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState('categories'); // 'categories' | 'types'
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: '', emoji: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, typeRes] = await Promise.all([
        adminService.getCategories(),
        adminService.getProductTypes(),
      ]);
      setCategories(catRes.data || []);
      setProductTypes(typeRes.data || []);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (tab === 'categories') {
        await adminService.createCategory(form);
      } else {
        await adminService.createProductType({ name: form.name });
      }
      setSuccess(`${tab === 'categories' ? 'Categoria' : 'Tipo'} criado com sucesso!`);
      setShowForm(false);
      setForm({ name: '', emoji: '' });
      loadData();
    } catch (err) {
      setError(err.message || 'Erro ao criar');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      if (tab === 'categories') {
        await adminService.updateCategory(editingItem.id, editingItem);
      } else {
        await adminService.updateProductType(editingItem.id, editingItem);
      }
      setSuccess('Atualizado com sucesso!');
      setEditingItem(null);
      loadData();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar');
    }
  };

  const handleToggle = async (item) => {
    try {
      if (tab === 'categories') {
        await adminService.updateCategory(item.id, { isActive: !item.isActive });
      } else {
        await adminService.updateProductType(item.id, { isActive: !item.isActive });
      }
      loadData();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar');
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (tab === 'categories') {
        await adminService.deleteCategory(confirmDelete.id);
      } else {
        await adminService.deleteProductType(confirmDelete.id);
      }
      setSuccess('Excluído com sucesso!');
      setConfirmDelete(null);
      loadData();
    } catch (err) {
      setError(err.message || 'Erro ao excluir');
      setConfirmDelete(null);
    }
  };

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => { setSuccess(''); setError(''); }, 4000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  const currentItems = tab === 'categories' ? categories : productTypes;
  const itemLabel = tab === 'categories' ? 'Categoria' : 'Tipo de Produto';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-eliteGold/30 border-t-eliteGold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Categorias & Tipos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie categorias e tipos de produto</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setForm({ name: '', emoji: '' }); }}
          className="flex items-center gap-2 px-4 py-2 bg-eliteGold text-eliteBlack font-semibold rounded-lg hover:bg-eliteGoldLight transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Novo {itemLabel}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900/50 p-1 rounded-lg w-fit">
        <button
          onClick={() => { setTab('categories'); setShowForm(false); setEditingItem(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'categories' ? 'bg-eliteGold/15 text-eliteGold' : 'text-gray-400 hover:text-white'}`}
        >
          Categorias ({categories.length})
        </button>
        <button
          onClick={() => { setTab('types'); setShowForm(false); setEditingItem(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'types' ? 'bg-eliteGold/15 text-eliteGold' : 'text-gray-400 hover:text-white'}`}
        >
          Tipos de Produto ({productTypes.length})
        </button>
      </div>

      {/* Alerts */}
      {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">{success}</div>}
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* New Item Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white/[0.02] border border-gray-800/60 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Novo {itemLabel}</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder={`Nome (ex: ${tab === 'categories' ? 'Nacional' : 'Feminina'})`}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputClass + ' flex-1'}
              required
            />
            {tab === 'categories' && (
              <input
                type="text"
                placeholder="Emoji (ex: 🇧🇷)"
                value={form.emoji}
                onChange={e => setForm({ ...form, emoji: e.target.value })}
                className={inputClass + ' w-24'}
              />
            )}
            <button type="submit" className="px-4 py-2 bg-eliteGold text-eliteBlack font-semibold rounded-lg hover:bg-eliteGoldLight transition-colors text-sm whitespace-nowrap">
              Criar
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {currentItems.map(item => (
          <div key={item.id} className="bg-white/[0.02] border border-gray-800/60 rounded-xl p-4 flex items-center gap-4">
            {/* Toggle Active */}
            <button onClick={() => handleToggle(item)} className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${item.isActive ? 'bg-green-600' : 'bg-gray-700'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.isActive ? 'left-5' : 'left-0.5'}`} />
            </button>

            {/* Item Info */}
            <div className="flex-1 min-w-0">
              {editingItem?.id === item.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                    className={inputClass + ' max-w-xs'}
                  />
                  {tab === 'categories' && (
                    <input
                      type="text"
                      value={editingItem.emoji || ''}
                      onChange={e => setEditingItem({ ...editingItem, emoji: e.target.value })}
                      className={inputClass + ' w-20'}
                      placeholder="Emoji"
                    />
                  )}
                  <button onClick={handleUpdate} className="px-3 py-1 bg-eliteGold text-eliteBlack rounded-lg text-sm font-semibold">Salvar</button>
                  <button onClick={() => setEditingItem(null)} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Cancelar</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {item.emoji && <span className="text-lg">{item.emoji}</span>}
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500">· {item._count?.products || 0} produto(s)</span>
                  {!item.isActive && <span className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">INATIVO</span>}
                </div>
              )}
            </div>

            {/* Actions */}
            {editingItem?.id !== item.id && (
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingItem({ id: item.id, name: item.name, emoji: item.emoji || '' })} className="p-2 text-gray-400 hover:text-eliteGold transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setConfirmDelete(item)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {currentItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum {itemLabel.toLowerCase()} cadastrado</p>
          <p className="text-sm mt-1">Clique em "Novo {itemLabel}" para começar</p>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title={`Excluir ${itemLabel}`}
        message={`Tem certeza que deseja excluir "${confirmDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
