import hre, { network } from "hardhat";


const main = async () => {

  const Transactions = await (hre as any).ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();

  await transactions.deployed();
  console.log("Transactions deployed to:", transactions.address);
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
