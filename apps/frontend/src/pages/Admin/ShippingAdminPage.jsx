import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';


export function ShippingAdminPage() {
  const [freeShippingMin, setFreeShippingMin] = useState(200);
  const [fixedShipping, setFixedShipping] = useState(15);
  const [cityRules, setCityRules] = useState([]);
  const [originCep, setOriginCep] = useState('');
  const [originNumber, setOriginNumber] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      } catch {
        setMessage({ type: 'error', text: 'Erro ao carregar configuração de frete' });
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await adminService.saveShippingConfig({
        freeShippingMin,
        fixedShipping,
        cityRules,
        originCep,
        originNumber,
        radiusKm
      });
      setMessage({ type: 'success', text: 'Configuração salva com sucesso!' });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar configuração' });
    }
  };

  const inputClass = "w-full bg-white/[0.03] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-eliteGold/50 focus:outline-none transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-2 border-eliteGold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl text-white tracking-tight">Frete</h1>
        <p className="text-gray-500 text-sm mt-1">Configure valores e regras de entrega</p>
      </div>

      {message.text && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-gray-900/30 border border-gray-800/60 rounded-xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">Configuração Geral</p>
          
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Valor mínimo para frete grátis (R$)</label>
              <input type="number" min="0" step="0.01" value={freeShippingMin} onChange={e => setFreeShippingMin(Number(e.target.value))} className={inputClass} />
              <p className="text-[11px] text-gray-600 mt-1">Pedidos acima desse valor terão frete grátis</p>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Frete fixo padrão (R$)</label>
              <input type="number" min="0" step="0.01" value={fixedShipping} onChange={e => setFixedShipping(Number(e.target.value))} className={inputClass} />
              <p className="text-[11px] text-gray-600 mt-1">Valor cobrado quando não há frete grátis</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-eliteGold/15 hover:bg-eliteGold/25 text-eliteGold rounded-lg text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
