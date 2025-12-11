import { useState, useEffect, createContext, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, size, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      // images pode ser array de strings ou array de objetos
      const firstImage = Array.isArray(product.images) 
        ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)
        : null;
      
      return [...prev, {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: firstImage,
        size,
        quantity
      }];
    });
  };

  const removeItem = (productId, size) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems(prev => prev.map(i =>
      i.productId === productId && i.size === size
        ? { ...i, quantity }
        : i
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider');
  return context;
}
