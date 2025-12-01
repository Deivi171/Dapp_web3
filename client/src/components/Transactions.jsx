/**
 * Componente Transactions - Muestra el historial de transacciones
 * @module components/Transactions
 */

import React, { useContext, useMemo, useState } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { ThemeContext } from '../context/ThemeContext';

import dummyData from '../utils/dummyData';
import { shortenAddress } from '../utils/shortenAddress';
import { formatDate, formatETH, formatUSD } from '../utils/formatters';
import { exportToCSV, exportToJSON } from '../utils/exportData';
import useFetch from '../hooks/useFetch';
import { CopyButton } from './ui';
import { Stats, TransactionFilters } from './dashboard';

/**
 * Tarjeta de transaccion individual
 */
const TransactionCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url, theme, ethPrice }) => {
    const gifUrl = useFetch({ keyword });
    const amountInUSD = ethPrice ? parseFloat(amount) * ethPrice : 0;

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
            }
            `}>  
            <div className="flex flex-col items-center w-full mt-2">
                <div className="w-full mb-4 p-2">
                    <div className="flex items-center justify-between">
                        <a href={`https://sepolia.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer" className="transition-all duration-300 hover:text-[#2952e3]">   
                            <p className={`text-xs font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>From: {shortenAddress(addressFrom)}</p>     
                        </a>
                        <CopyButton text={addressFrom} theme={theme} size={12} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <a href={`https://sepolia.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer" className="transition-all duration-300 hover:text-[#2952e3]">   
                            <p className={`text-xs font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>To: {shortenAddress(addressTo)}</p>
                        </a>
                        <CopyButton text={addressTo} theme={theme} size={12} />
                    </div>
                    
                    <div className={`mt-3 px-2 py-1 rounded-lg ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                    }`}>
                        <p className={`text-sm font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{formatETH(amount, 4)}</p>
                        {ethPrice > 0 && (
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatUSD(amountInUSD)}
                            </p>
                        )}
                    </div>
                    
                    {message && (
                        <p className={`text-xs italic mt-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>"{message}"</p>
                    )}
                </div>
                <img 
                    src={gifUrl || url} 
                    alt="gif" 
                    className='w-full h-48 rounded-lg shadow-lg object-cover transition-all duration-300 hover:scale-105'
                    onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${keyword}`;
                    }}
                />

                <div className={`p-2 px-4 w-max rounded-3xl -mt-4 shadow-2xl transition-all duration-300 hover:scale-110 ${
                    theme === 'dark' 
                        ? 'bg-gradient-to-r from-[#2952e3] to-[#8945F8]' 
                        : 'bg-gradient-to-r from-[#2952e3] to-[#8945F8]'
                }`}>
                    <p className="text-white font-bold text-xs">{formatDate(timestamp)}</p>
                </div>
            </div>
        </div>
    );
}

/**
 * Componente principal de transacciones
 */
const Transactions = () => {
    const { currentAccount, transactions, ethPrice } = useContext(TransactionContext);
    const { theme } = useContext(ThemeContext);
    
    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Filtrar y ordenar transacciones
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];
        
        // Filtrar por busqueda
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(tx => 
                tx.addressFrom?.toLowerCase().includes(search) ||
                tx.addressTo?.toLowerCase().includes(search) ||
                tx.message?.toLowerCase().includes(search) ||
                tx.keyword?.toLowerCase().includes(search)
            );
        }
        
        // Filtrar por rango de fechas
        if (dateRange.start) {
            const startDate = new Date(dateRange.start).getTime();
            result = result.filter(tx => {
                const txDate = new Date(tx.timestamp).getTime();
                return txDate >= startDate;
            });
        }
        if (dateRange.end) {
            const endDate = new Date(dateRange.end).getTime() + 86400000;
            result = result.filter(tx => {
                const txDate = new Date(tx.timestamp).getTime();
                return txDate <= endDate;
            });
        }
        
        // Ordenar
        result.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
        
        return result;
    }, [transactions, searchTerm, sortOrder, dateRange]);

    // Handlers para export
    const handleExportCSV = () => {
        exportToCSV(filteredTransactions, 'transactions');
    };

    const handleExportJSON = () => {
        exportToJSON(filteredTransactions, 'transactions');
    };

    const handleFilterChange = (filterType, value) => {
        if (filterType === 'search') setSearchTerm(value);
        else if (filterType === 'sort') setSortOrder(value);
        else if (filterType === 'dateStart') setDateRange(prev => ({ ...prev, start: value }));
        else if (filterType === 'dateEnd') setDateRange(prev => ({ ...prev, end: value }));
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSortOrder('newest');
        setDateRange({ start: '', end: '' });
    };

    return(
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
                        
                        {/* Filtros y Export */}
                        {transactions.length > 0 && (
                            <TransactionFilters
                                searchTerm={searchTerm}
                                sortOrder={sortOrder}
                                dateRange={dateRange}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                                onExportCSV={handleExportCSV}
                                onExportJSON={handleExportJSON}
                                theme={theme}
                                totalResults={filteredTransactions.length}
                                totalTransactions={transactions.length}
                            />
                        )}
                        
                        {/* Mensaje cuando no hay resultados de filtro */}
                        {transactions.length > 0 && filteredTransactions.length === 0 && (
                            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                <p className="text-lg">No transactions match your filters</p>
                                <button 
                                    onClick={handleClearFilters}
                                    className="mt-3 text-blue-500 hover:text-blue-600 underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-center items-center mt-6">
                            {[...filteredTransactions].reverse().map((transaction, i) => (
                                <div 
                                    key={i} 
                                    className={`animate-fadeInUp`}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <TransactionCard {...transaction} theme={theme} ethPrice={ethPrice} />
                                </div>
                            ))}
                        </div>
                        
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