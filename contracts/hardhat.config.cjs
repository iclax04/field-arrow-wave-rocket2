/** Chain deploy config. Keys and RPC URLs come from the host environment, never from this file. */
require("@nomicfoundation/hardhat-toolbox");

const rpc = process.env.POLYGON_RPC_URL || "";
const key = process.env.DEPLOYER_PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.24",
  networks: {
    polygon: {
      url: rpc,
      accounts: key ? [key] : [],
    },
  },
};
