/**
 * Hook para obtener el balance de una wallet
 * @module hooks/useBalance
 */

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const { ethereum } = window;

/**
 * Hook que obtiene y actualiza el balance de una wallet
 * @param {string} address - Dirección de la wallet
 * @returns {Object} { balance, balanceFormatted, isLoading, error, refetch }
 */
const useBalance = (address) => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    if (!address || !ethereum) {
      setBalance(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err.message);
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Obtener balance inicial y cuando cambie la dirección
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Escuchar cambios en la blockchain para actualizar balance
  useEffect(() => {
    if (!ethereum || !address) return;

    const handleBlockChange = () => {
      fetchBalance();
    };

    // Actualizar cada nuevo bloque (aproximadamente cada 12 segundos)
    const provider = new ethers.BrowserProvider(ethereum);
    provider.on('block', handleBlockChange);

    return () => {
      provider.off('block', handleBlockChange);
    };
  }, [address, fetchBalance]);

  return {
    balance,
    balanceFormatted: balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0 ETH',
    isLoading,
    error,
    refetch: fetchBalance,
  };
};

export default useBalance;
