import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ERC721ABI } from '@/abi/ERC721ABI';
import { NFT_STAKING_ADDRESS, useContractAddresses } from './useContractAddresses';
import { Address } from 'viem';

/**
 * Hook to check if NFT is approved for staking contract
 */
export function useIsApproved(tokenId: bigint | undefined) {
  const { nftAddress } = useContractAddresses();
  const { address: userAddress } = useAccount();

  const { data: approvedAddress, refetch: refetchApproved } = useReadContract({
    address: nftAddress,
    abi: ERC721ABI,
    functionName: 'getApproved',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && !!nftAddress,
      refetchInterval: 2000, // Refetch every 2 seconds
    },
  });

  const { data: isApprovedForAll, refetch: refetchApprovedForAll } = useReadContract({
    address: nftAddress,
    abi: ERC721ABI,
    functionName: 'isApprovedForAll',
    args: userAddress ? [userAddress, NFT_STAKING_ADDRESS] : undefined,
    query: {
      enabled: !!userAddress && !!nftAddress,
      refetchInterval: 2000, // Refetch every 2 seconds
    },
  });

  const isApproved =
    isApprovedForAll ||
    (approvedAddress &&
      approvedAddress.toLowerCase() === NFT_STAKING_ADDRESS.toLowerCase());

  return {
    isApproved,
    approvedAddress,
    isApprovedForAll,
    refetch: () => {
      refetchApproved();
      refetchApprovedForAll();
    },
  };
}

/**
 * Hook to approve NFT for staking
 */
export function useApprove() {
  const { nftAddress } = useContractAddresses();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (tokenId: bigint) => {
    writeContract({
      address: nftAddress,
      abi: ERC721ABI,
      functionName: 'approve',
      args: [NFT_STAKING_ADDRESS, tokenId],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to set approval for all NFTs
 */
export function useSetApprovalForAll() {
  const { nftAddress } = useContractAddresses();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setApprovalForAll = (approved: boolean) => {
    writeContract({
      address: nftAddress,
      abi: ERC721ABI,
      functionName: 'setApprovalForAll',
      args: [NFT_STAKING_ADDRESS, approved],
    });
  };

  return {
    setApprovalForAll,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to get NFT owner
 */
export function useNFTOwner(tokenId: bigint | undefined) {
  const { nftAddress } = useContractAddresses();
  const { data: owner, isLoading, error, refetch } = useReadContract({
    address: nftAddress,
    abi: ERC721ABI,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && !!nftAddress,
    },
  });

  return {
    owner: owner as Address | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to get NFT balance of an address
 */
export function useNFTBalance(address: Address | undefined) {
  const { nftAddress } = useContractAddresses();
  const { data: balance, isLoading, error, refetch } = useReadContract({
    address: nftAddress,
    abi: ERC721ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!nftAddress,
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
 * Hook to get NFT token URI
 */
export function useTokenURI(tokenId: bigint | undefined) {
  const { nftAddress } = useContractAddresses();
  const { data: tokenURI, isLoading, error, refetch } = useReadContract({
    address: nftAddress,
    abi: ERC721ABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && !!nftAddress,
    },
  });

  return {
    tokenURI: tokenURI as string | undefined,
    isLoading,
    error,
    refetch,
  };
}
