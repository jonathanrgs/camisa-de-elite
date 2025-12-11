import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { cartService } from '../services/cartService.js';

const CartContext = createContext();

// Intervalo para refresh das reservas (20 minutos - antes de expirar 30min)
const REFRESH_INTERVAL_MS = 20 * 60 * 1000;

// Timeout de inatividade para limpar carrinho (30 minutos)
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [stockError, setStockError] = useState(null);
  const lastActivityRef = useRef(Date.now());
  const refreshIntervalRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);

  // Salvar no localStorage quando items mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Registrar atividade
  const registerActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Refresh das reservas no servidor
  const refreshReservations = useCallback(async () => {
    if (items.length === 0) return;
    
    try {
      await cartService.refresh();
    } catch (error) {
      console.error('Erro ao atualizar reservas:', error);
    }
  }, [items.length]);

  // Limpar carrinho por inatividade
  const clearCartDueToInactivity = useCallback(async () => {
    const timeSinceLastActivity = Date.now() - lastActivityRef.current;
    
    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT_MS && items.length > 0) {
      console.log('🧹 Carrinho limpo por inatividade');
      
      try {
        await cartService.releaseAll();
      } catch (error) {
        console.error('Erro ao liberar reservas:', error);
      }
      
      setItems([]);
      setStockError('Seu carrinho foi limpo devido à inatividade. Os itens voltaram ao estoque.');
    }
  }, [items.length]);

  // Setup dos intervalos
  useEffect(() => {
    // Refresh das reservas a cada 20 minutos
    refreshIntervalRef.current = setInterval(refreshReservations, REFRESH_INTERVAL_MS);

    // Verificar inatividade a cada 5 minutos
    inactivityTimeoutRef.current = setInterval(clearCartDueToInactivity, 5 * 60 * 1000);

    // Registrar atividade em eventos do usuário
    const handleActivity = () => registerActivity();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      clearInterval(refreshIntervalRef.current);
      clearInterval(inactivityTimeoutRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [refreshReservations, clearCartDueToInactivity, registerActivity]);

  // Sincronizar reservas existentes ao carregar
  useEffect(() => {
    const syncReservations = async () => {
      if (items.length === 0) return;

      for (const item of items) {
        try {
          await cartService.reserveStock(item.productId, item.size, item.quantity);
        } catch (error) {
          console.error('Erro ao sincronizar reserva:', error);
        }
      }
    };

    syncReservations();
  }, []); // Só executa uma vez ao montar

  const addItem = async (product, size, quantity = 1) => {
    registerActivity();
    setStockError(null);

    try {
      // Verificar/reservar estoque no servidor
      const existing = items.find(i => i.productId === product.id && i.size === size);
      const newQuantity = existing ? existing.quantity + quantity : quantity;

      const response = await cartService.reserveStock(product.id, size, newQuantity);
      
      if (!response.success) {
        setStockError(response.error || 'Erro ao reservar estoque');
        return false;
      }

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

      return true;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      setStockError(error.message || 'Estoque insuficiente');
      return false;
    }
  };

  const removeItem = async (productId, size) => {
    registerActivity();
    setStockError(null);

    try {
      // Liberar reserva no servidor
      await cartService.releaseStock(productId, size);
    } catch (error) {
      console.error('Erro ao liberar reserva:', error);
    }

    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
  };

  const updateQuantity = async (productId, size, quantity) => {
    registerActivity();
    setStockError(null);

    if (quantity <= 0) {
      await removeItem(productId, size);
      return true;
    }

    try {
      // Atualizar reserva no servidor
      const response = await cartService.reserveStock(productId, size, quantity);
      
      if (!response.success) {
        setStockError(response.error || 'Estoque insuficiente');
        return false;
      }

      setItems(prev => prev.map(i =>
        i.productId === productId && i.size === size
          ? { ...i, quantity }
          : i
      ));

      return true;
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      setStockError(error.message || 'Estoque insuficiente');
      return false;
    }
  };

  const clearCart = async () => {
    registerActivity();
    setStockError(null);

    try {
      // Liberar todas as reservas
      await cartService.releaseAll();
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }

    setItems([]);
  };

  const clearStockError = () => setStockError(null);

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      total, 
      count,
      stockError,
      clearStockError
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider');
  return context;
}
