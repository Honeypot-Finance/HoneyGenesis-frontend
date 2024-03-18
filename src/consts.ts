const arbitrumSepoliaContractAddress =
  "0x475C694baca169375Eaf00f8EE872A6459D5eA55";
const BeraTestnetContractAddress = "0x53B9fC0A0833f2A090bB92D4914430eEd4C0AAAC";
const acceptChainId = [421614, 80085]; //arbitrum sepolia, berachain testnet
const maxMintAmount = 20;
const arbitrunChainId = 421614;
const berachainChainId = 80085;

const contracts = {
  421614: arbitrumSepoliaContractAddress,
  80085: BeraTestnetContractAddress,
};

const chainUnit = {
  421614: "ETH",
  80085: "Bera",
};

export {
  arbitrumSepoliaContractAddress,
  BeraTestnetContractAddress,
  arbitrunChainId,
  berachainChainId,
  acceptChainId,
  maxMintAmount,
  contracts,
  chainUnit,
};
