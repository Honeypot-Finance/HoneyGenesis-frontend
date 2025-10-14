import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '@/config/contracts';
import { useContractAddresses } from './useContractAddresses';
import { Address } from 'viem';

/**
 * Hook to get rewards token balance
 */
export function useRewardsBalance(address: Address | undefined) {
  const { rewardsAddress } = useContractAddresses();
  const { data: balance, isLoading, error, refetch } = useReadContract({
    address: rewardsAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!rewardsAddress,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  return {
    balance: balance as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get rewards token info
 */
export function useRewardsTokenInfo() {
  const { rewardsAddress } = useContractAddresses();

  const { data: symbol } = useReadContract({
    address: rewardsAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!rewardsAddress,
    },
  });

  const { data: name } = useReadContract({
    address: rewardsAddress,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: !!rewardsAddress,
    },
  });

  const { data: decimals } = useReadContract({
    address: rewardsAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!rewardsAddress,
    },
  });

  return {
    symbol: symbol as string | undefined,
    name: name as string | undefined,
    decimals: decimals as number | undefined,
  };
}
