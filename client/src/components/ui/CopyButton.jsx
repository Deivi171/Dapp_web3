/**
 * Componente botón para copiar al clipboard
 * @module components/ui/CopyButton
 */

import React from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';

/**
 * Botón para copiar texto al clipboard
 * @param {Object} props
 * @param {string} props.text - Texto a copiar
 * @param {string} props.theme - Tema actual
 * @param {string} props.className - Clases adicionales
 * @param {Function} props.onCopy - Callback cuando se copia
 */
const CopyButton = ({ 
  text, 
  theme = 'dark', 
  className = '',
  onCopy,
  size = 16
}) => {
  const { copy, copied } = useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copy(text);
    if (success && onCopy) {
      onCopy();
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-lg transition-all duration-300 ${
        copied 
          ? 'bg-green-500/20 text-green-400' 
          : theme === 'dark'
            ? 'hover:bg-white/10 text-gray-400 hover:text-white'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
      } ${className}`}
      title={copied ? '¡Copiado!' : 'Copiar'}
    >
      {copied ? <FiCheck size={size} /> : <FiCopy size={size} />}
    </button>
  );
};

export default CopyButton;
