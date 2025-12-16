import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { CityRulesCRUD } from './CityRulesCRUD';


export function ShippingAdminPage() {
  const [freeShippingMin, setFreeShippingMin] = useState(200);
  const [fixedShipping, setFixedShipping] = useState(15);
  const [cityRules, setCityRules] = useState([]);
  const [originCep, setOriginCep] = useState('');
  const [originNumber, setOriginNumber] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchConfig() {
      setLoading(true);
      try {
        const { config } = await adminService.getShippingConfig();
        if (config) {
          setFreeShippingMin(config.freeShippingMin || 0);
          setFixedShipping(config.fixedShipping || 0);
          setCityRules(config.cityRules ? JSON.parse(config.cityRules) : []);
          setOriginCep(config.originCep || '');
          setOriginNumber(config.originNumber || '');
          setRadiusKm(config.radiusKm || 10);
        }
      } catch (err) {
        setMessage('Erro ao carregar configuração de frete');
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await adminService.saveShippingConfig({
        freeShippingMin,
        fixedShipping,
        cityRules,
        originCep,
        originNumber,
        radiusKm
      });
      setMessage('Configuração salva com sucesso!');
    } catch (err) {
      setMessage('Erro ao salvar configuração');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Carregando configuração...</div>;
  }

  return (
    <form onSubmit={handleSave} className="card max-w-2xl mx-auto mt-8 p-8">
      <h1 className="font-heading text-2xl text-eliteGold mb-6">Configuração de Frete</h1>
      {message && <div className="mb-4 text-center text-sm text-eliteGold">{message}</div>}
      <div className="space-y-6">
        <div>
          <label className="block text-gray-300 font-medium mb-1">Valor mínimo para frete grátis</label>
          <input type="number" min="0" value={freeShippingMin} onChange={e => setFreeShippingMin(Number(e.target.value))} className="input" />
        </div>
        <div>
          <label className="block text-gray-300 font-medium mb-1">Frete fixo padrão (R$)</label>
          <input type="number" min="0" value={fixedShipping} onChange={e => setFixedShipping(Number(e.target.value))} className="input" />
        </div>
        {/* Campos de regras por cidade e cálculo por distância ocultados */}
      </div>
      <div className="flex justify-end mt-8">
        <button type="submit" className="btn-primary px-6 py-2">Salvar Configurações</button>
      </div>
    </form>
  );
}
