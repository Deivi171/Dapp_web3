/**
 * Componente de filtros para transacciones
 * @module components/dashboard/TransactionFilters
 */

import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiX } from 'react-icons/fi';
import { exportToCSV, exportToJSON } from '../../utils/exportData';

/**
 * Componente TransactionFilters
 * @param {Object} props
 * @param {Function} props.onFilter - Callback cuando cambian los filtros
 * @param {Array} props.transactions - Transacciones para exportar
 * @param {string} props.theme - Tema actual
 */
const TransactionFilters = ({ 
  onFilter, 
  transactions = [], 
  theme = 'dark' 
}) => {
  const [search, setSearch] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    applyFilters(value, minAmount, maxAmount);
  };

  const handleMinAmountChange = (e) => {
    const value = e.target.value;
    setMinAmount(value);
    applyFilters(search, value, maxAmount);
  };

  const handleMaxAmountChange = (e) => {
    const value = e.target.value;
    setMaxAmount(value);
    applyFilters(search, minAmount, value);
  };

  const applyFilters = (searchVal, minVal, maxVal) => {
    onFilter({
      search: searchVal,
      minAmount: minVal ? parseFloat(minVal) : null,
      maxAmount: maxVal ? parseFloat(maxVal) : null,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setMinAmount('');
    setMaxAmount('');
    onFilter({ search: '', minAmount: null, maxAmount: null });
  };

  const handleExportCSV = () => {
    exportToCSV(transactions, 'flashet_transacciones');
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    exportToJSON(transactions, 'flashet_transacciones');
    setShowExportMenu(false);
  };

  const hasActiveFilters = search || minAmount || maxAmount;

  const inputClasses = `w-full p-2 rounded-lg text-sm outline-none transition-all duration-300 ${
    theme === 'dark'
      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
      : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
  }`;

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`} size={16} />
          <input
            type="text"
            placeholder="Buscar por dirección o mensaje..."
            value={search}
            onChange={handleSearchChange}
            className={`${inputClasses} pl-9`}
          />
        </div>

        {/* Filtros de monto */}
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="number"
              placeholder="Min ETH"
              value={minAmount}
              onChange={handleMinAmountChange}
              step="0.001"
              min="0"
              className={`${inputClasses} w-28`}
            />
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Max ETH"
              value={maxAmount}
              onChange={handleMaxAmountChange}
              step="0.001"
              min="0"
              className={`${inputClasses} w-28`}
            />
          </div>
        </div>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <FiX size={14} />
            Limpiar
          </button>
        )}

        {/* Exportar */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={transactions.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              transactions.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } ${
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <FiDownload size={16} />
            Exportar
          </button>

          {/* Menú de exportación */}
          {showExportMenu && (
            <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg overflow-hidden z-10 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <button
                onClick={handleExportCSV}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-white hover:bg-gray-700'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                📄 Exportar CSV
              </button>
              <button
                onClick={handleExportJSON}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-white hover:bg-gray-700'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                📋 Exportar JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className={`mt-2 text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <FiFilter className="inline mr-1" size={12} />
          Filtros activos
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
