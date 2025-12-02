/**
 * Componente Transactions - Muestra el historial de transacciones
 * @module components/Transactions
 */

import React, { useContext, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { TransactionContext } from '../context/TransactionContext';
import { ThemeContext } from '../context/ThemeContext';

import { shortenAddress } from '../utils/shortenAddress';
import { formatDate, formatETH, formatUSD } from '../utils/formatters';
import useFetch from '../hooks/useFetch';
import { CopyButton } from './ui';
import { Stats } from './dashboard';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

/**
 * Tarjeta de transaccion individual con efecto 3D
 */
const TransactionCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url, theme, ethPrice }) => {
    const gifUrl = useFetch({ keyword });
    const amountInUSD = ethPrice ? parseFloat(amount) * ethPrice : 0;

    // Refs y estados para el efecto 3D
    const ref = useRef(null);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const [isHovered, setIsHovered] = useState(false);

    function handleMouse(e) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
        const rotationX = (offsetY / (rect.height / 2)) * -10;
        const rotationY = (offsetX / (rect.width / 2)) * 10;
        rotateX.set(rotationX);
        rotateY.set(rotationY);
    }

    function handleMouseEnter() {
        scale.set(1.02);
        setIsHovered(true);
    }

    function handleMouseLeave() {
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        setIsHovered(false);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                scale,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
            className={`m-4 flex flex-1
                2xl:min-w-[350px]
                2xl:max-w-[350px]
                xl:min-w-[300px]
                xl:max-w-[300px]
                lg:min-w-[280px]
                lg:max-w-[280px]
                sm:min-w-[250px]
                sm:max-w-[250px]
                flex-col p-4 rounded-xl
                transition-shadow duration-300
                cursor-pointer
                border-2
                ${isHovered ? 'shadow-2xl shadow-purple-500/20' : 'shadow-lg'}
                ${theme === 'dark'
                    ? `bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-gray-700 ${isHovered ? 'border-[#2952e3]' : ''}`
                    : `bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border-gray-300 ${isHovered ? 'border-[#2952e3]' : ''} shadow-lg`
                }
            `}>
            <div className="flex flex-col items-center w-full mt-2" style={{ transform: 'translateZ(20px)' }}>
                <div className="w-full mb-4 p-2">
                    <div className="flex items-center justify-between">
                        <a href={`https://sepolia.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer" className="transition-all duration-300 hover:text-[#2952e3]">
                            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>From: {shortenAddress(addressFrom)}</p>
                        </a>
                        <CopyButton text={addressFrom} theme={theme} size={12} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <a href={`https://sepolia.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer" className="transition-all duration-300 hover:text-[#2952e3]">
                            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>To: {shortenAddress(addressTo)}</p>
                        </a>
                        <CopyButton text={addressTo} theme={theme} size={12} />
                    </div>

                    <div className={`mt-3 px-2 py-1 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
                        }`}>
                        <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{formatETH(amount, 4)}</p>
                        {ethPrice > 0 && (
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatUSD(amountInUSD)}
                            </p>
                        )}
                    </div>

                    {message && (
                        <p className={`text-xs italic mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>"{message}"</p>
                    )}
                </div>

                {/* Imagen con efecto de profundidad */}
                <div className="w-full h-48 rounded-lg overflow-hidden" style={{ transform: 'translateZ(40px)' }}>
                    <img
                        src={gifUrl || url}
                        alt={keyword}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${keyword}`;
                        }}
                    />
                </div>

                <div
                    className={`p-2 px-4 w-max rounded-3xl -mt-4 shadow-2xl transition-all duration-300 hover:scale-110 z-10 ${theme === 'dark'
                            ? 'bg-gradient-to-r from-[#2952e3] to-[#8945F8]'
                            : 'bg-gradient-to-r from-[#2952e3] to-[#8945F8]'
                        }`}
                    style={{ transform: 'translateZ(60px)' }}
                >
                    <p className="text-white font-bold text-xs">{formatDate(timestamp)}</p>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Componente principal de transacciones
 */
const Transactions = () => {
    const { currentAccount, transactions, ethPrice } = useContext(TransactionContext);
    const { theme } = useContext(ThemeContext);

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Ordenar transacciones (más recientes primero)
    const sortedTransactions = [...transactions].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
    });

    return (
        <div className="flex w-full justify-center items-center 2xl:px-20">
            <div className="flex flex-col md:p-12 py-12 px-4 w-full">
                {currentAccount ? (
                    <>
                        <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-3xl text-center my-2 animate-fadeInUp font-bold`}>
                            Latest Transactions
                        </h3>

                        {/* Stats Dashboard */}
                        {transactions.length > 0 && (
                            <Stats
                                transactions={transactions}
                                currentAccount={currentAccount}
                                ethPrice={ethPrice}
                                theme={theme}
                            />
                        )}

                        <div className="flex flex-wrap justify-center items-center mt-6">
                            {sortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((transaction, i) => (
                                <div
                                    key={i}
                                    className={`animate-fadeInUp`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <TransactionCard {...transaction} theme={theme} ethPrice={ethPrice} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {sortedTransactions.length > itemsPerPage && (
                            <div className="flex justify-center items-center mt-8 gap-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === 1
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:scale-105 active:scale-95'
                                        } ${theme === 'dark'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    Previous
                                </button>

                                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Page {currentPage} of {Math.ceil(sortedTransactions.length / itemsPerPage)}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(sortedTransactions.length / itemsPerPage)))}
                                    disabled={currentPage === Math.ceil(sortedTransactions.length / itemsPerPage)}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === Math.ceil(sortedTransactions.length / itemsPerPage)
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:scale-105 active:scale-95'
                                        } ${theme === 'dark'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Mensaje cuando no hay transacciones */}
                        {transactions.length === 0 && (
                            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                <p className="text-lg">No transactions yet</p>
                                <p className="text-sm mt-2">Send your first transaction to see it here</p>
                            </div>
                        )}
                    </>
                ) : (
                    <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-3xl text-center my-2 animate-fadeInUp`}>
                        Connect your account to see the latest transactions
                    </h3>
                )}
            </div>
        </div>
    );
}

export default Transactions;