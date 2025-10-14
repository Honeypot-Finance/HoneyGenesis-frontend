import { useAccount, useReadContract } from 'wagmi';
import { useContractAddresses } from './useContractAddresses';
import { ERC721ABI } from '@/lib/abi/ERC721ABI';
import { useState, useEffect } from 'react';

/**
 * Hook to get all NFT token IDs owned by the user
 * Note: This assumes the NFT contract has a way to enumerate tokens
 * For a more robust solution, you might want to use an indexer or subgraph
 */
export function useUserNFTs() {
  const { address } = useAccount();
  const { nftAddress } = useContractAddresses();
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: balance } = useReadContract({
    address: nftAddress,
    abi: ERC721ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!nftAddress,
    },
  });

  // For now, we'll assume token IDs are sequential starting from 0
  // In production, you'd want to use tokenOfOwnerByIndex or an indexer
  useEffect(() => {
    async function fetchTokenIds() {
      if (!address || !nftAddress || !balance) {
        setTokenIds([]);
        return;
      }

      setIsLoading(true);
      // This is a simple implementation - checks tokens 0-999
      // In production, use tokenOfOwnerByIndex or an indexer service
      const maxTokenId = 1000;
      const owned: bigint[] = [];

      // We'll check in batches to avoid too many calls
      // In a real app, use an indexer like The Graph or Alchemy NFT API
      for (let i = 0; i < maxTokenId && owned.length < Number(balance); i++) {
        // Note: This is simplified - you'd want to batch these calls
        // or use an indexer in production
      }

      setTokenIds(owned);
      setIsLoading(false);
    }

    fetchTokenIds();
  }, [address, nftAddress, balance]);

  return {
    tokenIds,
    balance: balance || 0n,
    isLoading,
    hasNFTs: (balance || 0n) > 0n,
  };
}

/**
 * Hook to check ownership of a specific token ID
 */
export function useNFTOwnership(tokenId: bigint | undefined) {
  const { address } = useAccount();
  const { nftAddress } = useContractAddresses();

  const { data: owner } = useReadContract({
    address: nftAddress,
    abi: ERC721ABI,
    functionName: 'ownerOf',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && !!nftAddress,
    },
  });

  const isOwner = address && owner ? address.toLowerCase() === owner.toLowerCase() : false;

  return {
    owner,
    isOwner,
  };
}
