/**
 * Componente tarjeta de transacción mejorada
 * @module components/dashboard/TransactionCard
 */

import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { shortenAddress } from '../../utils/shortenAddress';
import { CopyButton } from '../ui';
import useFetch from '../../hooks/useFetch';

/**
 * URL base de Etherscan Sepolia
 */
const ETHERSCAN_BASE_URL = 'https://sepolia.etherscan.io';

/**
 * Componente TransactionCard
 * @param {Object} props
 * @param {string} props.addressTo - Dirección destino
 * @param {string} props.addressFrom - Dirección origen
 * @param {string} props.timestamp - Fecha de la transacción
 * @param {string} props.message - Mensaje de la transacción
 * @param {string} props.keyword - Keyword para el GIF
 * @param {number} props.amount - Monto en ETH
 * @param {string} props.url - URL del GIF (fallback)
 * @param {string} props.theme - Tema actual
 */
const TransactionCard = ({ 
  addressTo, 
  addressFrom, 
  timestamp, 
  message, 
  keyword, 
  amount, 
  url, 
  theme = 'dark' 
}) => {
  const gifUrl = useFetch({ keyword });

  return (
    <div className={`m-4 flex flex-1
      2xl:min-w-[350px]
      2xl:max-w-[350px]
      xl:min-w-[300px]
      xl:max-w-[300px]
      lg:min-w-[280px]
      lg:max-w-[280px]
      sm:min-w-[250px]
      sm:max-w-[250px]
      flex-col p-4 rounded-xl hover:shadow-2xl
      transition-all duration-500 hover:scale-105
      animate-fadeInUp
      cursor-pointer
      border-2
      ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-[#2952e3]' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-300 hover:border-[#2952e3] shadow-lg'
      }`}
    >
      <div className="flex flex-col items-center w-full mt-2">
        <div className="w-full mb-4 p-2">
          {/* Dirección From */}
          <div className="flex items-center justify-between group">
            <a 
              href={`${ETHERSCAN_BASE_URL}/address/${addressFrom}`} 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1 transition-all duration-300 hover:text-[#2952e3]"
            >
              <p className={`text-xs font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                De: {shortenAddress(addressFrom)}
              </p>
            </a>
            <CopyButton text={addressFrom} theme={theme} size={12} />
          </div>

          {/* Dirección To */}
          <div className="flex items-center justify-between group mt-1">
            <a 
              href={`${ETHERSCAN_BASE_URL}/address/${addressTo}`} 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1 transition-all duration-300 hover:text-[#2952e3]"
            >
              <p className={`text-xs font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Para: {shortenAddress(addressTo)}
              </p>
            </a>
            <CopyButton text={addressTo} theme={theme} size={12} />
          </div>

          {/* Monto */}
          <p className={`text-sm font-bold mt-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            💰 {amount} ETH
          </p>

          {/* Mensaje */}
          {message && (
            <p className={`text-xs italic mt-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              💬 {message}
            </p>
          )}

          {/* Keyword */}
          {keyword && (
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              🏷️ {keyword}
            </p>
          )}
        </div>

        {/* GIF */}
        <img 
          src={gifUrl || url} 
          alt={keyword || 'transaction gif'}
          className="w-full h-48 rounded-lg shadow-lg object-cover transition-all duration-300 hover:scale-105"
          loading="lazy"
        />

        {/* Footer con timestamp y enlace Etherscan */}
        <div className="w-full flex items-center justify-between mt-3">
          <div className={`px-3 py-1.5 rounded-full shadow-lg ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-[#2952e3] to-[#8945F8]' 
              : 'bg-gradient-to-r from-[#2952e3] to-[#8945F8]'
          }`}>
            <p className="text-white font-medium text-xs">
              {timestamp}
            </p>
          </div>

          <a
            href={`${ETHERSCAN_BASE_URL}/address/${addressFrom}`}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-300 ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FiExternalLink size={12} />
            Etherscan
          </a>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
