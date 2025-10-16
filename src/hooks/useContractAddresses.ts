import { useReadContract } from "wagmi";
import { NFTStakingABI } from "@/abi/NFTStakingABI";
import {
  stakingContractAddresses,
  nftContractProxy,
  rewardsTokenAddress,
  DEFAULT_STAKING_CHAIN_ID,
} from "@/consts";
import { Address } from "viem";

const NFT_STAKING_ADDRESS = stakingContractAddresses[DEFAULT_STAKING_CHAIN_ID];
const NFT_CONTRACT_PROXY = nftContractProxy[DEFAULT_STAKING_CHAIN_ID];
const REWARDS_TOKEN_ADDRESS = rewardsTokenAddress[DEFAULT_STAKING_CHAIN_ID];

/**
 * Hook to fetch NFT and RewardsToken addresses from the staking contract
 * This eliminates the need to configure these addresses separately
 */
export function useContractAddresses() {
  const { data: nftAddress } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: "nft",
  });

  const { data: rewardsAddress } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: "rewards",
  });

  return {
    nftAddress: (nftAddress as Address) || NFT_CONTRACT_PROXY,
    rewardsAddress: (rewardsAddress as Address) || REWARDS_TOKEN_ADDRESS,
    stakingAddress: NFT_STAKING_ADDRESS,
  };
}

export { NFT_STAKING_ADDRESS };
