/**
 * Componente Skeleton Loader
 * Muestra un placeholder animado mientras carga el contenido
 * @module components/ui/Skeleton
 */

import React from 'react';

/**
 * Skeleton loader reutilizable
 * @param {Object} props
 * @param {string} props.className - Clases adicionales
 * @param {string} props.variant - Variante: 'text', 'circular', 'rectangular'
 * @param {string} props.width - Ancho del skeleton
 * @param {string} props.height - Alto del skeleton
 */
const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  theme = 'dark'
}) => {
  const baseClasses = `animate-pulse ${
    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
  }`;
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || '100%',
    height: height || '1rem',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

/**
 * Skeleton para una tarjeta de transacción
 */
export const TransactionCardSkeleton = ({ theme = 'dark' }) => (
  <div className={`m-4 flex flex-1 min-w-[250px] max-w-[300px] flex-col p-4 rounded-xl ${
    theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
      : 'bg-white border border-gray-200'
  }`}>
    <div className="flex flex-col items-center w-full mt-2">
      <div className="w-full mb-4 p-2 space-y-2">
        <Skeleton theme={theme} height="12px" width="80%" />
        <Skeleton theme={theme} height="12px" width="70%" />
        <Skeleton theme={theme} height="14px" width="50%" className="mt-3" />
        <Skeleton theme={theme} height="10px" width="90%" className="mt-2" />
      </div>
      <Skeleton theme={theme} height="192px" width="100%" className="rounded-lg" />
      <Skeleton theme={theme} variant="circular" height="28px" width="120px" className="-mt-4" />
    </div>
  </div>
);

/**
 * Skeleton para el balance
 */
export const BalanceSkeleton = ({ theme = 'dark' }) => (
  <div className="space-y-2">
    <Skeleton theme={theme} height="24px" width="120px" />
    <Skeleton theme={theme} height="16px" width="80px" />
  </div>
);

export default Skeleton;
