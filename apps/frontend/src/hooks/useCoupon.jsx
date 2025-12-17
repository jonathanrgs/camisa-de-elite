import { useState, useEffect } from 'react';
import { couponApi } from '../services/couponApi.js';

export function useCoupon(cartTotal, shipping) {
  const [couponInput, setCouponInput] = useState(() => {
    const saved = localStorage.getItem('appliedCoupon');
    return saved ? JSON.parse(saved).code : '';
  });
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('appliedCoupon');
    return saved ? JSON.parse(saved) : null;
  });
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(cartTotal);
  const [finalShipping, setFinalShipping] = useState(shipping);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const applyCoupon = async () => {
    setLoading(true);
    setError(null);
    const result = await couponApi.checkCoupon(couponInput, cartTotal);
    if (!result.valid) {
      setError(result.reason);
      setAppliedCoupon(null);
      setDiscount(0);
      setFinalTotal(cartTotal);
      setFinalShipping(shipping);
      localStorage.removeItem('appliedCoupon');
    } else {
      setAppliedCoupon(result.coupon);
      localStorage.setItem('appliedCoupon', JSON.stringify(result.coupon));
      const calc = await couponApi.calculateDiscount(result.coupon, cartTotal, shipping);
      setDiscount(calc.discount);
      setFinalTotal(calc.total);
      setFinalShipping(calc.shipping);
    }
    setLoading(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setFinalTotal(cartTotal);
    setFinalShipping(shipping);
    setError(null);
    setCouponInput('');
    localStorage.removeItem('appliedCoupon');
  };

  // Sempre que abrir a tela, restaurar cupom salvo
  useEffect(() => {
    const saved = localStorage.getItem('appliedCoupon');
    if (saved) {
      const coupon = JSON.parse(saved);
      setAppliedCoupon(coupon);
      setCouponInput(coupon.code);
    } else {
      setAppliedCoupon(null);
      setCouponInput('');
    }

    // Sincronizar entre abas/páginas
    const handleStorage = (e) => {
      if (e.key === 'appliedCoupon') {
        if (e.newValue) {
          const coupon = JSON.parse(e.newValue);
          setAppliedCoupon(coupon);
          setCouponInput(coupon.code);
        } else {
          setAppliedCoupon(null);
          setCouponInput('');
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return {
    couponInput,
    setCouponInput,
    appliedCoupon,
    discount,
    finalTotal,
    finalShipping,
    error,
    loading,
    applyCoupon,
    removeCoupon,
  };
}
