
import React, { useEffect, useState } from 'react';
import { Button, Spinner, Input } from '../../components';
import { couponApi } from '../../services/couponApi';
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null ou objeto do cupom
  const [form, setForm] = useState({ code: '', discount: '', type: 'percent', expiresAt: '', maxUses: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const data = await couponApi.list();
      setCoupons(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar cupons');
    }
    setLoading(false);
  }

  function handleEdit(coupon) {
    setEditing(coupon.id);
    setForm({
      code: coupon.code,
      discount: coupon.value ?? coupon.discount ?? '',
      type: coupon.type,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      maxUses: coupon.maxUses || ''
    });
    setSuccess('');
    setError('');
  }

  function handleCancel() {
    setEditing(null);
    setForm({ code: '', discount: '', type: 'percent', expiresAt: '', maxUses: '' });
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

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const payload = {
        ...form,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        value: Number(form.discount)
      };
      if (editing) {
        await couponApi.update(editing, payload);
        setSuccess('Cupom atualizado com sucesso!');
      } else {
        await couponApi.create(payload);
        setSuccess('Cupom criado com sucesso!');
      }
      handleCancel();
      fetchCoupons();
    } catch (err) {
      setError('Erro ao salvar cupom');
    }
  }

  // Estado para expandir detalhes de cada cupom
  const [expanded, setExpanded] = useState({});

  const toggleExpand = id => setExpanded(exp => ({ ...exp, [id]: !exp[id] }));

  return (
    <div className="container mx-auto px-2 py-8 max-w-xl">
      <h1 className="font-heading text-2xl text-eliteGold mb-6 text-center">Cupons de Desconto</h1>

      {/* Formulário compacto em linha */}
      <form onSubmit={handleSubmit} className="bg-eliteBlackCard border border-eliteGold/20 rounded-lg px-4 py-3 mb-8 shadow-sm flex flex-col gap-2 w-full">
        <div className="flex flex-row flex-wrap items-center gap-2 w-full">
          <Input
            id="code"
            placeholder="Código"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
            required
            className="flex-1 h-9 text-xs bg-eliteBlackCard border-eliteGold/30 text-eliteGold placeholder:text-eliteGold/60 focus:ring-eliteGold/40 focus:border-eliteGold/60 align-middle min-w-[90px]"
            style={{ minHeight: 36 }}
            autoFocus
          />
          <Input
            id="discount"
            placeholder="Desconto"
            type="number"
            min="0"
            value={form.discount}
            onChange={e => setForm({ ...form, discount: e.target.value })}
            required
            className="flex-1 h-9 text-xs bg-eliteBlackCard border-eliteGold/30 text-eliteGold placeholder:text-eliteGold/60 focus:ring-eliteGold/40 focus:border-eliteGold/60 align-middle min-w-[70px]"
            style={{ minHeight: 36 }}
          />
          {/* Botões de tipo de desconto */}
          <div className="flex flex-row rounded overflow-hidden border border-eliteGold/30 min-w-[80px]">
            <button
              type="button"
              className={`px-3 h-9 text-xs font-bold focus:outline-none transition ${form.type === 'percent' ? 'bg-eliteGold text-eliteBlack' : 'bg-eliteBlackCard text-eliteGold/60 hover:bg-eliteGold/10'}`}
              style={{ minHeight: 36, borderRight: '1px solid #bfa14a55' }}
              onClick={() => setForm(f => ({ ...f, type: 'percent' }))}
            >
              %
            </button>
            <button
              type="button"
              className={`px-3 h-9 text-xs font-bold focus:outline-none transition ${form.type === 'fixed' ? 'bg-eliteGold text-eliteBlack' : 'bg-eliteBlackCard text-eliteGold/60 hover:bg-eliteGold/10'}`}
              style={{ minHeight: 36 }}
              onClick={() => setForm(f => ({ ...f, type: 'fixed' }))}
            >
              R$
            </button>
          </div>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-2 w-full">
          <Input
            id="expiresAt"
            placeholder="Expira"
            type="date"
            value={form.expiresAt}
            onChange={e => setForm({ ...form, expiresAt: e.target.value })}
            className="flex-1 h-9 text-xs bg-eliteBlackCard border-eliteGold/30 text-eliteGold placeholder:text-eliteGold/60 focus:ring-eliteGold/40 focus:border-eliteGold/60 align-middle min-w-[120px]"
            style={{ minHeight: 36 }}
          />
          <Input
            id="maxUses"
            placeholder="Limite"
            type="number"
            min="0"
            value={form.maxUses}
            onChange={e => setForm({ ...form, maxUses: e.target.value })}
            className="flex-1 h-9 text-xs bg-eliteBlackCard border-eliteGold/30 text-eliteGold placeholder:text-eliteGold/60 focus:ring-eliteGold/40 focus:border-eliteGold/60 align-middle min-w-[70px]"
            style={{ minHeight: 36 }}
          />
          <Button type="submit" className="flex-1 min-w-[90px] h-9 text-xs font-bold bg-eliteGold text-eliteBlack rounded shadow hover:bg-yellow-400 transition align-middle" style={{ minHeight: 36 }}>{editing ? 'Salvar' : 'Criar'}</Button>
          {editing && <Button type="button" variant="secondary" onClick={handleCancel} className="flex-1 min-w-[90px] h-9 text-xs rounded align-middle" style={{ minHeight: 36 }}>Cancelar</Button>}
          {success && <span className="text-green-400 ml-2 text-xs">{success}</span>}
          {error && <span className="text-red-400 ml-2 text-xs">{error}</span>}
        </div>
      </form>

      {/* Listagem simples e expansível */}
      <div className="flex flex-col gap-2">
        {loading ? <Spinner /> : error ? (
          <div className="text-red-400 py-4 text-center">{error}</div>
        ) : coupons && coupons.length === 0 ? (
          <div className="text-gray-400 py-4 text-center">Nenhum cupom cadastrado.</div>
        ) : (
          coupons.map(coupon => (
            <div key={coupon.id} className="bg-eliteBlackCard border border-eliteGold/10 rounded-lg px-4 py-2 flex flex-col shadow-sm">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(coupon.id)}>
                <div className="flex items-center gap-2 min-w-0">
                  {/* Único indicador de ativo */}
                  {coupon.isActive ? <FaCheckCircle className="text-green-400 text-base min-w-[18px]" /> : <FaTimesCircle className="text-gray-500 text-base min-w-[18px]" />}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-eliteGold text-sm truncate max-w-[120px]">{coupon.code}</span>
                    <span className="mt-0.5">
                      {coupon.type === 'percent' ? (
                        <span className="text-blue-400 text-xs font-bold">{`${coupon.value ?? coupon.discount}%`}</span>
                      ) : (
                        <span className="text-green-400 text-xs font-bold">{`R$ ${(coupon.value ?? coupon.discount)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">Usos: {coupon.redemptions || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="xs" variant="secondary" onClick={e => { e.stopPropagation(); handleEdit(coupon); }} className="rounded px-3 py-1 text-xs">Editar</Button>
                  <Button size="xs" variant="danger" onClick={e => { e.stopPropagation(); handleDelete(coupon.id); }} className="rounded px-3 py-1 text-xs">Remover</Button>
                  {expanded[coupon.id] ? <FaChevronUp className="ml-2 text-eliteGold/70" /> : <FaChevronDown className="ml-2 text-eliteGold/40" />}
                </div>
              </div>
              {expanded[coupon.id] && (
                <div className="mt-2 text-xs text-gray-300 grid grid-cols-2 gap-x-4 gap-y-1">
                  <div><span className="text-gray-400">Tipo:</span> {coupon.type === 'percent' ? 'Porcentagem' : coupon.type === 'fixed' ? 'Valor Fixo' : coupon.type}</div>
                  <div><span className="text-gray-400">Expira em:</span> {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '-'}</div>
                  <div><span className="text-gray-400">Limite:</span> {coupon.maxUses || '-'}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
