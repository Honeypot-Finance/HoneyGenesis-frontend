const arbitrumMainNetContractAddress =
  "0x53B9fC0A0833f2A090bB92D4914430eEd4C0AAAC";
const arbitrumSepoliaContractAddress =
  "0x4ccE6489B9063C39522F06532D6345572d2945c2";
const BeraTestnetContractAddress = "0x53B9fC0A0833f2A090bB92D4914430eEd4C0AAAC";
const acceptChainId = [421614, 80085, 42161]; //arbitrum sepolia, berachain testnet, arbi one
const maxMintAmount = 20;
const arbitrumChainId = 42161;
const arbitrumSepoliaChainId = 421614;
const berachainChainId = 80085;
const kingdomlyFee = 0.009; //eth

const contracts = {
  42161: arbitrumMainNetContractAddress,
  421614: arbitrumSepoliaContractAddress,
  80085: BeraTestnetContractAddress,
};

const chainUnit = {
  42161: "ETH",
  421614: "ETH",
  80085: "Bera",
};

export {
  arbitrumSepoliaContractAddress,
  BeraTestnetContractAddress,
  arbitrumMainNetContractAddress,
  arbitrumSepoliaChainId as arbitrunChainId,
  berachainChainId,
  acceptChainId,
  maxMintAmount,
  contracts,
  chainUnit,
  kingdomlyFee,
  arbitrumChainId,
};
