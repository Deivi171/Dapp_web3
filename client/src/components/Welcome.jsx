/**
 * Componente Welcome - Página principal con formulario de transacciones
 * @module components/Welcome
 */

import React, { useContext, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle, BsShieldCheck, BsGlobe, BsLink45Deg } from "react-icons/bs";
import { HiOutlineQrcode } from "react-icons/hi";
import { BiLock, BiCoinStack } from "react-icons/bi";
import { motion, useMotionValue, useSpring } from "motion/react";

import { TransactionContext } from "../context/TransactionContext";
import { ThemeContext } from "../context/ThemeContext";
import { Loader } from "./";
import { QRCodeModal, CopyButton, GradientText } from "./ui";
import { shortenAddress } from "../utils/shortenAddress";
import { formatUSD, formatETH } from "../utils/formatters";
import { validateTransactionForm } from "../utils/validators";

/**
 * Componente Input con validación
 */
const Input = ({ placeholder, name, type, value, handleChange, theme, error }) => (
    <div className="w-full">
        <input
            placeholder={placeholder}
            type={type}
            step="0.0001"
            value={value}
            onChange={(e) => handleChange(e, name)}
            className={`my-2 w-full rounded-lg p-3 outline-none border text-sm transition-all duration-300 ${error
                    ? 'border-red-500 focus:border-red-500'
                    : theme === 'dark'
                        ? 'bg-transparent text-white placeholder-gray-400 border-gray-600 focus:border-[#2952e3]'
                        : 'bg-white/90 text-gray-800 placeholder-gray-500 border-gray-300 focus:border-[#2952e3]'
                }`}
        />
        {error && (
            <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
        )}
    </div>
);

const Welcome = () => {
    const {
        connectWallet,
        currentAccount,
        formData,
        sendTransaction,
        handleChange,
        isLoading,
        balance,
        ethPrice,
        ethPriceChange
    } = useContext(TransactionContext);
    const { theme } = useContext(ThemeContext);

    // Estados locales
    const [showQRModal, setShowQRModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    /**
     * Maneja el envío del formulario con validación
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const validation = validateTransactionForm(formData);
        setErrors(validation.errors);

        setTouched({
            addressTo: true,
            amount: true,
            keyword: true,
            message: true,
        });

        if (!validation.isValid) return;

        sendTransaction();
    };

    /**
     * Maneja cambios en los inputs con validación en tiempo real
     */
    const handleInputChange = (e, name) => {
        handleChange(e, name);

        if (touched[name]) {
            const newFormData = { ...formData, [name]: e.target.value };
            const validation = validateTransactionForm(newFormData);
            setErrors(prev => ({
                ...prev,
                [name]: validation.errors[name]
            }));
        }
    };

    // Calcular valor en USD
    const balanceInUSD = ethPrice && balance ? parseFloat(balance) * ethPrice : 0;

    // Estados para efecto 3D tipo TiltedCard
    const cardRef = React.useRef(null);
    const rotateAmplitude = 14;
    
    const springValues = { damping: 30, stiffness: 100, mass: 2 };
    const rotateX = useSpring(0, springValues);
    const rotateY = useSpring(0, springValues);
    const scale = useSpring(1, springValues);
    const glareX = useMotionValue(0);
    const glareY = useMotionValue(0);
    const glareOpacity = useSpring(0, springValues);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;
        
        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
        
        rotateX.set(rotationX);
        rotateY.set(rotationY);
        glareX.set(e.clientX - rect.left);
        glareY.set(e.clientY - rect.top);
    };

    const handleMouseEnter = () => {
        scale.set(1.08);
        glareOpacity.set(1);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
        scale.set(1);
        glareOpacity.set(0);
    };

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-start md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
                    <h1 className={`text-3xl sm:text-5xl py-1 animate-fadeInLeft font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        <GradientText
                            colors={["#2952e3", "#8945F8", "#4ECDC4", "#2952e3"]}
                            animationSpeed={8}
                            className="font-bold"
                        >
                            Send Crypto<br />across the world
                        </GradientText>
                    </h1>
                    <p className={`text-left mt-5 font-light md:w-9/12 w-11/12 text-base animate-fadeInLeft delay-200 ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                        Explore the crypto world. Buy and sell cryptocurrencies easily on Flashet.
                    </p>
                </div>

                <div className="flex flex-col flex-[1.5] items-center justify-start w-full mf:mt-0 mt-10 mf:ml-10">
                    {/* Tarjeta ETH con balance - Efecto TiltedCard */}
                    <figure
                        ref={cardRef}
                        className="relative [perspective:800px] flex items-center justify-center my-5"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <motion.div
                            className="relative [transform-style:preserve-3d]"
                            style={{
                                rotateX,
                                rotateY,
                                scale
                            }}
                        >
                            <div
                                className={`p-4 flex flex-col justify-between rounded-xl h-48 sm:w-96 w-full shadow-2xl relative overflow-hidden cursor-pointer ${theme === 'dark'
                                    ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'
                                    : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                                }`}
                            >
                                {/* Glare effect */}
                                <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: 'radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.3) 0%, transparent 60%)',
                                        opacity: glareOpacity,
                                        '--x': glareX,
                                        '--y': glareY,
                                    }}
                                />
                                
                                <div className="flex justify-between items-start">
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center transition-all duration-300 hover:scale-110 hover:rotate-12 bg-white/20 [transform:translateZ(40px)]"
                                    >
                                        <SiEthereum fontSize={21} color="#fff" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BsInfoCircle fontSize={17} color="#fff" className="transition-all duration-300 hover:scale-125 cursor-pointer" />
                                    </div>
                                </div>

                                <div className="[transform:translateZ(30px)]">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-light text-sm">
                                            {shortenAddress(currentAccount)}
                                        </p>
                                        {currentAccount && (
                                            <CopyButton
                                                text={currentAccount}
                                                theme="dark"
                                                size={14}
                                                className="!text-white/70 hover:!text-white"
                                            />
                                        )}
                                    </div>

                                    {currentAccount && (
                                        <div className="mt-1">
                                            <p className="text-white font-bold text-xl">
                                                {formatETH(balance, 4)}
                                            </p>
                                            {ethPrice > 0 && (
                                                <p className="text-white/80 text-sm">
                                                    {formatUSD(balanceInUSD)}
                                                    {ethPriceChange !== 0 && (
                                                        <span className={`ml-2 text-xs ${ethPriceChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                                            {ethPriceChange >= 0 ? '+' : ''}{ethPriceChange.toFixed(2)}%
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {!currentAccount && (
                                        <p className="text-white font-semibold text-lg mt-1">Ethereum</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </figure>

                    <div className={`p-6 sm:w-[450px] w-full flex flex-col justify-start items-center animate-fadeInRight delay-200 shadow-xl rounded-2xl transition-all duration-300 relative z-10 ${theme === 'dark'
                            ? 'bg-[rgba(39,51,89,0.4)] backdrop-blur-lg border border-white/20'
                            : 'bg-white/80 backdrop-blur-lg border border-gray-200'
                        }`}>
                        <Input
                            placeholder="Address To (0x...)"
                            name="addressTo"
                            type="text"
                            value={formData.addressTo}
                            handleChange={handleInputChange}
                            theme={theme}
                            error={touched.addressTo && errors.addressTo}
                        />
                        <Input
                            placeholder="Amount (ETH)"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            handleChange={handleInputChange}
                            theme={theme}
                            error={touched.amount && errors.amount}
                        />
                        <Input
                            placeholder="Keyword (Gif)"
                            name="keyword"
                            type="text"
                            value={formData.keyword}
                            handleChange={handleInputChange}
                            theme={theme}
                            error={touched.keyword && errors.keyword}
                        />
                        <Input
                            placeholder="Enter Message"
                            name="message"
                            type="text"
                            value={formData.message}
                            handleChange={handleInputChange}
                            theme={theme}
                            error={touched.message && errors.message}
                        />

                        <div className={`h-[1px] ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-300'} w-full my-2`} />

                        {isLoading ? (
                            <Loader />
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!currentAccount}
                                className={`w-full mt-2 p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold ${!currentAccount ? 'opacity-50 cursor-not-allowed' : ''
                                    } ${theme === 'dark'
                                        ? 'text-white bg-[#2952e3] hover:bg-[#2546bd] border-transparent'
                                        : 'text-white bg-gradient-to-r from-[#2952e3] to-[#8945F8] hover:from-[#2546bd] hover:to-[#7a3ee6] border-transparent shadow-md'
                                    }`}
                            >
                                {currentAccount ? 'Send Now' : 'Connect Wallet First'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal QR */}
            <QRCodeModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                address={currentAccount}
                theme={theme}
            />
        </div>
    );
}

export default Welcome;