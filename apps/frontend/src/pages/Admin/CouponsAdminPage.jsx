
import { useEffect, useState } from 'react';
import { couponApi } from '../../services/couponApi';

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', discount: '', type: 'percent', expiresAt: '', maxUses: '', minTotal: '' });
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => { fetchCoupons(); }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const data = await couponApi.list();
      setCoupons(data);
      setError('');
    } catch {
      setError('Erro ao carregar cupons');
    }
    setLoading(false);
  }

  function handleEdit(coupon) {
    setEditing(coupon.id);
    setShowForm(true);
    setForm({
      code: coupon.code,
      discount: coupon.value ?? coupon.discount ?? '',
      type: coupon.type,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      maxUses: coupon.maxUses || '',
      minTotal: coupon.minTotal ?? ''
    });
    setSuccess('');
    setError('');
  }

  function handleCancel() {
    setEditing(null);
    setShowForm(false);
    setForm({ code: '', discount: '', type: 'percent', expiresAt: '', maxUses: '', minTotal: '' });
    setSuccess('');
    setError('');
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja remover este cupom?')) return;
    try {
      await couponApi.remove(id);
      setSuccess('Cupom removido com sucesso!');
      setError('');
      fetchCoupons();
    } catch {
      setError('Erro ao remover cupom');
    }
  }

  async function handleToggleActive(coupon) {
    try {
      await couponApi.update(coupon.id, { isActive: !coupon.isActive });
      fetchCoupons();
    } catch {
      setError('Erro ao alterar status');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const payload = {
        ...form,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        minTotal: form.minTotal ? Number(form.minTotal) : 0,
        value: Number(form.discount)
      };
      if (editing) {
        await couponApi.update(editing, payload);
        setSuccess('Cupom atualizado!');
      } else {
        await couponApi.create(payload);
        setSuccess('Cupom criado!');
      }
      handleCancel();
      fetchCoupons();
    } catch {
      setError('Erro ao salvar cupom');
    }
  }

  const toggleExpand = id => setExpanded(exp => ({ ...exp, [id]: !exp[id] }));

  const inputClass = "w-full bg-white/[0.03] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-eliteGold/50 focus:outline-none transition-colors";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl text-white tracking-tight">Cupons</h1>
          <p className="text-gray-500 text-sm mt-1">{coupons.length} cupom{coupons.length !== 1 ? 'ns' : ''} cadastrado{coupons.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { handleCancel(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-eliteGold/15 hover:bg-eliteGold/25 text-eliteGold rounded-lg transition-all text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
          {showForm ? 'Fechar' : 'Novo Cupom'}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900/30 border border-gray-800/60 rounded-xl p-5 space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{editing ? 'Editar Cupom' : 'Novo Cupom'}</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Código</label>
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="EX: SAVE10" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Desconto</label>
              <div className="flex gap-2">
                <input type="number" min="0" step="0.01" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} required placeholder="10" className={`${inputClass} flex-1`} />
                <div className="flex rounded-lg overflow-hidden border border-gray-800">
                  <button type="button" onClick={() => setForm(f => ({ ...f, type: 'percent' }))} className={`px-3 py-2 text-xs font-bold transition-colors ${form.type === 'percent' ? 'bg-eliteGold/20 text-eliteGold' : 'bg-white/[0.02] text-gray-500 hover:text-white'}`}>%</button>
                  <button type="button" onClick={() => setForm(f => ({ ...f, type: 'fixed' }))} className={`px-3 py-2 text-xs font-bold transition-colors border-l border-gray-800 ${form.type === 'fixed' ? 'bg-eliteGold/20 text-eliteGold' : 'bg-white/[0.02] text-gray-500 hover:text-white'}`}>R$</button>
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Data de Expiração</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Limite de Usos</label>
              <input type="number" min="0" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} placeholder="Ilimitado" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Valor Mínimo (R$)</label>
              <input type="number" min="0" step="0.01" value={form.minTotal} onChange={e => setForm({ ...form, minTotal: e.target.value })} placeholder="0.00" className={inputClass} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-eliteGold/15 hover:bg-eliteGold/25 text-eliteGold rounded-lg text-sm font-medium transition-colors">
              {editing ? 'Salvar Alterações' : 'Criar Cupom'}
            </button>
            {editing && (
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 rounded-lg text-sm transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* Coupon List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl p-10 text-center">
          <svg className="w-10 h-10 text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-gray-500 text-sm">Nenhum cupom cadastrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {coupons.map(coupon => (
            <div key={coupon.id} className="bg-gray-900/30 border border-gray-800/60 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => toggleExpand(coupon.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  {/* Active toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); handleToggleActive(coupon); }}
                    className={`w-8 h-5 rounded-full transition-colors relative flex-shrink-0 ${coupon.isActive ? 'bg-emerald-500/30' : 'bg-gray-700/50'}`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full absolute top-[3px] transition-all ${coupon.isActive ? 'right-[3px] bg-emerald-400' : 'left-[3px] bg-gray-500'}`} />
                  </button>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white text-sm font-medium">{coupon.code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        coupon.type === 'percent' 
                          ? 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20' 
                          : 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20'
                      }`}>
                        {coupon.type === 'percent' ? `${coupon.value ?? coupon.discount}%` : `R$ ${(coupon.value ?? coupon.discount)?.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-600">{coupon.redemptions || 0} uso{(coupon.redemptions || 0) !== 1 ? 's' : ''}</span>
                      {coupon.maxUses && <span className="text-xs text-gray-600">/ {coupon.maxUses} máx</span>}
                      {coupon.minTotal > 0 && <span className="text-xs text-amber-500/70">Mín. R$ {Number(coupon.minTotal).toFixed(2)}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={e => { e.stopPropagation(); handleEdit(coupon); }} className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white rounded-lg text-xs transition-colors">
                    Editar
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(coupon.id); }} className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors">
                    Remover
                  </button>
                  <svg className={`w-4 h-4 text-gray-600 transition-transform ${expanded[coupon.id] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {expanded[coupon.id] && (
                <div className="border-t border-gray-800/40 px-5 py-3 bg-white/[0.01]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 block mb-0.5">Tipo</span>
                      <span className="text-white">{coupon.type === 'percent' ? 'Porcentagem' : 'Valor Fixo'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">Expira em</span>
                      <span className="text-white">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('pt-BR') : 'Sem expiração'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">Limite de Usos</span>
                      <span className="text-white">{coupon.maxUses || 'Ilimitado'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">Valor Mínimo</span>
                      <span className="text-white">{coupon.minTotal > 0 ? `R$ ${Number(coupon.minTotal).toFixed(2)}` : 'Sem mínimo'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
