/**
 * Hook para obtener el precio de ETH en tiempo real
 * @module hooks/useEthPrice
 */

import { useState, useEffect, useCallback } from 'react';
import { getEthPrice } from '../services/coingecko';

/**
 * Hook que obtiene y actualiza el precio de ETH
 * @param {number} refreshInterval - Intervalo de actualización en ms (default: 60000)
 * @returns {Object} { price, change24h, isLoading, error, refetch }
 */
const useEthPrice = (refreshInterval = 60000) => {
  const [price, setPrice] = useState(null);
  const [change24h, setChange24h] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getEthPrice();
      setPrice(data.usd);
      setChange24h(data.change24h);
    } catch (err) {
      console.error('Error fetching ETH price:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener precio inicial
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  // Actualizar precio periódicamente
  useEffect(() => {
    const interval = setInterval(fetchPrice, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchPrice, refreshInterval]);

  /**
   * Calcula el valor en USD de una cantidad de ETH
   * @param {number} ethAmount - Cantidad de ETH
   * @returns {number} Valor en USD
   */
  const getValueInUSD = useCallback(
    (ethAmount) => {
      if (!price || !ethAmount) return 0;
      return ethAmount * price;
    },
    [price]
  );

  return {
    price,
    change24h,
    isLoading,
    error,
    refetch: fetchPrice,
    getValueInUSD,
  };
};

export default useEthPrice;
