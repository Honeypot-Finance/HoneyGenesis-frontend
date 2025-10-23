import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSimulateContract, usePublicClient } from 'wagmi';
import { NFTStakingABI } from '@/abi/NFTStakingABI';
import { NFT_STAKING_ADDRESS } from './useContractAddresses';
import { DEFAULT_STAKING_CHAIN_ID } from '@/consts';
import { StakeData } from '@/types/staking';

// Maximum number of operations per batch (contract limit)
const BATCH_SIZE = 100;

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
 * Hook to batch stake multiple NFTs using multiCall
 * Supports up to 50 NFTs per transaction
 */
export function useBatchStake() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [currentBatch, setCurrentBatch] = useState<number>(0);
  const [totalBatches, setTotalBatches] = useState<number>(0);
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

    console.log('=== MULTICALL BATCH STAKE ===');
    console.log(`Staking ${tokenIds.length} NFTs using multiCall`);
    console.log('Token IDs:', tokenIds);
    console.log('Contract:', NFT_STAKING_ADDRESS);
    console.log('Chain ID:', DEFAULT_STAKING_CHAIN_ID);

    setIsPending(true);
    setIsConfirming(false);
    setIsSuccess(false);
    setError(null);
    setAllHashes([]);

    // Split into batches of BATCH_SIZE
    const batches: bigint[][] = [];
    for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
      batches.push(tokenIds.slice(i, i + BATCH_SIZE));
    }

    setTotalBatches(batches.length);
    console.log(`Split into ${batches.length} batch(es) of max ${BATCH_SIZE} each`);

    const hashes: `0x${string}`[] = [];

    try {
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        setCurrentBatch(batchIndex + 1);

        console.log(`\n[Batch ${batchIndex + 1}/${batches.length}] Staking ${batch.length} NFTs...`);

        // Use batchStake with msg.sender as recipient for rewards
        const hash = await writeContractAsync({
          address: NFT_STAKING_ADDRESS,
          abi: NFTStakingABI,
          functionName: 'batchStake',
          args: [batch, address],
          chainId: DEFAULT_STAKING_CHAIN_ID,
        });

        console.log(`  ✓ Batch transaction submitted: ${hash}`);
        hashes.push(hash);
        setAllHashes([...hashes]);
      }

      console.log('\n=== ALL BATCHES COMPLETED ===');
      console.log(`Successfully staked ${tokenIds.length} NFTs in ${batches.length} batch(es)`);
      console.log('Transaction hashes:', hashes);

      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(true);
      setCurrentBatch(0);
    } catch (err) {
      console.error('\n=== BATCH STAKE ERROR ===');
      console.error(`Failed at batch ${currentBatch}/${totalBatches}`);
      console.error('Error:', err);
      console.error('=== END ERROR ===');

      setError(err as Error);
      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(false);
      setCurrentBatch(0);
    }
  };

  return {
    batchStake,
    hash: allHashes.length > 0 ? allHashes[allHashes.length - 1] : undefined,
    allHashes,
    currentBatch,
    totalBatches,
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
 * Supports up to 100 NFTs per transaction
 */
export function useBatchUnstake() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [currentBatch, setCurrentBatch] = useState<number>(0);
  const [totalBatches, setTotalBatches] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [allHashes, setAllHashes] = useState<`0x${string}`[]>([]);

  const batchUnstake = async (tokenIds: bigint[]) => {
    if (!address) {
      console.error('Cannot batch unstake: No address connected');
      return;
    }

    if (tokenIds.length === 0) {
      console.error('Cannot batch unstake: No token IDs provided');
      return;
    }

    console.log('=== BATCH UNSTAKE ===');
    console.log(`Unstaking ${tokenIds.length} NFTs using batchUnstake`);
    console.log('Token IDs:', tokenIds);
    console.log('Contract:', NFT_STAKING_ADDRESS);
    console.log('Chain ID:', DEFAULT_STAKING_CHAIN_ID);

    setIsPending(true);
    setIsConfirming(false);
    setIsSuccess(false);
    setError(null);
    setAllHashes([]);

    // Split into batches of BATCH_SIZE
    const batches: bigint[][] = [];
    for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
      batches.push(tokenIds.slice(i, i + BATCH_SIZE));
    }

    setTotalBatches(batches.length);
    console.log(`Split into ${batches.length} batch(es) of max ${BATCH_SIZE} each`);

    const hashes: `0x${string}`[] = [];

    try {
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        setCurrentBatch(batchIndex + 1);

        console.log(`\n[Batch ${batchIndex + 1}/${batches.length}] Unstaking ${batch.length} NFTs...`);

        // Use batchUnstake with msg.sender as token receiver
        const hash = await writeContractAsync({
          address: NFT_STAKING_ADDRESS,
          abi: NFTStakingABI,
          functionName: 'batchUnstake',
          args: [batch, address],
          chainId: DEFAULT_STAKING_CHAIN_ID,
        });

        console.log(`  ✓ Batch transaction submitted: ${hash}`);
        hashes.push(hash);
        setAllHashes([...hashes]);
      }

      console.log('\n=== ALL BATCHES COMPLETED ===');
      console.log(`Successfully unstaked ${tokenIds.length} NFTs in ${batches.length} batch(es)`);
      console.log('Transaction hashes:', hashes);

      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(true);
      setCurrentBatch(0);
    } catch (err) {
      console.error('\n=== BATCH UNSTAKE ERROR ===');
      console.error(`Failed at batch ${currentBatch}/${totalBatches}`);
      console.error('Error:', err);
      console.error('=== END ERROR ===');

      setError(err as Error);
      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(false);
      setCurrentBatch(0);
    }
  };

  return {
    batchUnstake,
    hash: allHashes.length > 0 ? allHashes[allHashes.length - 1] : undefined,
    allHashes,
    currentBatch,
    totalBatches,
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
 * Hook to batch claim rewards for multiple NFTs
 * Supports up to 100 NFTs per transaction
 */
export function useBatchClaim() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [currentBatch, setCurrentBatch] = useState<number>(0);
  const [totalBatches, setTotalBatches] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [allHashes, setAllHashes] = useState<`0x${string}`[]>([]);

  const batchClaim = async (tokenIds: bigint[]) => {
    if (!address) {
      console.error('Cannot batch claim: No address connected');
      return;
    }

    if (tokenIds.length === 0) {
      console.error('Cannot batch claim: No token IDs provided');
      return;
    }

    console.log('=== BATCH CLAIM ===');
    console.log(`Claiming rewards for ${tokenIds.length} NFTs using batchClaim`);
    console.log('Token IDs:', tokenIds);
    console.log('Contract:', NFT_STAKING_ADDRESS);
    console.log('Chain ID:', DEFAULT_STAKING_CHAIN_ID);

    setIsPending(true);
    setIsConfirming(false);
    setIsSuccess(false);
    setError(null);
    setAllHashes([]);

    // Split into batches of BATCH_SIZE
    const batches: bigint[][] = [];
    for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
      batches.push(tokenIds.slice(i, i + BATCH_SIZE));
    }

    setTotalBatches(batches.length);
    console.log(`Split into ${batches.length} batch(es) of max ${BATCH_SIZE} each`);

    const hashes: `0x${string}`[] = [];

    try {
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        setCurrentBatch(batchIndex + 1);

        console.log(`\n[Batch ${batchIndex + 1}/${batches.length}] Claiming ${batch.length} NFTs...`);

        // Use batchClaim with array of token IDs
        const hash = await writeContractAsync({
          address: NFT_STAKING_ADDRESS,
          abi: NFTStakingABI,
          functionName: 'batchClaim',
          args: [batch],
          chainId: DEFAULT_STAKING_CHAIN_ID,
        });

        console.log(`  ✓ Batch transaction submitted: ${hash}`);
        hashes.push(hash);
        setAllHashes([...hashes]);
      }

      console.log('\n=== ALL BATCHES COMPLETED ===');
      console.log(`Successfully claimed rewards for ${tokenIds.length} NFTs in ${batches.length} batch(es)`);
      console.log('Transaction hashes:', hashes);

      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(true);
      setCurrentBatch(0);
    } catch (err) {
      console.error('\n=== BATCH CLAIM ERROR ===');
      console.error(`Failed at batch ${currentBatch}/${totalBatches}`);
      console.error('Error:', err);
      console.error('=== END ERROR ===');

      setError(err as Error);
      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(false);
      setCurrentBatch(0);
    }
  };

  return {
    batchClaim,
    hash: allHashes.length > 0 ? allHashes[allHashes.length - 1] : undefined,
    allHashes,
    currentBatch,
    totalBatches,
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
 * Hook to batch burn multiple NFTs
 * Supports up to 100 NFTs per transaction
 */
export function useBatchBurn() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [currentBatch, setCurrentBatch] = useState<number>(0);
  const [totalBatches, setTotalBatches] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [allHashes, setAllHashes] = useState<`0x${string}`[]>([]);

  const batchBurn = async (tokenIds: bigint[]) => {
    if (!address) {
      console.error('Cannot batch burn: No address connected');
      return;
    }

    if (tokenIds.length === 0) {
      console.error('Cannot batch burn: No token IDs provided');
      return;
    }

    console.log('=== BATCH BURN ===');
    console.log(`Burning ${tokenIds.length} NFTs using batchBurn`);
    console.log('Token IDs:', tokenIds);
    console.log('Contract:', NFT_STAKING_ADDRESS);
    console.log('Chain ID:', DEFAULT_STAKING_CHAIN_ID);

    setIsPending(true);
    setIsConfirming(false);
    setIsSuccess(false);
    setError(null);
    setAllHashes([]);

    // Split into batches of BATCH_SIZE
    const batches: bigint[][] = [];
    for (let i = 0; i < tokenIds.length; i += BATCH_SIZE) {
      batches.push(tokenIds.slice(i, i + BATCH_SIZE));
    }

    setTotalBatches(batches.length);
    console.log(`Split into ${batches.length} batch(es) of max ${BATCH_SIZE} each`);

    const hashes: `0x${string}`[] = [];

    try {
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        setCurrentBatch(batchIndex + 1);

        console.log(`\n[Batch ${batchIndex + 1}/${batches.length}] Burning ${batch.length} NFTs...`);

        // Use batchBurn with msg.sender as recipient for rewards
        const hash = await writeContractAsync({
          address: NFT_STAKING_ADDRESS,
          abi: NFTStakingABI,
          functionName: 'batchBurn',
          args: [batch, address],
          chainId: DEFAULT_STAKING_CHAIN_ID,
        });

        console.log(`  ✓ Batch transaction submitted: ${hash}`);
        hashes.push(hash);
        setAllHashes([...hashes]);
      }

      console.log('\n=== ALL BATCHES COMPLETED ===');
      console.log(`Successfully burned ${tokenIds.length} NFTs in ${batches.length} batch(es)`);
      console.log('Transaction hashes:', hashes);

      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(true);
      setCurrentBatch(0);
    } catch (err) {
      console.error('\n=== BATCH BURN ERROR ===');
      console.error(`Failed at batch ${currentBatch}/${totalBatches}`);
      console.error('Error:', err);
      console.error('=== END ERROR ===');

      setError(err as Error);
      setIsPending(false);
      setIsConfirming(false);
      setIsSuccess(false);
      setCurrentBatch(0);
    }
  };

  return {
    batchBurn,
    hash: allHashes.length > 0 ? allHashes[allHashes.length - 1] : undefined,
    allHashes,
    currentBatch,
    totalBatches,
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const publicClient = usePublicClient({ chainId: DEFAULT_STAKING_CHAIN_ID });

  useEffect(() => {
    if (tokenIds.length === 0) {
      setRewardsMap(new Map());
      setIsLoading(false);
      setIsInitialLoad(false);
      return;
    }

    if (!publicClient) {
      return;
    }

    const fetchRewards = async (isInitial = false) => {
      // Only show loading on initial fetch, not on refetches
      if (isInitial) {
        setIsLoading(true);
      }
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
      if (isInitial) {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchRewards(isInitialLoad);

    // Set up interval for live updates (without showing loading state)
    const intervalId = setInterval(() => fetchRewards(false), 5000);
    return () => clearInterval(intervalId);
  }, [tokenIds.join(','), publicClient, isInitialLoad]); // Use join to create stable dependency

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
