import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const inputClass = "w-full bg-white/[0.03] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-eliteGold/50 focus:outline-none transition-colors";

export function SizesAdminPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupForm, setGroupForm] = useState({ name: '' });
  const [editingSize, setEditingSize] = useState(null);
  const [sizeForm, setSizeForm] = useState({ label: '', comprimento: '', largura: '', altura: '', peso: '' });
  const [addingSizeGroupId, setAddingSizeGroupId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { loadGroups(); }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSizeGroups();
      setGroups(res.data || []);
    } catch (err) {
      setError(err.message || 'Erro ao carregar grupos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await adminService.createSizeGroup(groupForm);
      setSuccess('Grupo criado com sucesso!');
      setShowForm(false);
      setGroupForm({ name: '' });
      loadGroups();
    } catch (err) {
      setError(err.message || 'Erro ao criar grupo');
    }
  };

  const handleUpdateGroup = async (id) => {
    try {
      await adminService.updateSizeGroup(id, editingGroup);
      setSuccess('Grupo atualizado!');
      setEditingGroup(null);
      loadGroups();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar grupo');
    }
  };

  const handleToggleGroup = async (group) => {
    try {
      await adminService.updateSizeGroup(group.id, { isActive: !group.isActive });
      loadGroups();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar grupo');
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirmDelete) return;
    try {
      await adminService.deleteSizeGroup(confirmDelete.id);
      setSuccess('Grupo excluído!');
      setConfirmDelete(null);
      loadGroups();
    } catch (err) {
      setError(err.message || 'Erro ao excluir grupo');
      setConfirmDelete(null);
    }
  };

  const handleCreateSize = async (groupId) => {
    try {
      await adminService.createSize(groupId, sizeForm);
      setSuccess('Tamanho adicionado!');
      setAddingSizeGroupId(null);
      setSizeForm({ label: '', comprimento: '', largura: '', altura: '', peso: '' });
      loadGroups();
    } catch (err) {
      setError(err.message || 'Erro ao criar tamanho');
    }
  };

  const handleUpdateSize = async (id) => {
    try {
      await adminService.updateSize(id, editingSize);
      setSuccess('Tamanho atualizado!');
      setEditingSize(null);
      loadGroups();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar tamanho');
    }
  };

  const handleToggleSize = async (size) => {
    try {
      await adminService.updateSize(size.id, { isActive: !size.isActive });
      loadGroups();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar tamanho');
    }
  };

  const handleDeleteSize = async () => {
    if (!confirmDelete) return;
    try {
      await adminService.deleteSize(confirmDelete.id);
      setSuccess('Tamanho excluído!');
      setConfirmDelete(null);
      loadGroups();
    } catch (err) {
      setError(err.message || 'Erro ao excluir tamanho');
      setConfirmDelete(null);
    }
  };

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => { setSuccess(''); setError(''); }, 4000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

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
          <h1 className="text-2xl font-heading font-bold text-white">Grupos de Tamanho</h1>
          <p className="text-sm text-gray-500 mt-1">{groups.length} grupo(s) cadastrado(s)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-eliteGold text-eliteBlack font-semibold rounded-lg hover:bg-eliteGoldLight transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Novo Grupo
        </button>
      </div>

      {/* Alerts */}
      {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">{success}</div>}
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* New Group Form */}
      {showForm && (
        <form onSubmit={handleCreateGroup} className="bg-white/[0.02] border border-gray-800/60 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Novo Grupo de Tamanho</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Nome do grupo (ex: Feminino)"
              value={groupForm.name}
              onChange={e => setGroupForm({ name: e.target.value })}
              className={inputClass + ' flex-1'}
              required
            />
            <button type="submit" className="px-4 py-2 bg-eliteGold text-eliteBlack font-semibold rounded-lg hover:bg-eliteGoldLight transition-colors text-sm whitespace-nowrap">
              Criar Grupo
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Groups List */}
      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="bg-white/[0.02] border border-gray-800/60 rounded-xl overflow-hidden">
            {/* Group Header */}
            <div className="flex items-center gap-4 p-4">
              {/* Toggle Active */}
              <button onClick={() => handleToggleGroup(group)} className={`w-10 h-5 rounded-full transition-colors relative ${group.isActive ? 'bg-green-600' : 'bg-gray-700'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${group.isActive ? 'left-5' : 'left-0.5'}`} />
              </button>

              {/* Group Name */}
              <div className="flex-1 min-w-0">
                {editingGroup?.id === group.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingGroup.name}
                      onChange={e => setEditingGroup({ ...editingGroup, name: e.target.value })}
                      className={inputClass + ' max-w-xs'}
                    />
                    <button onClick={() => handleUpdateGroup(group.id)} className="px-3 py-1 bg-eliteGold text-eliteBlack rounded-lg text-sm font-semibold">Salvar</button>
                    <button onClick={() => setEditingGroup(null)} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">Cancelar</button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-white font-semibold">{group.name}</h3>
                    <p className="text-xs text-gray-500">{group.sizes?.length || 0} tamanho(s) · {group._count?.products || 0} produto(s)</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingGroup({ id: group.id, name: group.name })} className="p-2 text-gray-400 hover:text-eliteGold transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => setConfirmDelete({ type: 'group', id: group.id, name: group.name })} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button onClick={() => setExpanded(p => ({ ...p, [group.id]: !p[group.id] }))} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <svg className={`w-4 h-4 transition-transform ${expanded[group.id] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
            </div>

            {/* Sizes Table (Expanded) */}
            {expanded[group.id] && (
              <div className="border-t border-gray-800/60 p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase">
                      <th className="text-left pb-3 font-medium">Ativo</th>
                      <th className="text-left pb-3 font-medium">Label</th>
                      <th className="text-left pb-3 font-medium">Comprimento (cm)</th>
                      <th className="text-left pb-3 font-medium">Largura (cm)</th>
                      <th className="text-left pb-3 font-medium">Altura (cm)</th>
                      <th className="text-left pb-3 font-medium">Peso (kg)</th>
                      <th className="text-right pb-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40">
                    {group.sizes?.map(size => (
                      <tr key={size.id} className={`${!size.isActive ? 'opacity-50' : ''}`}>
                        {editingSize?.id === size.id ? (
                          <>
                            <td className="py-2"><button onClick={() => handleToggleSize(size)} className={`w-8 h-4 rounded-full transition-colors relative ${size.isActive ? 'bg-green-600' : 'bg-gray-700'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${size.isActive ? 'left-4' : 'left-0.5'}`} /></button></td>
                            <td className="py-2"><input value={editingSize.label} onChange={e => setEditingSize({ ...editingSize, label: e.target.value })} className={inputClass + ' max-w-[80px]'} /></td>
                            <td className="py-2"><input value={editingSize.comprimento || ''} onChange={e => setEditingSize({ ...editingSize, comprimento: e.target.value })} className={inputClass + ' max-w-[100px]'} placeholder="69-71" /></td>
                            <td className="py-2"><input value={editingSize.largura || ''} onChange={e => setEditingSize({ ...editingSize, largura: e.target.value })} className={inputClass + ' max-w-[100px]'} placeholder="53-55" /></td>
                            <td className="py-2"><input value={editingSize.altura || ''} onChange={e => setEditingSize({ ...editingSize, altura: e.target.value })} className={inputClass + ' max-w-[100px]'} placeholder="162-170" /></td>
                            <td className="py-2"><input value={editingSize.peso || ''} onChange={e => setEditingSize({ ...editingSize, peso: e.target.value })} className={inputClass + ' max-w-[100px]'} placeholder="50-62" /></td>
                            <td className="py-2 text-right">
                              <button onClick={() => handleUpdateSize(size.id)} className="text-eliteGold hover:text-eliteGoldLight mr-2 text-xs font-semibold">Salvar</button>
                              <button onClick={() => setEditingSize(null)} className="text-gray-400 hover:text-white text-xs">Cancelar</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2"><button onClick={() => handleToggleSize(size)} className={`w-8 h-4 rounded-full transition-colors relative ${size.isActive ? 'bg-green-600' : 'bg-gray-700'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${size.isActive ? 'left-4' : 'left-0.5'}`} /></button></td>
                            <td className="py-2 text-white font-medium">{size.label}</td>
                            <td className="py-2 text-gray-400">{size.comprimento || '—'}</td>
                            <td className="py-2 text-gray-400">{size.largura || '—'}</td>
                            <td className="py-2 text-gray-400">{size.altura || '—'}</td>
                            <td className="py-2 text-gray-400">{size.peso || '—'}</td>
                            <td className="py-2 text-right">
                              <button onClick={() => setEditingSize({ id: size.id, label: size.label, comprimento: size.comprimento || '', largura: size.largura || '', altura: size.altura || '', peso: size.peso || '' })} className="text-gray-400 hover:text-eliteGold mr-3 transition-colors">
                                <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button onClick={() => setConfirmDelete({ type: 'size', id: size.id, name: size.label })} className="text-gray-400 hover:text-red-400 transition-colors">
                                <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}

                    {/* Add Size Row */}
                    {addingSizeGroupId === group.id ? (
                      <tr>
                        <td className="py-2" />
                        <td className="py-2"><input value={sizeForm.label} onChange={e => setSizeForm({ ...sizeForm, label: e.target.value })} className={inputClass + ' max-w-[80px]'} placeholder="XL" required /></td>
                        <td className="py-2"><input value={sizeForm.comprimento} onChange={e => setSizeForm({ ...sizeForm, comprimento: e.target.value })} className={inputClass + ' max-w-[100px]'} placeholder="69-71" /></td>
                        <td className="py-2"><input value={sizeForm.largura} onChange={e => setSizeForm({ ...sizeForm, largura: e.target.value })} className={inputClass + ' max-w-[100px]'} placeholder="53-55" /></td>
                        <td className="py-2"><input value={sizeForm.altura} onChange={e => setSizeForm({ ...sizeForm, altura: e.target.value })} className={inputClass + ' max-w-[100px]'} placeholder="162-170" /></td>
                        <td className="py-2"><input value={sizeForm.peso} onChange={e => setSizeForm({ ...sizeForm, peso: e.target.value })} className={inputClass + ' max-w-[100px]'} placeholder="50-62" /></td>
                        <td className="py-2 text-right">
                          <button onClick={() => handleCreateSize(group.id)} className="text-eliteGold hover:text-eliteGoldLight mr-2 text-xs font-semibold">Adicionar</button>
                          <button onClick={() => { setAddingSizeGroupId(null); setSizeForm({ label: '', comprimento: '', largura: '', altura: '', peso: '' }); }} className="text-gray-400 hover:text-white text-xs">Cancelar</button>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>

                <button
                  onClick={() => { setAddingSizeGroupId(group.id); setSizeForm({ label: '', comprimento: '', largura: '', altura: '', peso: '' }); }}
                  className="mt-3 flex items-center gap-1 text-sm text-eliteGold hover:text-eliteGoldLight transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Adicionar Tamanho
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {groups.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum grupo de tamanho cadastrado</p>
          <p className="text-sm mt-1">Clique em "Novo Grupo" para começar</p>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title={confirmDelete?.type === 'group' ? 'Excluir Grupo de Tamanho' : 'Excluir Tamanho'}
        message={`Tem certeza que deseja excluir "${confirmDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
        onConfirm={confirmDelete?.type === 'group' ? handleDeleteGroup : handleDeleteSize}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
