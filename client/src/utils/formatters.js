/**
 * Utilidades para formateo de datos
 * @module utils/formatters
 */

/**
 * Formatea un número como moneda USD
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Decimales a mostrar (default: 2)
 * @returns {string} Valor formateado como USD
 */
export const formatUSD = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formatea un valor en ETH con el símbolo
 * @param {number|string} value - Valor en ETH
 * @param {number} decimals - Decimales a mostrar (default: 4)
 * @returns {string} Valor formateado con símbolo ETH
 */
export const formatETH = (value, decimals = 4) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '0 ETH';
  
  const numValue = Number(value);
  return `${numValue.toFixed(decimals)} ETH`;
};

/**
 * Formatea una fecha a formato legible
 * @param {Date|string|number} date - Fecha a formatear
 * @param {string} locale - Locale para formato (default: 'es-ES')
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, locale = 'es-ES') => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return String(date); // Retornar el valor original si no es una fecha válida
    }
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    console.warn('formatDate error:', error);
    return String(date);
  }
};

/**
 * Formatea una fecha relativa (hace X minutos, etc.)
 * @param {Date|string|number} date - Fecha a formatear
 * @returns {string} Tiempo relativo
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const now = new Date();
    const dateObj = new Date(date);
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return String(date);
    }
    
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(date);
  } catch (error) {
    console.warn('formatRelativeTime error:', error);
    return String(date);
  }
};

/**
 * Formatea un número grande con sufijos (K, M, B)
 * @param {number} value - Valor a formatear
 * @returns {string} Valor con sufijo
 */
export const formatCompactNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

/**
 * Formatea un hash de transacción para mostrar
 * @param {string} hash - Hash completo
 * @param {number} chars - Caracteres a mostrar en cada extremo (default: 6)
 * @returns {string} Hash abreviado
 */
export const formatTxHash = (hash, chars = 6) => {
  if (!hash || hash.length < chars * 2) return hash || '';
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
};
