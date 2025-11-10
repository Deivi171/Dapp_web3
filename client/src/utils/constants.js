import abi from './Transactions.json';
// Esta direccion salio de desplegar el contrato en Sepolia. Comando usado: npx hardhat run scripts/deploy.js --network sepolia

export const contractABI = abi.abi;
export const contractAddress = '0x5BA559602F4AF894146f9921B1c6725Ad3fc8F29'; // Sepolia deployed contract address