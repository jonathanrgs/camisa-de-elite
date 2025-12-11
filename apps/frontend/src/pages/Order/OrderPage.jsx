import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Spinner } from '../../components';

export function OrderPage() {
  const { token } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService.getByToken(token)
      .then(res => setOrder(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-2xl text-red-400 mb-4">Erro</h1>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  const statusLabels = {
    PENDENTE: { text: 'Aguardando confirmação', color: 'text-yellow-400' },
    CONFIRMADO: { text: 'Confirmado', color: 'text-blue-400' },
    ENVIADO: { text: 'Enviado', color: 'text-purple-400' },
    ENTREGUE: { text: 'Entregue', color: 'text-green-400' },
    PROBLEMA: { text: 'Problema', color: 'text-red-400' },
    RESOLVIDO: { text: 'Resolvido', color: 'text-green-400' },
    CANCELADO: { text: 'Cancelado', color: 'text-gray-400' }
  };

  const status = statusLabels[order.order.status] || statusLabels.PENDENTE;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-eliteGold mb-2">Pedido Recebido!</h1>
          <p className="text-gray-400">Obrigado por comprar na Camisa de Elite</p>
        </div>

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Status</span>
            <span className={`font-semibold ${status.color}`}>{status.text}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Pedido #</span>
            <span>{order.order.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total</span>
            <span className="text-eliteGold font-semibold">R$ {Number(order.order.total).toFixed(2)}</span>
          </div>
        </div>

        <div className="card">
          <h2 className="font-subheading font-semibold mb-4">Itens do Pedido</h2>

          <div className="space-y-3">
            {order.order.items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-300">
                  {item.product.name} ({item.size}) x{item.quantity}
                </span>
                <span>R$ {(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {!order.confirmedByAdmin && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
            <p className="text-yellow-400">
              Aguardando confirmação do vendedor. Você receberá uma mensagem no WhatsApp em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
