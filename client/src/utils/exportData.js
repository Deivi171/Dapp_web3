/**
 * Utilidades para exportación de datos
 * @module utils/exportData
 */

/**
 * Convierte transacciones a formato CSV
 * @param {Array} transactions - Array de transacciones
 * @returns {string} Contenido CSV
 */
export const transactionsToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return '';
  }

  // Headers del CSV
  const headers = [
    'Fecha',
    'De',
    'Para',
    'Monto (ETH)',
    'Mensaje',
    'Keyword'
  ];

  // Convertir cada transacción a fila CSV
  const rows = transactions.map((tx) => [
    tx.timestamp || '',
    tx.addressFrom || '',
    tx.addressTo || '',
    tx.amount || 0,
    `"${(tx.message || '').replace(/"/g, '""')}"`, // Escapar comillas
    tx.keyword || ''
  ]);

  // Unir todo
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Convierte transacciones a formato JSON legible
 * @param {Array} transactions - Array de transacciones
 * @returns {string} Contenido JSON formateado
 */
export const transactionsToJSON = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return '[]';
  }

  const formattedTransactions = transactions.map((tx) => ({
    fecha: tx.timestamp,
    de: tx.addressFrom,
    para: tx.addressTo,
    monto: `${tx.amount} ETH`,
    mensaje: tx.message,
    keyword: tx.keyword
  }));

  return JSON.stringify(formattedTransactions, null, 2);
};

/**
 * Descarga un archivo con el contenido proporcionado
 * @param {string} content - Contenido del archivo
 * @param {string} filename - Nombre del archivo
 * @param {string} mimeType - Tipo MIME del archivo
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Limpiar
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta transacciones como CSV y descarga el archivo
 * @param {Array} transactions - Array de transacciones
 * @param {string} filename - Nombre del archivo (sin extensión)
 */
export const exportToCSV = (transactions, filename = 'transacciones') => {
  const csv = transactionsToCSV(transactions);
  if (!csv) {
    console.warn('No hay transacciones para exportar');
    return false;
  }
  
  const date = new Date().toISOString().split('T')[0];
  downloadFile(csv, `${filename}_${date}.csv`, 'text/csv;charset=utf-8;');
  return true;
};

/**
 * Exporta transacciones como JSON y descarga el archivo
 * @param {Array} transactions - Array de transacciones
 * @param {string} filename - Nombre del archivo (sin extensión)
 */
export const exportToJSON = (transactions, filename = 'transacciones') => {
  const json = transactionsToJSON(transactions);
  if (json === '[]') {
    console.warn('No hay transacciones para exportar');
    return false;
  }
  
  const date = new Date().toISOString().split('T')[0];
  downloadFile(json, `${filename}_${date}.json`, 'application/json');
  return true;
};
