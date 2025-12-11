import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    productService.getBySlug(slug)
      .then(res => setProduct(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}
