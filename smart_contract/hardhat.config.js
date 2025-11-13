// Renamed to .bak. Hardhat v3 expects an ESM project and prefers TS/EJS config.
// Keep this file as a backup; main config is `hardhat.config.ts`.

/*
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

const { ALCHEMY_SEPOLIA_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: ALCHEMY_SEPOLIA_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
};
*/