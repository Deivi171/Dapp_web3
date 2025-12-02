/**
 * Contexto de Transacciones
 * Maneja la conexión con la wallet, transacciones y estado de la blockchain
 * @module context/TransactionContext
 */

import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { contractABI, contractAddress } from "../utils/constants";
import { getEthPrice } from "../services/coingecko";
import { BsHandIndexThumb } from "react-icons/bs";
import { SiHandshake, SiHandshakeProtocol } from "react-icons/si";

export const TransactionContext = React.createContext();

const { ethereum } = window;

/**
 * Obtiene una instancia del contrato de transacciones
 * @returns {Promise<ethers.Contract>} Instancia del contrato
 */
const getEthereumContract = async () => {
    if (!ethereum) throw new Error("Ethereum object doesn't exist");

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
};

/**
 * Obtiene el balance de una dirección
 * @param {string} address - Dirección de la wallet
 * @returns {Promise<string>} Balance en ETH
 */
const getBalance = async (address) => {
    if (!ethereum || !address) return "0";

    try {
        const provider = new ethers.BrowserProvider(ethereum);
        const balanceWei = await provider.getBalance(address);
        return ethers.formatEther(balanceWei);
    } catch (error) {
        console.error("Error fetching balance:", error);
        return "0";
    }
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);

    // Nuevos estados para balance y precio
    const [balance, setBalance] = useState("0");
    const [ethPrice, setEthPrice] = useState(0);
    const [ethPriceChange, setEthPriceChange] = useState(0);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    /**
     * Actualiza el balance de la wallet actual
     */
    const updateBalance = useCallback(async () => {
        if (currentAccount) {
            const newBalance = await getBalance(currentAccount);
            setBalance(newBalance);
        }
    }, [currentAccount]);

    /**
     * Actualiza el precio de ETH desde CoinGecko
     */
    const updateEthPrice = useCallback(async () => {
        try {
            const priceData = await getEthPrice();
            setEthPrice(priceData.usd);
            setEthPriceChange(priceData.change24h);
        } catch (error) {
            console.error("Error fetching ETH price:", error);
        }
    }, []);

    /**
     * Obtiene todas las transacciones del contrato
     */
    const getAllTransactions = async () => {
        try {
            if (!ethereum) return toast.error("Por favor instala MetaMask");

            const transactionContract = await getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
                timestampInt: Number(transaction.timestamp),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: Number(ethers.formatEther(transaction.amount)),
            }));

            // Ordenar por timestampInt descendente (más reciente primero)
            structuredTransactions.sort((a, b) => b.timestampInt - a.timestampInt);
            setTransactions(structuredTransactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    /**
     * Verifica si la wallet está conectada
     */
    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return;

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                await getAllTransactions();
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
        }
    };

    /**
     * Verifica si existen transacciones previas
     */
    const checkIfTransactionsExists = async () => {
        try {
            if (!ethereum) return;

            const transactionContract = await getEthereumContract();
            const transactionsCount = await transactionContract.getTransactionCount();
            window.localStorage.setItem("transactionCount", transactionsCount.toString());
        } catch (error) {
            console.error("Error checking transactions:", error);
        }
    };

    /**
     * Conecta la wallet de MetaMask
     */
    const connectWallet = async () => {
        try {
            if (!ethereum) {
                toast.error("Por favor instala MetaMask");
                return;
            }

            toast.loading("Conectando wallet...", { id: "connect" });

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);

            toast.success("¡Wallet conectada!", { id: "connect" });

            await getAllTransactions();
        } catch (error) {
            console.error("Error connecting wallet:", error);
            toast.error("Error al conectar wallet", { id: "connect" });
        }
    };

    /**
     * Desconecta la wallet (limpia el estado local)
     * Nota: MetaMask no tiene un método nativo para desconectar,
     * así que limpiamos el estado local de la app
     */
    const disconnectWallet = () => {
        setCurrentAccount('');
        setBalance("0");
        setTransactions([]);
        toast("Wallet desconectada", { icon: <SiHandshakeProtocol /> });
    };

    /**
     * Envía una transacción
     */
    const sendTransaction = async () => {
        try {
            if (!ethereum) {
                toast.error("Por favor instala MetaMask");
                return;
            }

            const { addressTo, amount, keyword, message } = formData;

            if (!currentAccount) {
                toast.error("Por favor conecta tu wallet");
                return;
            }

            const transactionContract = await getEthereumContract();
            const parsedAmount = ethers.parseEther(amount || "0");

            toast.loading("Enviando transacción...", { id: "tx" });

            // Enviar ETH directamente
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",
                    value: '0x' + parsedAmount.toString(16),
                }],
            });

            // Registrar en el contrato
            const tx = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            toast.loading("Procesando en blockchain...", { id: "tx" });

            await tx.wait();

            setIsLoading(false);
            toast.success("¡Transacción exitosa! 🎉", { id: "tx" });

            const transactionsCount = await transactionContract.getTransactionCount();
            setTransactionCount(Number(transactionsCount));

            // Actualizar balance y transacciones
            await updateBalance();
            await getAllTransactions();

            // Limpiar formulario
            setFormData({ addressTo: '', amount: '', keyword: '', message: '' });

        } catch (error) {
            console.error("Transaction error:", error);
            setIsLoading(false);
            toast.error("Error en la transacción", { id: "tx" });
        }
    };

    // Efectos iniciales
    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
        updateEthPrice();

        // Actualizar precio cada minuto
        const priceInterval = setInterval(updateEthPrice, 60000);

        return () => clearInterval(priceInterval);
    }, []);

    // Actualizar balance cuando cambia la cuenta
    useEffect(() => {
        if (currentAccount) {
            updateBalance();

            // Actualizar balance cada 30 segundos
            const balanceInterval = setInterval(updateBalance, 30000);
            return () => clearInterval(balanceInterval);
        }
    }, [currentAccount, updateBalance]);

    // Escuchar cambios de cuenta en MetaMask
    useEffect(() => {
        if (ethereum) {
            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                    toast.success("Cuenta cambiada");
                } else {
                    setCurrentAccount('');
                    setBalance("0");
                    toast("Wallet desconectada", { icon: "👋" });
                }
            };

            ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    return (
        <TransactionContext.Provider
            value={{
                // Wallet
                connectWallet,
                disconnectWallet,
                currentAccount,
                balance,

                // Precio ETH
                ethPrice,
                ethPriceChange,

                // Formulario
                formData,
                setFormData,
                handleChange,

                // Transacciones
                sendTransaction,
                transactions,
                transactionCount,
                isLoading,

                // Utilidades
                updateBalance,
                getAllTransactions,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};
