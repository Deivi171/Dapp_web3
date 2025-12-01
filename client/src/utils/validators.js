/**
 * Utilidades para validación de datos
 * @module utils/validators
 */

/**
 * Valida si una dirección Ethereum es válida
 * @param {string} address - Dirección a validar
 * @returns {boolean} true si es válida
 */
export const isValidEthAddress = (address) => {
  if (!address) return false;
  // Regex para dirección Ethereum: 0x seguido de 40 caracteres hexadecimales
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
};

/**
 * Valida si un monto es válido para transacción
 * @param {string|number} amount - Monto a validar
 * @returns {boolean} true si es válido
 */
export const isValidAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return false;
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

/**
 * Valida el formulario de transacción completo
 * @param {Object} formData - Datos del formulario
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateTransactionForm = (formData) => {
  const errors = {};
  
  // Validar dirección
  if (!formData.addressTo) {
    errors.addressTo = 'La dirección es requerida';
  } else if (!isValidEthAddress(formData.addressTo)) {
    errors.addressTo = 'Dirección Ethereum inválida';
  }
  
  // Validar monto
  if (!formData.amount) {
    errors.amount = 'El monto es requerido';
  } else if (!isValidAmount(formData.amount)) {
    errors.amount = 'El monto debe ser mayor a 0';
  } else if (Number(formData.amount) < 0.0001) {
    errors.amount = 'El monto mínimo es 0.0001 ETH';
  }
  
  // Validar keyword
  if (!formData.keyword || formData.keyword.trim() === '') {
    errors.keyword = 'El keyword es requerido';
  } else if (formData.keyword.length < 2) {
    errors.keyword = 'El keyword debe tener al menos 2 caracteres';
  }
  
  // Validar mensaje
  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'El mensaje es requerido';
  } else if (formData.message.length < 3) {
    errors.message = 'El mensaje debe tener al menos 3 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Obtiene el mensaje de error para un campo específico
 * @param {Object} errors - Objeto de errores
 * @param {string} field - Nombre del campo
 * @returns {string|null} Mensaje de error o null
 */
export const getFieldError = (errors, field) => {
  return errors[field] || null;
};

/**
 * Valida si un string es un hash de transacción válido
 * @param {string} hash - Hash a validar
 * @returns {boolean} true si es válido
 */
export const isValidTxHash = (hash) => {
  if (!hash) return false;
  const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
  return txHashRegex.test(hash);
};
