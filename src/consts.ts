const arbitrumSepoliaContractAddress =
  "0xEC752580aD907a471f0c2cD95A89840Bf3802Ade";
const BeraTestnetContractAddress = "0x53B9fC0A0833f2A090bB92D4914430eEd4C0AAAC";
const acceptChainId = [421614, 80085]; //arbitrum sepolia, berachain testnet
const maxMintAmount = 20;
const contracts = {
  "421614": arbitrumSepoliaContractAddress,
  "80085": BeraTestnetContractAddress,
};

export {
  arbitrumSepoliaContractAddress,
  acceptChainId,
  maxMintAmount,
  contracts,
};
