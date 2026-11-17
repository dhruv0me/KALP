require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { SEPOLIA_RPC_URL, DEPLOYER_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

// Optional: compile with the `solc` npm package instead of downloading the
// native compiler. Useful on machines/CI that can't reach binaries.soliditylang.org.
// Usage: USE_SOLCJS=1 npx hardhat test
if (process.env.USE_SOLCJS) { // guard:allow-env-credential — Hardhat compiler toggle
  const { subtask } = require("hardhat/config");
  const { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } = require("hardhat/builtin-tasks/task-names");
  subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async () => ({
    compilerPath: require.resolve("solc/soljson.js"),
    isSolcJs: true,
    version: "0.8.24",
    longVersion: require("solc").version(),
  }));
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
};
