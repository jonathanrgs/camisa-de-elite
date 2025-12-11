import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { orderService } from '../../services/orderService';
import { Button, Input, Spinner } from '../../components';

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  if (!items.length) {
    navigate('/carrinho');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: usar userId real após implementar auth
      const result = await orderService.checkout({
        userId: 1, // placeholder
        items: items.map(i => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity
        }))
      });

      // Pegar URL do WhatsApp
      const waData = await orderService.getWhatsAppUrl(result.data.order.id);

      // Limpar carrinho
      clearCart();

      // Redirecionar para WhatsApp
      window.open(waData.data.whatsappUrl, '_blank');

      // Navegar para página de confirmação
      navigate(`/pedido/${result.data.token}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="font-subheading font-semibold text-lg mb-4">Seus Dados</h2>

            <div className="space-y-4">
              <Input
                label="Nome completo"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="E-mail"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="WhatsApp"
                required
                placeholder="(11) 99999-9999"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="font-subheading font-semibold text-lg mb-4">Pagamento</h2>
            <p className="text-gray-400 text-sm">
              Após confirmar, você será redirecionado para o WhatsApp para combinar
              o pagamento e entrega com nossa equipe.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Spinner size="sm" /> : 'Confirmar e ir para WhatsApp'}
          </Button>
        </form>

        {/* Resumo */}
        <div className="card h-fit">
          <h2 className="font-subheading font-semibold text-lg mb-4">Resumo do Pedido</h2>

          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {item.name} ({item.size}) x{item.quantity}
                </span>
                <span>R$ {(Number(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-eliteGold/20 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-eliteGold">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
