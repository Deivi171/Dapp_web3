// https://eth-sepolia.g.alchemy.com/v2/4V3AZjGRLG_wE10OT8KYb

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/4V3AZjGRLG_wE10OT8KYb",
      accounts: [ '0x5335236734609992c06ac36d7b3ae83b5dcaf47bfac6bc96a9061419e4bde7d6' ]
    }
  }
};