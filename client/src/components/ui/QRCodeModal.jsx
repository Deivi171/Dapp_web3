/**
 * Componente QR Code para mostrar dirección de wallet
 * @module components/ui/QRCodeModal
 */

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from './Modal';
import CopyButton from './CopyButton';
import { shortenAddress } from '../../utils/shortenAddress';

/**
 * Modal con QR Code de la dirección
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar
 * @param {string} props.address - Dirección de la wallet
 * @param {string} props.theme - Tema actual
 */
const QRCodeModal = ({ 
  isOpen, 
  onClose, 
  address, 
  theme = 'dark' 
}) => {
  if (!address) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recibir ETH"
      theme={theme}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* QR Code */}
        <div className={`p-4 rounded-2xl ${
          theme === 'dark' ? 'bg-white' : 'bg-gray-50'
        }`}>
          <QRCodeSVG
            value={address}
            size={200}
            level="H"
            includeMargin={true}
            bgColor={theme === 'dark' ? '#ffffff' : '#f9fafb'}
            fgColor="#000000"
          />
        </div>

        {/* Instrucciones */}
        <p className={`text-sm text-center ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Escanea este código QR para enviar ETH a tu wallet
        </p>

        {/* Dirección con botón de copiar */}
        <div className={`w-full p-4 rounded-xl flex items-center justify-between ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-gray-100 border border-gray-200'
        }`}>
          <div className="flex-1 overflow-hidden">
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Tu dirección
            </p>
            <p className={`text-sm font-mono truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {shortenAddress(address)}
            </p>
          </div>
          <CopyButton text={address} theme={theme} />
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
