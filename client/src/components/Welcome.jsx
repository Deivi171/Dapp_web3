import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from "../context/TransactionContext";
import { ThemeContext } from "../context/ThemeContext";
import { Loader } from "./";
import { shortenAddress } from "../utils/shortenAddress";

const Input = ({ placeholder, name, type, value, handleChange, theme }) => (
    <input
        placeholder={placeholder}
        type={type}
        step="0.0001"
        value={value}
        onChange={(e) => handleChange(e, name)}
        className={`my-2 w-full rounded-lg p-3 outline-none border text-sm transition-all duration-300 ${theme === 'dark'
            ? 'bg-transparent text-white placeholder-gray-400 border-gray-600 focus:border-[#2952e3]'
            : 'bg-white/90 text-gray-800 placeholder-gray-500 border-gray-300 focus:border-[#2952e3]'
            }`}
    />
);

const Welcome = () => {
    const { connectWallet, currentAccount, formData, sendTransaction, handleChange, isLoading } = useContext(TransactionContext);
    const { theme } = useContext(ThemeContext);

    const handleSubmit = (e) => {
        const { addressTo, amount, keyword, message } = formData;

        e.preventDefault();

        if (!addressTo || !amount || !keyword || !message) return;

        sendTransaction();
    }
    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <h1 className={`text-3xl sm:text-5xl py-1 animate-fadeInLeft font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        Send Crypto <br /> across the world <br />
                    </h1>
                    <p className={`text-left mt-5 font-light md:w-9/12 w-11/12 text-base animate-fadeInLeft delay-200 ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                        Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.
                    </p>
                    {!currentAccount && (
                        <button
                            type="button"
                            onClick={connectWallet}
                            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd] animate-fadeInLeft delay-300 btn-gradient shadow-lg hover:shadow-2xl transform transition-all duration-300"
                        >
                            <AiFillPlayCircle className="text-white mr-2" size={20} />
                            <p className="text-white text-base font-semibold">Connect Wallet</p>
                        </button>
                    )}
                </div>

                <div className="flex flex-col flex-[1.5] items-center justify-start w-full mf:mt-0 mt-10 mf:ml-10">
                    <div className={`p-4 justify-end items-start flex-col rounded-xl h-44 sm:w-96 w-full my-5 animate-fadeInRight animate-float shadow-2xl ${theme === 'dark'
                        ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'
                        : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                        }`}>
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center transition-all duration-300 hover:scale-110 hover:rotate-12 animate-pulse-slow bg-white/20">
                                    <SiEthereum fontSize={21} color="#fff" />
                                </div>
                                <BsInfoCircle fontSize={17} color="#fff" className="transition-all duration-300 hover:scale-125 cursor-pointer" />
                            </div>

                            <div>
                                <p className="text-white font-light text-sm transition-all duration-300 hover:scale-105">
                                    {shortenAddress(currentAccount)}
                                </p>
                                <p className="text-white font-semibold text-lg mt-1">
                                    Ethereum
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 sm:w-[450px] w-full flex flex-col justify-start items-center animate-fadeInRight delay-200 shadow-xl rounded-2xl transition-all duration-300 ${theme === 'dark'
                        ? 'bg-[rgba(39,51,89,0.4)] backdrop-blur-lg border border-white/20'
                        : 'bg-white/80 backdrop-blur-lg border border-gray-200'
                        }`}>
                        <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} theme={theme} />
                        <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} theme={theme} />
                        <Input placeholder="Keyword (Gif)" name="keyword" type="text" handleChange={handleChange} theme={theme} />
                        <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} theme={theme} />

                        <div className={`h-[1px] ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-300'} w-full my-2`} />

                        {isLoading ? (
                            <Loader />
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={`w-full mt-2 p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold ${theme === 'dark'
                                    ? 'text-white bg-[#2952e3] hover:bg-[#2546bd] border-transparent'
                                    : 'text-white bg-gradient-to-r from-[#2952e3] to-[#8945F8] hover:from-[#2546bd] hover:to-[#7a3ee6] border-transparent shadow-md'
                                    }`}
                            >
                                Send Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}


export default Welcome;