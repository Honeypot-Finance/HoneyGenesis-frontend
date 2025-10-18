import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from 'wagmi';
import { NFTStakingABI } from '@/abi/NFTStakingABI';
import { NFT_STAKING_ADDRESS } from './useContractAddresses';
import { DEFAULT_STAKING_CHAIN_ID } from '@/consts';
import { StakeData } from '@/types/staking';

/**
 * Hook to stake an NFT
 */
export function useStake() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stake = (tokenId: bigint) => {
    writeContract({
      address: NFT_STAKING_ADDRESS,
      abi: NFTStakingABI,
      functionName: 'stake',
      args: [tokenId],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  return {
    stake,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to unstake an NFT
 */
export function useUnstake() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const unstake = (tokenId: bigint) => {
    writeContract({
      address: NFT_STAKING_ADDRESS,
      abi: NFTStakingABI,
      functionName: 'unstake',
      args: [tokenId],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  return {
    unstake,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to claim rewards for a staked NFT
 */
export function useClaim() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claim = (tokenId: bigint) => {
    writeContract({
      address: NFT_STAKING_ADDRESS,
      abi: NFTStakingABI,
      functionName: 'claim',
      args: [tokenId],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  return {
    claim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to burn an NFT
 */
export function useBurn() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const burn = (tokenId: bigint) => {
    writeContract({
      address: NFT_STAKING_ADDRESS,
      abi: NFTStakingABI,
      functionName: 'burn',
      args: [tokenId],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  return {
    burn,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to simulate burning an NFT (for logging only)
 */
export function useSimulateBurn(tokenId: bigint | undefined) {
  const { data, error, isLoading } = useSimulateContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'burn',
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId: DEFAULT_STAKING_CHAIN_ID,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  return {
    simulationData: data,
    simulationError: error,
    isSimulating: isLoading,
  };
}

/**
 * Hook to get stake data for a token
 */
export function useStakeData(tokenId: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'stakes',
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId: DEFAULT_STAKING_CHAIN_ID,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  const stakeData: StakeData | undefined = data
    ? {
        owner: data[0],
        stakedAt: data[1],
        lastClaimAt: data[2],
        burned: data[3],
        burnedAt: data[4],
        lastBurnClaimAt: data[5],
      }
    : undefined;

  return {
    stakeData,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to preview pending rewards for a token
 */
export function usePreviewPayout(tokenId: bigint | undefined) {
  const { data: pendingRewards, isLoading, error, refetch } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'previewPayout',
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId: DEFAULT_STAKING_CHAIN_ID,
    query: {
      enabled: tokenId !== undefined,
      refetchInterval: 5000, // Refetch every 5 seconds to show live rewards
    },
  });

  return {
    pendingRewards: pendingRewards as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get staking parameters
 */
export function useStakingParams() {
  const { data: rewardRatePerSecond, refetch: refetchRate } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'rewardRatePerSecond',
    chainId: DEFAULT_STAKING_CHAIN_ID,
  });

  const { data: burnBonusBps, refetch: refetchBonus } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'burnBonusBps',
    chainId: DEFAULT_STAKING_CHAIN_ID,
  });

  return {
    rewardRatePerSecond: rewardRatePerSecond as bigint | undefined,
    burnBonusBps: burnBonusBps as bigint | undefined,
    refetch: () => {
      refetchRate();
      refetchBonus();
    },
  };
}

/**
 * Hook to get contract owner
 */
export function useContractOwner() {
  const { address } = useAccount();
  const { data: owner } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFTStakingABI,
    functionName: 'owner',
    chainId: DEFAULT_STAKING_CHAIN_ID,
  });

  const isOwner = address && owner ? address.toLowerCase() === owner.toLowerCase() : false;

  return {
    owner,
    isOwner,
  };
}

/**
 * Hook to set staking parameters (admin only)
 */
export function useSetParameters() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setParameters = (ratePerSecond: bigint, burnBonusBps: bigint) => {
    writeContract({
      address: NFT_STAKING_ADDRESS,
      abi: NFTStakingABI,
      functionName: 'setParameters',
      args: [ratePerSecond, burnBonusBps],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  return {
    setParameters,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
