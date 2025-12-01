/**
 * Hook para copiar texto al clipboard
 * @module hooks/useCopyToClipboard
 */

import { useState, useCallback } from 'react';

/**
 * Hook que permite copiar texto al clipboard
 * @returns {Object} { copy, copied, error }
 */
const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    if (!text) {
      setError('No hay texto para copiar');
      return false;
    }

    try {
      // Intentar usar la API moderna del clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setCopied(true);
      setError(null);

      // Resetear estado después de 2 segundos
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      return true;
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      setError(err.message);
      setCopied(false);
      return false;
    }
  }, []);

  return {
    copy,
    copied,
    error,
  };
};

export default useCopyToClipboard;
