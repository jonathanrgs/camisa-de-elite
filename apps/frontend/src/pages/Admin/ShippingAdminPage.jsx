import { useState } from 'react';

export function ShippingAdminPage() {
  const [freeShippingMin, setFreeShippingMin] = useState(200);
  const [fixedShipping, setFixedShipping] = useState(15);
  const [cityRules, setCityRules] = useState([]);
  const [originCep, setOriginCep] = useState('');
  const [originNumber, setOriginNumber] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);

  // Funções para adicionar/remover regras por cidade
  // ...

  return (
    <div className="card max-w-2xl mx-auto mt-8 p-8">
      <h1 className="font-heading text-2xl text-eliteGold mb-6">Configuração de Frete</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-300 font-medium mb-1">Valor mínimo para frete grátis</label>
          <input type="number" min="0" value={freeShippingMin} onChange={e => setFreeShippingMin(Number(e.target.value))} className="input" />
        </div>
        <div>
          <label className="block text-gray-300 font-medium mb-1">Frete fixo padrão (R$)</label>
          <input type="number" min="0" value={fixedShipping} onChange={e => setFixedShipping(Number(e.target.value))} className="input" />
        </div>
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-lg text-eliteGold mb-2">Regras por Cidade</h2>
          <p className="text-gray-400 text-sm mb-2">Adicione regras específicas para cidades: frete fixo ou por km.</p>
          {/* Aqui virá a lista de cidades e formulário para adicionar nova */}
        </div>
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-lg text-eliteGold mb-2">Cálculo por Distância</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-medium mb-1">CEP de origem</label>
              <input type="text" value={originCep} onChange={e => setOriginCep(e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Número</label>
              <input type="text" value={originNumber} onChange={e => setOriginNumber(e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Raio de entrega (km)</label>
              <input type="number" min="1" value={radiusKm} onChange={e => setRadiusKm(Number(e.target.value))} className="input" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button className="btn-primary px-6 py-2">Salvar Configurações</button>
      </div>
    </div>
  );
}
