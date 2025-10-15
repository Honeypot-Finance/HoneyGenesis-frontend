const acceptChainId = [42161, 421614, 80085]; //arbitrum sepolia, berachain testnet, arbi one
const maxMintAmount = 20;
const kingdomlyFee = 0.0009; //eth

const countDownDate = new Date(1711035000000); //"2024-03-21 15:30 UTC"

const contracts = {
  42161: "0x7c2f99C405fa3102519F2637f186C5A06C074a0F",
  421614: "0x4ccE6489B9063C39522F06532D6345572d2945c2",
  80085: "0x53B9fC0A0833f2A090bB92D4914430eEd4C0AAAC",
};

const chainUnit = {
  42161: "ETH",
  421614: "ETH",
  80085: "Bera",
};

// Staking contract addresses
const BERACHAIN_TESTNET = 80069; // Berachain Bepolia
const stakingContractAddresses = {
  [BERACHAIN_TESTNET]: "0xE72D2C76cE3B0302392513FAE83EF2b5949BaD7e" as const,
};

const nftContractProxy = {
  [BERACHAIN_TESTNET]: "0xfF95cdfC724Ca85b8d96D5a6Ea86333AC6a4799D" as const,
};

const DEFAULT_STAKING_CHAIN_ID = BERACHAIN_TESTNET;

export {
  acceptChainId,
  maxMintAmount,
  contracts,
  chainUnit,
  kingdomlyFee,
  countDownDate,
  // Staking exports
  BERACHAIN_TESTNET,
  nftContractProxy,
  stakingContractAddresses,
  DEFAULT_STAKING_CHAIN_ID,
};
