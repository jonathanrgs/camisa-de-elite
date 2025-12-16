import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

export function useShippingConfig() {
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getShippingConfig()
      .then(({ config }) => {
        setShipping(config);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar regras de frete');
        setLoading(false);
      });
  }, []);

  return { shipping, loading, error };
}