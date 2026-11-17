const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // For a first test deploy the deployer is both owner and verifier.
  // Later, set the verifier to a campus admin wallet or a multisig.
  const owner = process.env.OWNER_ADDRESS || deployer.address; // guard:allow-env-credential — Hardhat deploy owner address
  const verifier = process.env.VERIFIER_ADDRESS || deployer.address; // guard:allow-env-credential — Hardhat deploy verifier address

  console.log("Deploying with:", deployer.address);

  const Kalp = await hre.ethers.getContractFactory("KalpCrowdfund");
  const kalp = await Kalp.deploy(owner, verifier);
  await kalp.waitForDeployment();

  const address = await kalp.getAddress();
  console.log("KalpCrowdfund deployed to:", address);
  console.log("Verify on Etherscan with:");
  console.log(`npx hardhat verify --network sepolia ${address} ${owner} ${verifier}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
