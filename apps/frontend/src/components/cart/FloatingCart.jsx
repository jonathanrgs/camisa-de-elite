import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const FALLBACK_IMAGE = 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp';
const FRETE = 15;

export function FloatingCart() {
  const { items, removeItem, updateQuantity, total, count, stockError, clearStockError } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Não mostrar na página de carrinho ou checkout
  if (location.pathname === '/carrinho' || location.pathname === '/checkout') {
    return null;
  }

  return (
    <>
      {/* Botão flutuante do carrinho */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-eliteGold text-eliteBlack p-4 rounded-full shadow-lg hover:bg-eliteGold/90 transition-all hover:scale-105 active:scale-95"
        aria-label="Abrir carrinho"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Painel do carrinho */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-eliteBlack border-l border-eliteGold/20 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header do painel */}
        <div className="flex items-center justify-between p-4 border-b border-eliteGold/20">
          <h2 className="font-heading text-xl text-eliteGold">
            Carrinho ({count})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-eliteGold/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col h-[calc(100%-80px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-400 mb-4">Seu carrinho está vazio</p>
              <Link 
                to="/catalogo" 
                onClick={() => setIsOpen(false)}
                className="btn-primary px-6 py-2"
              >
                Ver Catálogo
              </Link>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3 bg-eliteBlackSoft p-3 rounded-lg">
                    <img 
                      src={item.image || FALLBACK_IMAGE} 
                      alt={item.name} 
                      className="w-16 h-20 object-cover rounded"
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/produto/${item.slug}`} 
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-white hover:text-eliteGold transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">
                        Tam: <span className="text-eliteGold">{item.size}</span>
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-eliteBlack rounded overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-eliteGold/20 transition-colors text-sm"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-eliteGold/20 transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-eliteGold font-semibold text-sm">
                          R$ {(Number(item.price) * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-gray-500 hover:text-red-400 transition-colors self-start"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer com total e botão */}
              <div className="border-t border-eliteGold/20 p-4 space-y-3">
                {/* Alerta de erro de estoque */}
                {stockError && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded text-xs flex items-center justify-between">
                    <span>{stockError}</span>
                    <button onClick={clearStockError} className="text-red-400 hover:text-red-300">✕</button>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Frete</span>
                  <span className="text-green-400">R$ {FRETE.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-eliteGold/10">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-xl font-bold text-eliteGold">
                    R$ {(total + FRETE).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <Link 
                  to="/carrinho" 
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full py-3 text-center block"
                >
                  Finalizar Pedido
                </Link>
                
                {/* Aviso de reserva */}
                <p className="text-[10px] text-gray-500 text-center">
                  ⏱️ Itens reservados por 30 minutos
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
