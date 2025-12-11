import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Button, Spinner } from '../../components';

// Número do WhatsApp da loja (substitua pelo número real)
const WHATSAPP_NUMBER = '5534996769091';

export function CheckoutPage() {
  const { items, total, clearCart, count } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (!items.length) {
      navigate('/carrinho');
    }
  }, [items.length, navigate]);

  if (!items.length) {
    return null;
  }

  const formatPhone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    // Aplica máscara (11) 99999-9999
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value.slice(0, 15);
  };

  const handlePhoneChange = (e) => {
    setForm({ ...form, phone: formatPhone(e.target.value) });
  };

  const generateWhatsAppMessage = () => {
    let message = `🛒 *NOVO PEDIDO - CAMISA DE ELITE*\n\n`;
    message += `👤 *Cliente:* ${form.name}\n`;
    message += `📱 *Telefone:* ${form.phone}\n`;
    
    if (form.address) {
      message += `📍 *Endereço:* ${form.address}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 *ITENS DO PEDIDO:*\n\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Tamanho: ${item.size}\n`;
      message += `   Qtd: ${item.quantity}x\n`;
      message += `   Valor: R$ ${(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    if (form.notes) {
      message += `\n📝 *Observações:* ${form.notes}\n`;
    }
    
    message += `\n_Aguardo confirmação do pedido!_ 🙏`;
    
    return encodeURIComponent(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.phone.trim()) {
      return;
    }
    
    setLoading(true);
    
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Limpar carrinho
    clearCart();
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Navegar para página de sucesso
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="font-semibold text-lg mb-4 text-white">Seus Dados</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome completo *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                  placeholder="Seu nome"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handlePhoneChange}
                  className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Endereço de entrega</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors resize-none"
                  placeholder="Rua, número, bairro, cidade..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Observações</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors resize-none"
                  placeholder="Alguma observação sobre o pedido..."
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Finalização via WhatsApp
            </h2>
            <p className="text-gray-400 text-sm">
              Ao clicar em "Enviar Pedido", você será redirecionado para o WhatsApp 
              para combinar pagamento e entrega diretamente com nossa equipe.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading || !form.name.trim() || !form.phone.trim()} 
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enviar Pedido via WhatsApp
              </>
            )}
          </Button>
          
          <Link to="/carrinho" className="block text-center text-gray-400 hover:text-eliteGold transition-colors">
            ← Voltar ao carrinho
          </Link>
        </form>

        {/* Resumo */}
        <div className="card h-fit">
          <h2 className="font-semibold text-lg mb-4 text-white">
            Resumo do Pedido ({count} {count === 1 ? 'item' : 'itens'})
          </h2>

          <div className="space-y-4 mb-4">
            {items.map(item => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';
                    }}
                  />
                )}
                <div className="flex-1">
                  <p className="text-white text-sm font-medium line-clamp-2">{item.name}</p>
                  <p className="text-gray-400 text-xs">Tamanho: {item.size}</p>
                  <p className="text-gray-400 text-xs">Qtd: {item.quantity}</p>
                  <p className="text-eliteGold text-sm font-medium">
                    R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-eliteGold/20 pt-4 space-y-2">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Frete</span>
              <span className="text-xs">A combinar</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-eliteGold/20">
              <span className="text-white">Total</span>
              <span className="text-eliteGold">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
