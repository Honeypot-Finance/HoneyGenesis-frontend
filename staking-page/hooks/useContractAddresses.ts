import { useReadContract } from 'wagmi';
import { NFT_STAKING_ADDRESS, NFT_STAKING_ABI } from '@/config/contracts';
import { Address } from 'viem';

/**
 * Hook to fetch NFT and RewardsToken addresses from the staking contract
 * This eliminates the need to configure these addresses separately
 */
export function useContractAddresses() {
  const { data: nftAddress } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFT_STAKING_ABI,
    functionName: 'nft',
  });

  const { data: rewardsAddress } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFT_STAKING_ABI,
    functionName: 'rewards',
  });

  return {
    nftAddress: (nftAddress as Address) || '0x1164f0dFa6ECb206C3F581ED42d6423b1BaD06e3' as Address,
    rewardsAddress: (rewardsAddress as Address) || '0x168138899298A265c93930B4E972c5cFca04feC3' as Address,
    stakingAddress: NFT_STAKING_ADDRESS,
  };
}
