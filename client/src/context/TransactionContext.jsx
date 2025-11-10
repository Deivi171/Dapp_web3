import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
    if (!ethereum) throw new Error("Ethereum object doesn't exist");

    // ethers v6: use BrowserProvider in the browser
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({ provider, signer, transactionContract });
    return transactionContract;
};


export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };


    const getAllTransactions = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");
                // get contract instance (await the promise)
                const transactionContract = await getEthereumContract();

                const availableTransactions = await transactionContract.getAllTransactions();

                // adapt to ethers v6 return types (timestamp as bigint, amount as BigInt or native)
                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    // use ethers.formatEther to convert wei to ETH (returns string)
                    amount: Number(ethers.formatEther(transaction.amount)),
                }));
            console.log(structuredTransactions);

            setTransactions(structuredTransactions);
        } catch (error) {
            console.log(error);
        }
    }



    const checkIfWalletIsConnected = async () => {

        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                // load transactions for this account
                await getAllTransactions();
            } else {
                console.log("No accounts found");
            }

        } catch (error) {

            console.log(error);

            throw new Error("No Ethereum object.");
        }

    }

    const checkIfTransactionsExists = async () => {
        try {
            const transactionContract = await getEthereumContract();
            const transactionsCount = await transactionContract.getTransactionCount();
            
        // store as string (BigInt/number safe)
        window.localStorage.setItem("transactionCount", transactionsCount.toString());
        
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object.");
        }
    }        





    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            setCurrentAccount(accounts[0]);
            // load transactions now that user connected
            await getAllTransactions();

        } catch (error) {
            console.error(error);

            throw new Error("No Ethereum object.");
        }
    }


    const sendTransaction = async () => {
    try {
        if (!ethereum) return alert("Please install MetaMask.");

        const { addressTo, amount, keyword, message } = formData;
        if (!currentAccount) return alert("Please connect your wallet.");

        const transactionContract = await getEthereumContract();
        // ethers v6: parseEther is top-level
        const parsedAmount = ethers.parseEther(amount || "0");

        // Send transaction via wallet (optional - this sends raw ETH)
        await ethereum.request({
            method: "eth_sendTransaction",
            params: [{
                from: currentAccount,
                to: addressTo,
                gas: "0x5208",
                // eth_sendTransaction expects a hex value string (wei)
                value: '0x' + parsedAmount.toString(16),
            }],
        });

        // Interact with contract to add to blockchain (assumes contract has this method)
        const tx = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${tx.hash}`);
        await tx.wait();
        setIsLoading(false);
        console.log(`Success - ${tx.hash}`);

    const transactionsCount = await transactionContract.getTransactionCount();
    setTransactionCount(Number(transactionsCount));
    // refresh transactions list
    await getAllTransactions();


    } catch (error) {
        console.log(error);

        throw new Error("No Ethereum object.");
    }
}
    

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange , sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    );
};
