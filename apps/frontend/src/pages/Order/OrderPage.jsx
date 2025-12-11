import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Spinner } from '../../components';
import { CONFIG } from '../../config';
import { useAuth } from '../../hooks/useAuth';

const FRETE = 15;

// Fallback: Camisa do Brasil
const FALLBACK_IMAGE = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';

export function OrderPage() {
  const { token } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService.getByToken(token)
      .then(res => setOrderData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Aguarda carregar auth e pedido
  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl text-red-400 mb-4">Pedido não encontrado</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/catalogo" className="btn-primary inline-block px-6 py-2">
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const order = orderData?.order;
  
  // Verifica se o usuário pode ver o pedido (dono ou admin)
  const isOwner = isAuthenticated && (
    user?.id === order?.userId || 
    user?.email === order?.customerEmail
  );
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  const canViewOrder = isOwner || isAdmin;

  // Se não pode ver o pedido, mostra tela de acesso negado
  if (!canViewOrder) {
    const handleLogin = () => {
      // Salva a URL atual para redirecionar após login
      navigate('/login', { state: { from: location.pathname } });
    };

    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl text-yellow-400 mb-4">Acesso Restrito</h1>
          <p className="text-gray-400 mb-6">
            {isAuthenticated 
              ? 'Este pedido pertence a outra conta. Faça login com a conta correta para visualizá-lo.'
              : 'Faça login para visualizar os detalhes deste pedido.'}
          </p>
          {!isAuthenticated ? (
            <button 
              onClick={handleLogin}
              className="btn-primary inline-block px-6 py-2"
            >
              Fazer Login
            </button>
          ) : (
            <div className="space-y-3">
              <button 
                onClick={handleLogin}
                className="btn-primary inline-block px-6 py-2 w-full"
              >
                Trocar de Conta
              </button>
              <Link to="/catalogo" className="block text-gray-400 hover:text-eliteGold transition-colors">
                Voltar ao Catálogo
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  const statusConfig = {
    PENDENTE: { 
      text: 'Aguardando Confirmação', 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      iconType: 'clock',
      description: 'Seu pedido foi recebido e está aguardando confirmação.'
    },
    CONFIRMADO: { 
      text: 'Pedido Confirmado', 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      iconType: 'check',
      description: 'Seu pedido foi confirmado e está sendo preparado.'
    },
    EM_ROTA: { 
      text: 'Em Rota de Entrega', 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      iconType: 'truck',
      description: 'Seu pedido está a caminho!'
    },
    ENVIADO: { 
      text: 'Enviado', 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      iconType: 'package',
      description: 'Seu pedido foi enviado.'
    },
    ENTREGUE: { 
      text: 'Entregue', 
      color: 'text-green-400', 
      bg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      iconType: 'delivered',
      description: 'Seu pedido foi entregue com sucesso!'
    },
    CANCELADO: { 
      text: 'Cancelado', 
      color: 'text-red-400', 
      bg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      iconType: 'cancel',
      description: 'Este pedido foi cancelado.'
    }
  };

  const StatusIconComponent = ({ type, className }) => {
    const icons = {
      clock: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      check: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      truck: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      package: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      delivered: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
        </svg>
      ),
      cancel: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    };
    return icons[type] || icons.clock;
  };

  const status = statusConfig[order?.status] || statusConfig.PENDENTE;
  const subtotal = order?.items?.reduce((sum, item) => sum + (Number(item.unitPrice) * item.quantity), 0) || 0;

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá! Gostaria de saber sobre meu pedido #${order?.id}`);
    window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-eliteGold mb-2">Detalhes do Pedido</h1>
          <p className="text-gray-400">Pedido #{order?.id?.slice(-8).toUpperCase()}</p>
        </div>

        {/* Status Card */}
        <div className={`card ${status.bg} border border-current/30 mb-6 animate-fade-in`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${status.iconColor}`}>
              <StatusIconComponent type={status.iconType} className="w-full h-full" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${status.color}`}>{status.text}</h2>
              <p className="text-gray-400 text-sm">{status.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Dados do Cliente */}
          <div className="card">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Dados do Cliente
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-white">{order?.customerName}</p>
              <p className="text-gray-400">{order?.customerPhone}</p>
              {order?.customerEmail && <p className="text-gray-400">{order?.customerEmail}</p>}
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className="card">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Endereço de Entrega
            </h3>
            <div className="space-y-1 text-sm text-gray-300">
              {order?.address && <p>{order.address}{order.number ? `, ${order.number}` : ''}</p>}
              {order?.neighborhood && <p>{order.neighborhood}</p>}
              {order?.city && <p>{order.city}/{order.state}</p>}
              {order?.zipCode && <p className="text-gray-500">CEP: {order.zipCode}</p>}
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="card mb-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-eliteGold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Itens do Pedido
          </h3>

          <div className="space-y-4">
            {order?.items?.map(item => {
              const images = item.product?.images ? JSON.parse(item.product.images) : [];
              const firstImage = images[0] || FALLBACK_IMAGE;
              
              return (
                <div key={item.id} className="flex gap-4 bg-eliteBlackSoft rounded-lg p-3">
                  <img 
                    src={firstImage} 
                    alt={item.product?.name} 
                    className="w-16 h-20 object-cover rounded"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.product?.name}</p>
                    <p className="text-sm text-gray-400">
                      Tamanho: <span className="text-eliteGold">{item.size}</span> • Qtd: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-eliteGold font-semibold">
                      R$ {(Number(item.unitPrice) * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totais */}
          <div className="border-t border-eliteGold/20 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm">
              <span>Frete</span>
              <span>R$ {FRETE.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-2">
              <span>Total</span>
              <span className="text-eliteGold">R$ {(subtotal + FRETE).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Observações */}
        {order?.notes && (
          <div className="card mb-6">
            <h3 className="font-semibold text-white mb-2">Observações</h3>
            <p className="text-gray-400 text-sm">{order.notes}</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </button>
          
          <Link 
            to="/catalogo" 
            className="flex-1 bg-eliteGold/20 hover:bg-eliteGold/30 text-eliteGold font-semibold py-3 px-6 rounded-lg text-center transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>

        {/* Data do pedido */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Pedido realizado em {new Date(order?.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}
