import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { encodeFunctionData } from "viem";
import { NFTStakingABI } from "@/abi/NFTStakingABI";
import { Multicall3ABI } from "@/abi/Multicall3ABI";
import { NFT_STAKING_ADDRESS } from "./useContractAddresses";
import { MULTICALL3_ADDRESS } from "@/consts";

/**
 * Hook for multi-claiming rewards using Multicall3
 * This works because claim() doesn't require NFT transfers,
 * only reads stake data and transfers reward tokens
 */
export function useMultiClaim() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const multiClaim = (tokenIds: bigint[]) => {
    // Create a claim call for each token ID
    const calls = tokenIds.map((tokenId) => ({
      target: NFT_STAKING_ADDRESS,
      allowFailure: false,
      callData: encodeFunctionData({
        abi: NFTStakingABI,
        functionName: "claim",
        args: [tokenId],
      }),
    }));

    // Execute multicall3
    writeContract({
      address: MULTICALL3_ADDRESS,
      abi: Multicall3ABI,
      functionName: "aggregate3",
      args: [calls],
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  };

  return {
    multiClaim,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
