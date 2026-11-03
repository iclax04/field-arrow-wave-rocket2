const hre = require("hardhat");

async function main() {
  const receiver = process.env.PLATFORM_RECEIVER;
  const feeBps = Number(process.env.PLATFORM_FEE_BPS || "250");
  if (!receiver || !/^0x[a-fA-F0-9]{40}$/.test(receiver)) {
    throw new Error("Set PLATFORM_RECEIVER to the fee address before deploying.");
  }
  if (!process.env.DEPLOYER_PRIVATE_KEY || !process.env.POLYGON_RPC_URL) {
    throw new Error("Set DEPLOYER_PRIVATE_KEY and POLYGON_RPC_URL outside the project. Do not commit them.");
  }
  const Gallery = await hre.ethers.getContractFactory("AgoraGallery");
  const gallery = await Gallery.deploy(receiver, feeBps);
  await gallery.waitForDeployment();
  console.log("AgoraGallery", await gallery.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
