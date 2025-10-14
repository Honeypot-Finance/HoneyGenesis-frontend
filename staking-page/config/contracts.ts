import { Address } from "viem";
import { NFTStakingABI } from "@/lib/abi/NFTStakingABI";
import { ERC721ABI } from "@/lib/abi/ERC721ABI";
import { ERC20ABI } from "@/lib/abi/ERC20ABI";

// Re-export ABIs for convenience
export { NFTStakingABI as NFT_STAKING_ABI };
export { ERC721ABI as ERC721_ABI };
export { ERC20ABI as ERC20_ABI };

// Chain IDs
export const BERACHAIN_TESTNET = 80069; // Berachain Bepolia
export const BERACHAIN_MAINNET = 80094; // Berachain Mainnet (when launched)

// Contract addresses per chain
export const CONTRACT_ADDRESSES = {
  [BERACHAIN_TESTNET]: {
    NFTStaking: "0xF4efb3C1CaC5Ed0a8D9518140dC443401858b016" as Address,
    // NFT and RewardsToken addresses are fetched dynamically from NFTStaking contract
  },
  [BERACHAIN_MAINNET]: {
    NFTStaking: "0x0000000000000000000000000000000000000000" as Address, // Update when deployed
    // NFT and RewardsToken addresses are fetched dynamically from NFTStaking contract
  },
} as const;

// Default chain (Berachain Testnet)
export const DEFAULT_CHAIN_ID = BERACHAIN_TESTNET;

/**
 * Get NFT Staking contract address for a specific chain
 */
export function getNFTStakingAddress(
  chainId: number = DEFAULT_CHAIN_ID
): Address {
  const addresses =
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return addresses.NFTStaking;
}

/**
 * Check if a chain is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return chainId in CONTRACT_ADDRESSES;
}

// Export current chain's staking address for backward compatibility
export const NFT_STAKING_ADDRESS = getNFTStakingAddress(DEFAULT_CHAIN_ID);
export const CHAIN_ID = DEFAULT_CHAIN_ID;

// Legacy CONTRACTS object for backward compatibility
export const CONTRACTS = {
  NFTStaking: {
    address: NFT_STAKING_ADDRESS,
    chainId: CHAIN_ID,
  },
  RewardsToken: {
    address: "0x0" as Address, // Fetched from NFTStaking.rewards()
    chainId: CHAIN_ID,
  },
  NFT: {
    address: "0x0" as Address, // Fetched from NFTStaking.nft()
    chainId: CHAIN_ID,
  },
} as const;
