import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Button } from '../../components';

// Fallback: Camisa do Brasil
const FALLBACK_IMAGE = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';

// Frete fixo
const FRETE = 15;

export function CartPage() {
  const { items, removeItem, updateQuantity, total, count, stockError, clearStockError } = useCart();

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          {/* Mostrar erro de inatividade se houver */}
          {stockError && (
            <div className="bg-orange-500/20 border border-orange-500/50 text-orange-400 px-4 py-3 rounded-lg mb-6 text-left animate-shake">
              <div className="flex items-start justify-between">
                <span>{stockError}</span>
                <button onClick={clearStockError} className="text-orange-400 hover:text-orange-300 ml-2 p-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          )}
          
          <svg className="w-24 h-24 mx-auto text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="font-heading text-2xl text-eliteGold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-400 mb-6">Adicione produtos incríveis ao seu carrinho!</p>
          <Link to="/catalogo">
            <Button>Explorar Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">
        Carrinho ({count} {count === 1 ? 'item' : 'itens'})
      </h1>

      {/* Alerta de erro de estoque */}
      {stockError && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-between animate-shake">
          <span>{stockError}</span>
          <button onClick={clearStockError} className="text-red-400 hover:text-red-300 p-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Aviso de reserva */}
      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Os itens ficam reservados por 30 minutos. Após esse tempo, o carrinho será limpo automaticamente.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.size}`} className="card flex gap-4">
              <img 
                src={item.image || FALLBACK_IMAGE} 
                alt={item.name} 
                className="w-24 h-32 object-cover rounded"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }}
              />

              <div className="flex-1">
                <Link to={`/produto/${item.slug}`} className="font-semibold hover:text-eliteGold transition-colors text-white">
                  {item.name}
                </Link>
                <p className="text-gray-400 text-sm mt-1">Tamanho: <span className="text-eliteGold">{item.size}</span></p>
                <p className="text-eliteGold font-bold text-lg mt-2">
                  R$ {Number(item.price).toFixed(2).replace('.', ',')}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center bg-eliteBlackCard rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-eliteGold/20 transition-colors text-lg font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-eliteGold/20 transition-colors text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remover
                  </button>
                </div>
              </div>
              
              {/* Subtotal do item */}
              <div className="text-right">
                <p className="text-gray-400 text-sm">Subtotal</p>
                <p className="text-white font-bold">
                  R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="card h-fit sticky top-24">
          <h2 className="font-semibold text-lg mb-4 text-white">Resumo do Pedido</h2>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal ({count} itens)</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Frete</span>
              <span className="text-green-400">R$ {FRETE.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="border-t border-eliteGold/20 pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span className="text-white">Total</span>
              <span className="text-eliteGold">R$ {(total + FRETE).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <Link to="/checkout">
            <Button className="w-full">Finalizar Pedido</Button>
          </Link>
          
          <Link to="/catalogo" className="block text-center text-gray-400 hover:text-eliteGold transition-colors mt-4 text-sm">
            Continuar comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
