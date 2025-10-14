import { useReadContract } from 'wagmi';
import { NFTStakingABI } from '@/abi/NFTStakingABI';
import { stakingContractAddresses, DEFAULT_STAKING_CHAIN_ID } from '@/consts';
import { Address } from 'viem';

const NFT_STAKING_ADDRESS = stakingContractAddresses[DEFAULT_STAKING_CHAIN_ID];

/**
 * Hook to fetch NFT and RewardsToken addresses from the staking contract
 * This eliminates the need to configure these addresses separately
 */
export function useContractAddresses() {
  const { data: nftAddress } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'nft',
  });

  const { data: rewardsAddress } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'rewards',
  });

  return {
    nftAddress: (nftAddress as Address) || '0x1164f0dFa6ECb206C3F581ED42d6423b1BaD06e3' as Address,
    rewardsAddress: (rewardsAddress as Address) || '0x168138899298A265c93930B4E972c5cFca04feC3' as Address,
    stakingAddress: NFT_STAKING_ADDRESS,
  };
}

export { NFT_STAKING_ADDRESS };
