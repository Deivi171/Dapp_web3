import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { ThemeContext } from '../context/ThemeContext';

import dummyData from '../utils/dummyData';
import { shortenAddress } from '../utils/shortenAddress';
import useFetch from '../hooks/useFetch';

const TransactionCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url, theme }) => {
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
            }
            `}>  
            <div className="flex flex-col items-center w-full mt-2">
                <div className="w-full mb-4 p-2">
                    <a href={`https://sepolia.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer" className="transition-all duration-300 hover:text-[#2952e3]">   
                        <p className={`text-xs font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>From: {shortenAddress(addressFrom)}</p>     
                    </a>
                    <a href={`https://sepolia.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer" className="transition-all duration-300 hover:text-[#2952e3]">   
                        <p className={`text-xs font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>To: {shortenAddress(addressTo)}</p>
                    </a>
                    <p className={`text-xs font-bold mt-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Amount: {amount} ETH</p>
                    {message && (
                        <>
                            <p className={`text-xs italic mt-1 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>Message: {message}</p>
                        </>
                    )}
                </div>
                <img 
                    src={gifUrl || url} 
                    alt="gif" 
                    className='w-full h-48 rounded-lg shadow-lg object-cover transition-all duration-300 hover:scale-105'
                />

                <div className={`p-2 px-4 w-max rounded-3xl -mt-4 shadow-2xl transition-all duration-300 hover:scale-110 ${
                    theme === 'dark' 
                        ? 'bg-gradient-to-r from-[#2952e3] to-[#8945F8]' 
                        : 'bg-gradient-to-r from-[#2952e3] to-[#8945F8]'
                }`}>
                    <p className="text-white font-bold text-xs">{timestamp}</p>
                </div>
            </div>
        </div>
    );
}


const Transactions = () => {
    const { currentAccount, transactions } = useContext(TransactionContext);
    const { theme } = useContext(ThemeContext);

    return(
        <div className="flex w-full justify-center items-center 2xl:px-20">
            <div className="flex flex-col md:p-12 py-12 px-4">
                {currentAccount ? (
                    <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-3xl text-center my-2 animate-fadeInUp`}>
                        Latest Transactions
                    </h3>
                ) : (
                    <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-3xl text-center my-2 animate-fadeInUp`}>
                        Connect your account to see the latest transactions
                    </h3>
                )}

                <div className="flex flex-wrap justify-center items-center mt-10">
                    {[...transactions].reverse().map((transaction, i) => (
                        <div 
                            key={i} 
                            className={`animate-fadeInUp`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <TransactionCard {...transaction} theme={theme} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Transactions;