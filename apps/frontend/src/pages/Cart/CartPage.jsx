import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Button } from '../../components';

export function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCart();

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading text-2xl text-eliteGold mb-4">Carrinho Vazio</h1>
        <p className="text-gray-400 mb-6">Adicione produtos ao seu carrinho</p>
        <Link to="/catalogo">
          <Button>Ver Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl text-eliteGold mb-8">Carrinho ({count} itens)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.size}`} className="card flex gap-4">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-24 h-32 object-cover rounded" />
              )}

              <div className="flex-1">
                <Link to={`/produto/${item.slug}`} className="font-semibold hover:text-eliteGold">
                  {item.name}
                </Link>
                <p className="text-gray-400 text-sm">Tamanho: {item.size}</p>
                <p className="text-eliteGold font-semibold">R$ {Number(item.price).toFixed(2)}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                    className="w-8 h-8 bg-eliteBlackCard rounded hover:bg-eliteGold/20"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                    className="w-8 h-8 bg-eliteBlackCard rounded hover:bg-eliteGold/20"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="ml-4 text-red-400 text-sm hover:text-red-300"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="card h-fit">
          <h2 className="font-subheading font-semibold text-lg mb-4">Resumo</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Frete</span>
              <span>A combinar</span>
            </div>
          </div>

          <div className="border-t border-eliteGold/20 pt-4 mb-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-eliteGold">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout">
            <Button className="w-full">Finalizar Pedido</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
