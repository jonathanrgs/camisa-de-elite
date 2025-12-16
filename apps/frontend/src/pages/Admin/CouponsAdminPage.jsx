
import React, { useEffect, useState } from 'react';
import { Button, Spinner, Input } from '../../components';
import { couponApi } from '../../services/couponApi';

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

  return (
    <div className="container mx-auto px-2 py-8 max-w-4xl">
      <h1 className="font-heading text-2xl text-eliteGold mb-6">Cupons de Desconto</h1>
      <div className="card mb-8 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-2 items-end">
          <div className="flex flex-col">
            <label className="block text-sm text-gray-400 mb-1" htmlFor="code">Código *</label>
            <Input id="code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required className="w-full min-w-[90px]" autoFocus />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm text-gray-400 mb-1" htmlFor="discount">Desconto *</label>
            <Input id="discount" type="number" min="0" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} required className="w-full min-w-[70px]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm text-gray-400 mb-1" htmlFor="type">Tipo</label>
            <select id="type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full min-w-[70px] bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-2 py-2 text-white focus:ring-2 focus:ring-eliteGold/50">
              <option value="percent">%</option>
              <option value="fixed">R$</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm text-gray-400 mb-1" htmlFor="expiresAt">Expira em</label>
            <Input id="expiresAt" type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="w-full min-w-[120px]" />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm text-gray-400 mb-1" htmlFor="maxUses">Limite usos</label>
            <Input id="maxUses" type="number" min="0" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} className="w-full min-w-[70px]" />
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button type="submit" className="px-6 py-2 w-full">{editing ? 'Salvar' : 'Criar'}</Button>
            {editing && <Button type="button" variant="secondary" onClick={handleCancel} className="w-full">Cancelar</Button>}
          </div>
        </form>
        {success && <div className="text-green-400 mt-2">{success}</div>}
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </div>
      <div className="card overflow-x-auto p-0 md:p-2">
        {loading ? <Spinner /> : error ? (
          <div className="text-red-400 py-4 text-center">{error}</div>
        ) : coupons && coupons.length === 0 ? (
          <div className="text-gray-400 py-4 text-center">Nenhum cupom cadastrado.</div>
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left py-2">Código</th>
                <th>Desconto</th>
                <th>Tipo</th>
                <th>Expira em</th>
                <th>Limite</th>
                <th>Usados</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} className="border-t border-eliteGold/10 hover:bg-eliteBlackCard/40 transition-colors">
                  <td className="py-2 font-mono text-eliteGold">{coupon.code}</td>
                  <td className={coupon.type === 'percent' ? 'text-blue-400' : 'text-green-400'}>
                    {coupon.type === 'percent' ? `${coupon.value ?? coupon.discount}%` : `R$ ${(coupon.value ?? coupon.discount)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </td>
                  <td>{coupon.type === 'percent' ? 'Porcentagem' : coupon.type === 'fixed' ? 'Valor Fixo' : coupon.type}</td>
                  <td>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '-'}</td>
                  <td>{coupon.maxUses || '-'}</td>
                  <td>{coupon.redemptions || 0}</td>
                  <td className="whitespace-nowrap flex gap-2 items-center">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(coupon)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(coupon.id)}>Remover</Button>
                    <Button
                      size="sm"
                      variant={coupon.isActive ? 'success' : 'outline'}
                      onClick={async () => {
                        await couponApi.toggleActive(coupon.id);
                        fetchCoupons();
                      }}
                      className={coupon.isActive ? 'ml-2' : 'ml-2 opacity-60'}
                      title={coupon.isActive ? 'Inativar' : 'Ativar'}
                    >
                      {coupon.isActive ? 'Ativo' : 'Inativo'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
