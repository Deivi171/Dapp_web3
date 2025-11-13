import hre from "hardhat";
import "dotenv/config";

const main = async () => {
  // Create a wallet from PRIVATE KEY and connect to provider to ensure we have a signer that can send txs
  const provider = hre.ethers.provider;
  const pk = process.env.SEPOLIA_PRIVATE_KEY || process.env.PRIVATE_KEY || "";
  if (!pk) throw new Error("No private key found in env (SEPOLIA_PRIVATE_KEY or PRIVATE_KEY)");
  const deployer = new hre.ethers.Wallet(pk, provider);

  // Pass the deployer signer directly to getContractFactory (ethers v6 + hardhat-ethers)
  const TransactionsFactory = await hre.ethers.getContractFactory("Transactions", deployer);
  const transactions = await TransactionsFactory.deploy();

  // ethers v6: waitForDeployment and getAddress
  await transactions.waitForDeployment();
  console.log("Transactions deployed to:", await transactions.getAddress());
}




const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

// Example of connecting to a specific network and sending a transaction





















// const { ethers } = await network.connect({
//   network: "hardhatOp",
//   chainType: "op",
// });

// console.log("Sending transaction using the OP chain type");

// const [sender] = await ethers.getSigners();

// console.log("Sending 1 wei from", sender.address, "to itself");

// console.log("Sending L2 transaction");
// const tx = await sender.sendTransaction({
//   to: sender.address,
//   value: 1n,
// });

// await tx.wait();

// console.log("Transaction sent successfully");
