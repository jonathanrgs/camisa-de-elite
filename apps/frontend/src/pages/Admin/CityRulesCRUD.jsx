import { useState } from 'react';

export function CityRulesCRUD({ cityRules, setCityRules }) {
  const [form, setForm] = useState({ city: '', state: '', type: 'fixed', value: '', kmRadius: '' });
  const [editIdx, setEditIdx] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleAddOrUpdate(e) {
    e.preventDefault();
    if (!form.city || !form.state || !form.value) return;
    const newRule = {
      city: form.city,
      state: form.state,
      type: form.type,
      value: parseFloat(form.value),
      kmRadius: form.type === 'km' ? parseInt(form.kmRadius) || 0 : undefined
    };
    if (editIdx !== null) {
      const updated = [...cityRules];
      updated[editIdx] = newRule;
      setCityRules(updated);
      setEditIdx(null);
    } else {
      setCityRules([...cityRules, newRule]);
    }
    setForm({ city: '', state: '', type: 'fixed', value: '', kmRadius: '' });
  }

  function handleEdit(idx) {
    const rule = cityRules[idx];
    setForm({
      city: rule.city,
      state: rule.state,
      type: rule.type,
      value: rule.value,
      kmRadius: rule.kmRadius || ''
    });
    setEditIdx(idx);
  }

  function handleDelete(idx) {
    setCityRules(cityRules.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  }

  return (
    <div>
      <form onSubmit={handleAddOrUpdate} className="flex flex-wrap gap-2 items-end mb-4">
        <input name="city" value={form.city} onChange={handleChange} placeholder="Cidade" className="input w-32" />
        <input name="state" value={form.state} onChange={handleChange} placeholder="UF" maxLength={2} className="input w-16" />
        <select name="type" value={form.type} onChange={handleChange} className="input w-28">
          <option value="fixed">Fixo</option>
          <option value="km">Por KM</option>
        </select>
        <input name="value" value={form.value} onChange={handleChange} placeholder={form.type === 'fixed' ? 'Valor (R$)' : 'R$/km'} type="number" min="0" step="0.01" className="input w-24" />
        {form.type === 'km' && (
          <input name="kmRadius" value={form.kmRadius} onChange={handleChange} placeholder="Raio km" type="number" min="1" className="input w-20" />
        )}
        <button type="submit" className="btn-primary px-3 py-1 text-sm">{editIdx !== null ? 'Atualizar' : 'Adicionar'}</button>
        {editIdx !== null && (
          <button type="button" onClick={() => { setForm({ city: '', state: '', type: 'fixed', value: '', kmRadius: '' }); setEditIdx(null); }} className="btn px-2 py-1 text-xs ml-1">Cancelar</button>
        )}
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-eliteGold">
              <th className="px-2 py-1 text-left">Cidade</th>
              <th className="px-2 py-1 text-left">UF</th>
              <th className="px-2 py-1 text-left">Tipo</th>
              <th className="px-2 py-1 text-left">Valor</th>
              <th className="px-2 py-1 text-left">Raio (km)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cityRules.length === 0 && (
              <tr><td colSpan={6} className="text-gray-500 text-center py-2">Nenhuma regra cadastrada</td></tr>
            )}
            {cityRules.map((rule, idx) => (
              <tr key={idx} className="border-b border-gray-800">
                <td className="px-2 py-1">{rule.city}</td>
                <td className="px-2 py-1">{rule.state}</td>
                <td className="px-2 py-1">{rule.type === 'fixed' ? 'Fixo' : 'Por KM'}</td>
                <td className="px-2 py-1">R$ {rule.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="px-2 py-1">{rule.type === 'km' ? rule.kmRadius : '-'}</td>
                <td className="px-2 py-1 flex gap-1">
                  <button type="button" onClick={() => handleEdit(idx)} className="btn px-2 py-1 text-xs">Editar</button>
                  <button type="button" onClick={() => handleDelete(idx)} className="btn px-2 py-1 text-xs text-red-400">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}