import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSimulateContract, usePublicClient } from 'wagmi';
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
 * Hook to batch stake multiple NFTs
 * NOTE: Due to a bug in the smart contract, batchStakeFor is missing the "msg.sender == owner" check
 * that batchUnstakeFor has. We need to call individual stake() for each NFT sequentially.
 */
export function useBatchStake() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [currentStakeIndex, setCurrentStakeIndex] = useState<number>(-1);
  const [totalToStake, setTotalToStake] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [allHashes, setAllHashes] = useState<`0x${string}`[]>([]);

  const batchStake = async (tokenIds: bigint[]) => {
    if (!address) {
      console.error('Cannot batch stake: No address connected');
      return;
    }

    if (tokenIds.length === 0) {
      console.error('Cannot batch stake: No token IDs provided');
      return;
    }

    console.log('=== SEQUENTIAL STAKE CALLS ===');
    console.log(`Staking ${tokenIds.length} NFTs using individual stake() calls`);
    console.log('Token IDs:', tokenIds);
    console.log('Contract:', NFT_STAKING_ADDRESS);
    console.log('Chain ID:', DEFAULT_STAKING_CHAIN_ID);
    console.log('');
    console.log('NOTE: Using sequential stake() calls because batchStakeFor has a bug:');
    console.log('  - batchStakeFor is missing "msg.sender == owner" check');
    console.log('  - batchUnstakeFor HAS this check (line 460)');
    console.log('  - This is why unstake works but stake fails with NOT_AUTHORIZED');

    setIsPending(true);
    setIsConfirming(false);
    setIsSuccess(false);
    setError(null);
    setTotalToStake(tokenIds.length);
    setAllHashes([]);

    const hashes: `0x${string}`[] = [];

    try {
      // Stake each NFT sequentially
      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i];
        setCurrentStakeIndex(i);

        console.log(`\n[${i + 1}/${tokenIds.length}] Staking token ${tokenId}...`);

        const hash = await writeContractAsync({
          address: NFT_STAKING_ADDRESS,
          abi: NFTStakingABI,
          functionName: 'stake',
          args: [tokenId],
          chainId: DEFAULT_STAKING_CHAIN_ID,
        });

        console.log(`  ✓ Transaction submitted: ${hash}`);
        hashes.push(hash);
        setAllHashes([...hashes]);
      }

      console.log('\n=== ALL STAKES COMPLETED ===');
      console.log(`Successfully staked ${tokenIds.length} NFTs`);
      console.log('Transaction hashes:', hashes);

      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(true);
      setCurrentStakeIndex(-1);
    } catch (err) {
      console.error('\n=== BATCH STAKE ERROR ===');
      console.error(`Failed at NFT ${currentStakeIndex + 1}/${tokenIds.length}`);
      console.error('Error:', err);
      console.error('=== END ERROR ===');

      setError(err as Error);
      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(false);
      setCurrentStakeIndex(-1);
    }
  };

  return {
    batchStake,
    hash: allHashes.length > 0 ? allHashes[allHashes.length - 1] : undefined,
    allHashes,
    currentStakeIndex,
    totalToStake,
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
 * Hook to batch unstake multiple NFTs
 */
export function useBatchUnstake() {
  const { address } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const batchUnstake = (tokenIds: bigint[]) => {
    if (!address) return;

    writeContract({
      address: NFT_STAKING_ADDRESS,
      abi: NFTStakingABI,
      functionName: 'batchUnstakeFor',
      args: [address, tokenIds],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  return {
    batchUnstake,
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
 * Hook to preview pending rewards for multiple tokens
 * Uses manual fetching to avoid Rules of Hooks violations
 */
export function useMultiPreviewPayout(tokenIds: bigint[]) {
  const [rewardsMap, setRewardsMap] = useState<Map<string, bigint>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient({ chainId: DEFAULT_STAKING_CHAIN_ID });

  useEffect(() => {
    if (tokenIds.length === 0) {
      setRewardsMap(new Map());
      return;
    }

    if (!publicClient) {
      return;
    }

    const fetchRewards = async () => {
      setIsLoading(true);
      const newRewardsMap = new Map<string, bigint>();

      // Fetch rewards for each token using viem's readContract
      for (const tokenId of tokenIds) {
        try {
          const pendingRewards = await publicClient.readContract({
            address: NFT_STAKING_ADDRESS as `0x${string}`,
            abi: NFTStakingABI,
            functionName: 'previewPayout',
            args: [tokenId],
          });
          newRewardsMap.set(tokenId.toString(), pendingRewards as bigint);
        } catch (error) {
          console.error(`Error fetching rewards for token ${tokenId}:`, error);
          newRewardsMap.set(tokenId.toString(), 0n);
        }
      }

      setRewardsMap(newRewardsMap);
      setIsLoading(false);
    };

    fetchRewards();

    // Set up interval for live updates
    const intervalId = setInterval(fetchRewards, 5000);
    return () => clearInterval(intervalId);
  }, [tokenIds.join(','), publicClient]); // Use join to create stable dependency

  const totalPendingRewards = Array.from(rewardsMap.values()).reduce(
    (acc, rewards) => acc + rewards,
    0n
  );

  return {
    rewardsMap,
    totalPendingRewards,
    isLoading,
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
