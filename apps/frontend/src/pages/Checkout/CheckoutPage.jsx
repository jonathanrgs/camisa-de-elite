import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Button, Spinner } from '../../components';
import { CONFIG } from '../../config';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService';

const FRETE = 15;

export function CheckoutPage() {
  const { items, total, clearCart, count } = useCart();
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [createAccount, setCreateAccount] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    zipCode: '',
    address: '',
    neighborhood: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    notes: ''
  });

  // Estados de edição (quando usuário está logado, campos ficam bloqueados até clicar em editar)
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  // Verificar se usuário logado tem dados preenchidos
  const hasPersonalData = isAuthenticated && user && (user.name || user.phone);
  const hasAddressData = isAuthenticated && user && (user.address || user.zipCode);

  // Preencher dados do usuário logado
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        zipCode: user.zipCode || '',
        address: user.address || '',
        neighborhood: user.neighborhood || '',
        number: user.number || '',
        complement: user.complement || '',
        city: user.city || '',
        state: user.state || ''
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!items.length && !orderCompleted) {
      navigate('/carrinho');
    }
  }, [items.length, navigate, orderCompleted]);

  if (!items.length && !orderCompleted) {
    return null;
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value.slice(0, 15);
  };

  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handlePhoneChange = (e) => {
    setForm({ ...form, phone: formatPhone(e.target.value) });
  };

  const handleCepChange = async (e) => {
    const formatted = formatCep(e.target.value);
    setForm({ ...form, zipCode: formatted });

    const cleanCep = e.target.value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            zipCode: formatted,
            address: data.logradouro || prev.address,
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch { }
    }
  };

  const totalWithShipping = total + FRETE;

  const generateWhatsAppMessage = () => {
    const data = orderData || { form, items, total: totalWithShipping };

    let message = `🛒 *NOVO PEDIDO - CAMISA DE ELITE*\n\n`;
    message += `👤 *Cliente:* ${data.form.name}\n`;
    message += `📱 *Telefone:* ${data.form.phone}\n`;

    if (data.form.address) {
      message += `\n📍 *Endereço de Entrega:*\n`;
      message += `${data.form.address}, ${data.form.number}`;
      if (data.form.complement) message += ` - ${data.form.complement}`;
      message += `\n${data.form.neighborhood}`;
      message += `\n${data.form.city}/${data.form.state}`;
      message += `\nCEP: ${data.form.zipCode}\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 *ITENS DO PEDIDO:*\n\n`;

    (data.items || items).forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Tamanho: ${item.size}\n`;
      message += `   Qtd: ${item.quantity}x\n`;
      message += `   Valor: R$ ${(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📦 Subtotal: R$ ${total.toFixed(2).replace('.', ',')}\n`;
    message += `🚚 Frete: R$ ${FRETE.toFixed(2).replace('.', ',')}\n`;
    message += `💰 *TOTAL: R$ ${totalWithShipping.toFixed(2).replace('.', ',')}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;

    if (data.form.notes) {
      message += `\n📝 *Observações:* ${data.form.notes}\n`;
    }

    message += `\n_Aguardo confirmação do pedido!_ 🙏`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      return;
    }

    // Validar campos de criação de conta
    if (createAccount && !isAuthenticated) {
      if (!form.email.trim()) {
        setAccountError('Informe um e-mail para criar sua conta');
        return;
      }
      if (!form.password || form.password.length < 6) {
        setAccountError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }

    setLoading(true);
    setAccountError('');

    // Criar conta se solicitado
    if (createAccount && !isAuthenticated) {
      try {
        await authService.register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          address: form.address,
          neighborhood: form.neighborhood,
          number: form.number,
          complement: form.complement,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode
        });
        // Login automático após registro
        const loginResult = await authService.login(form.email, form.password);
        login(loginResult.user, loginResult.token);
      } catch (err) {
        setAccountError(err.message || 'Erro ao criar conta. Tente novamente.');
        setLoading(false);
        return;
      }
    }

    try {
      // Criar pedido no backend
      const orderPayload = {
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email || null,
        address: form.address,
        neighborhood: form.neighborhood,
        number: form.number,
        complement: form.complement,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        notes: form.notes,
        sessionId: cartService.getSessionId(), // Para limpar reservas do carrinho
        items: items.map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity
        }))
      };

      const response = await orderService.checkout(orderPayload);
      
      // Salvar dados do pedido com token para link externo
      setOrderData({
        form: { ...form },
        items: [...items],
        total: totalWithShipping,
        orderId: response.data.order.id,
        orderToken: response.data.token,
        expiresAt: response.data.expiresAt
      });

      setLoading(false);
      setOrderCompleted(true);
      clearCart();
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      setAccountError(err.message || 'Erro ao finalizar pedido. Tente novamente.');
      setLoading(false);
    }
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${CONFIG.whatsapp.number}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Tela de pedido finalizado
  if (orderCompleted) {
    const orderLink = orderData?.orderToken ? `${window.location.origin}/pedido/${orderData.orderToken}` : null;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Card de sucesso */}
          <div className="card text-center py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-heading text-3xl text-eliteGold mb-2">Pedido Finalizado!</h1>
            <p className="text-gray-400 mb-4">
              Seu pedido foi registrado com sucesso. Agora envie pelo WhatsApp para confirmar.
            </p>
            
            {/* Link do pedido */}
            {orderLink && (
              <div className="bg-eliteBlackSoft rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-sm mb-2">Link do seu pedido:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={orderLink}
                    className="flex-1 bg-eliteBlack border border-eliteGold/30 rounded px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(orderLink);
                      alert('Link copiado!');
                    }}
                    className="bg-eliteGold text-eliteBlack px-4 py-2 rounded font-semibold text-sm hover:bg-eliteGold/90 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Use este link para acompanhar o status do seu pedido
                </p>
              </div>
            )}

            {/* Resumo do pedido */}
            <div className="bg-eliteBlackSoft rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-white mb-3">Resumo do Pedido</h3>
              <div className="space-y-2 text-sm">
                {orderData?.items.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between text-gray-300">
                    <span>{item.quantity}x {item.name} ({item.size})</span>
                    <span>R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
                <hr className="border-eliteGold/20 my-2" />
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>R$ {(orderData?.total - FRETE).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Frete</span>
                  <span>R$ {FRETE.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-2">
                  <span>Total</span>
                  <span className="text-eliteGold">R$ {orderData?.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>

            {/* Botão WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors mb-4"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar Pedido via WhatsApp
            </button>

            <p className="text-gray-500 text-sm mb-6">
              Clique no botão acima para enviar seu pedido e combinar pagamento e entrega.
            </p>

            <Link to="/catalogo" className="text-eliteGold hover:text-eliteGold/80 transition-colors">
              ← Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-white">Seus Dados</h2>
              {hasPersonalData && !editingPersonal && (
                <button
                  type="button"
                  onClick={() => setEditingPersonal(true)}
                  className="text-eliteGold hover:text-eliteGold/80 transition-colors flex items-center gap-1 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>

            {/* Visualização dos dados (quando logado e não editando) */}
            {hasPersonalData && !editingPersonal ? (
              <div className="bg-eliteBlackSoft rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-white">{form.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-white">{form.phone}</span>
                </div>
                {form.email && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-400">{form.email}</span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t border-gray-700">
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dados salvos da sua conta
                  </span>
                </div>
              </div>
            ) : (
              /* Formulário de edição */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {hasPersonalData && editingPersonal && (
                  <button
                    type="button"
                    onClick={() => setEditingPersonal(false)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    ← Cancelar edição
                  </button>
                )}
              </div>
            )}

            {/* Opção de criar conta */}
            {!isAuthenticated && (
              <>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-600 text-eliteGold focus:ring-eliteGold bg-eliteBlackCard"
                    />
                    <span className="text-white group-hover:text-eliteGold transition-colors">
                      Criar conta para acompanhar meus pedidos
                    </span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-8">
                    Com uma conta você pode ver histórico de pedidos e avaliar produtos
                  </p>
                </div>

                {/* Campos de conta (aparecem quando checkbox marcado) */}
                {createAccount && (
                  <div className="space-y-4 bg-eliteBlackSoft rounded-lg p-4">
                    {accountError && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">
                        {accountError}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">E-mail *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Senha *</label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Usuário já logado */}
            {isAuthenticated && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-green-400 text-sm">
                  Logado como <strong>{user?.email}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg text-white">Endereço de Entrega</h2>
              {hasAddressData && !editingAddress && (
                <button
                  type="button"
                  onClick={() => setEditingAddress(true)}
                  className="text-eliteGold hover:text-eliteGold/80 transition-colors flex items-center gap-1 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>

            {/* Visualização do endereço (quando logado e não editando) */}
            {hasAddressData && !editingAddress ? (
              <div className="bg-eliteBlackSoft rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-white">
                      {form.address}{form.number ? `, ${form.number}` : ''}
                      {form.complement ? ` - ${form.complement}` : ''}
                    </p>
                    <p className="text-gray-400">
                      {form.neighborhood && `${form.neighborhood} • `}
                      {form.city}{form.state ? `/${form.state}` : ''}
                    </p>
                    {form.zipCode && <p className="text-gray-500 text-sm">CEP: {form.zipCode}</p>}
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-700">
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Endereço salvo da sua conta
                  </span>
                </div>
              </div>
            ) : (
              /* Formulário de endereço */
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">CEP *</label>
                    <input
                      type="text"
                      required
                      value={form.zipCode}
                      onChange={handleCepChange}
                      maxLength={9}
                      className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Estado</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      maxLength={2}
                      className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                      placeholder="MG"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={form.neighborhood}
                    onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                    className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Rua/Logradouro *</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Número *</label>
                    <input
                      type="text"
                      required
                      value={form.number}
                      onChange={(e) => setForm({ ...form, number: e.target.value })}
                      className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={form.complement}
                    onChange={(e) => setForm({ ...form, complement: e.target.value })}
                    className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors"
                    placeholder="Apto, Bloco, Casa..."
                  />
                </div>

                {hasAddressData && editingAddress && (
                  <button
                    type="button"
                    onClick={() => setEditingAddress(false)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    ← Cancelar edição
                  </button>
                )}
              </div>
            )}

            {/* Observações sempre visíveis */}
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-1">Observações</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full bg-eliteBlackCard border border-eliteGold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eliteGold transition-colors resize-none"
                placeholder="Ponto de referência, horário de entrega..."
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.number.trim() || !form.zipCode.trim()}
            className="w-full py-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                Processando...
              </span>
            ) : (
              'Finalizar Pedido'
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
              <span className="text-green-400">R$ {FRETE.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-eliteGold/20">
              <span className="text-white">Total</span>
              <span className="text-eliteGold">R$ {totalWithShipping.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Aviso sobre WhatsApp */}
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <p className="text-green-400 text-sm">
                Após finalizar, você poderá enviar o pedido pelo WhatsApp para confirmar pagamento e entrega.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
