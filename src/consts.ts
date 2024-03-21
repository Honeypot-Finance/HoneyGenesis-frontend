const arbitrumMainNetContractAddress =
  "0x7c2f99C405fa3102519F2637f186C5A06C074a0F";
const arbitrumSepoliaContractAddress =
  "0x4ccE6489B9063C39522F06532D6345572d2945c2";
const BeraTestnetContractAddress = "0x53B9fC0A0833f2A090bB92D4914430eEd4C0AAAC";
const acceptChainId = [42161, 421614, 80085]; //arbitrum sepolia, berachain testnet, arbi one
const maxMintAmount = 20;
const arbitrumChainId = 42161;
const arbitrumSepoliaChainId = 421614;
const berachainChainId = 80085;
const kingdomlyFee = 0.0009; //eth

const countDownDate = new Date(1711035000000); //"2024-03-21 15:30 UTC"

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
  countDownDate,
};
