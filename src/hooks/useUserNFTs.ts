import { useAccount } from 'wagmi';
import { useContractAddresses } from './useContractAddresses';
import { useState, useEffect } from 'react';
import { stakingGraphqlClient } from '@/lib/graphql/client';
import { GET_USER_STAKES, GET_USER_WALLET_NFTS, GET_USER_BURNABLE_STAKES } from '@/lib/graphql/queries';

export interface NFTToken {
  id: string;
  tokenId: string;
  owner: string;
  contract: string;
  isStaked?: boolean;
  stakedAt?: string;
  lastClaimAt?: string;
  burned?: boolean;
}

interface SubgraphNFT {
  id: string;
  contract: string;
  tokenId: string;
  ownerAddress: string;
  isStaked: boolean;
  isBurned: boolean;
}

interface SubgraphStake {
  id: string;
  tokenId: string;
  ownerAddress: string;
  stakedAt: string;
  lastClaimAt: string;
  burned: boolean;
  burnedAt?: string;
  lastBurnClaimAt?: string;
  status: string;
  totalRewardsClaimed: string;
  totalBurnRewardsClaimed: string;
}

/**
 * Hook to fetch user's NFTs dynamically from the subgraph
 * @param mode - 'wallet' to get NFTs in wallet (unstaked), 'staked' to get staked NFTs, 'burnable' to get staked non-burned NFTs
 */
export function useUserNFTs(mode: 'wallet' | 'staked' | 'burnable' = 'wallet') {
  const { address } = useAccount();
  const { nftAddress } = useContractAddresses();
  const [nfts, setNfts] = useState<NFTToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchNFTs() {
      if (!address) {
        console.log('Missing address:', { address });
        setNfts([]);
        return;
      }

      console.log(`Fetching ${mode} NFTs from subgraph...`);
      console.log('User address:', address);
      console.log('NFT contract:', nftAddress);

      setIsLoading(true);
      setError(null);

      try {
        if (mode === 'staked' || mode === 'burnable') {
          // Fetch staked NFTs from staking subgraph
          // For 'burnable' mode, only get non-burned staked NFTs
          const query = mode === 'burnable' ? GET_USER_BURNABLE_STAKES : GET_USER_STAKES;
          const data = await stakingGraphqlClient.request<{ stakes: SubgraphStake[] }>(query, {
            owner: address.toLowerCase(),
          });

          console.log(`${mode} subgraph response:`, data);
          console.log('Total stakes found:', data.stakes?.length || 0);

          // Transform staking data to NFTToken format
          const stakedTokens: NFTToken[] = (data.stakes || []).map(stake => ({
            id: stake.id,
            tokenId: stake.tokenId,
            owner: stake.ownerAddress,
            contract: nftAddress || '',
            isStaked: true,
            stakedAt: stake.stakedAt,
            lastClaimAt: stake.lastClaimAt,
            burned: stake.burned,
          }));

          console.log(`${mode} NFTs:`, stakedTokens);
          setNfts(stakedTokens);
        } else {
          // For wallet mode: Query NFTs directly from the subgraph
          // The subgraph now tracks all NFT holders with isStaked flag
          const data = await stakingGraphqlClient.request<{ nfts: SubgraphNFT[] }>(GET_USER_WALLET_NFTS, {
            owner: address.toLowerCase(),
          });

          console.log('Wallet NFTs subgraph response:', data);
          console.log('Total wallet NFTs found:', data.nfts?.length || 0);

          // Transform NFT data to our NFTToken format
          const walletTokens: NFTToken[] = (data.nfts || []).map(nft => ({
            id: nft.id,
            tokenId: nft.tokenId,
            owner: nft.ownerAddress,
            contract: nft.contract,
            isStaked: false,
            burned: nft.isBurned,
          }));

          console.log('Wallet NFTs:', walletTokens);
          setNfts(walletTokens);
        }
      } catch (err) {
        console.error(`Error fetching ${mode} NFTs from subgraph:`, err);
        setError(err as Error);
        setNfts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNFTs();
  }, [address, nftAddress, mode]);

  const refetch = async () => {
    if (!address) return;

    console.log(`Refetching ${mode} NFTs...`);
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'staked' || mode === 'burnable') {
        const query = mode === 'burnable' ? GET_USER_BURNABLE_STAKES : GET_USER_STAKES;
        const data = await stakingGraphqlClient.request<{ stakes: SubgraphStake[] }>(query, {
          owner: address.toLowerCase(),
        });
        const stakedTokens: NFTToken[] = (data.stakes || []).map(stake => ({
          id: stake.id,
          tokenId: stake.tokenId,
          owner: stake.ownerAddress,
          contract: nftAddress || '',
          isStaked: true,
          stakedAt: stake.stakedAt,
          lastClaimAt: stake.lastClaimAt,
          burned: stake.burned,
        }));
        setNfts(stakedTokens);
      } else {
        const data = await stakingGraphqlClient.request<{ nfts: SubgraphNFT[] }>(GET_USER_WALLET_NFTS, {
          owner: address.toLowerCase(),
        });
        const walletTokens: NFTToken[] = (data.nfts || []).map(nft => ({
          id: nft.id,
          tokenId: nft.tokenId,
          owner: nft.ownerAddress,
          contract: nft.contract,
          isStaked: false,
          burned: nft.isBurned,
        }));
        setNfts(walletTokens);
      }
    } catch (err) {
      console.error(`Error refetching ${mode} NFTs:`, err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nfts,
    isLoading,
    error,
    hasNFTs: nfts.length > 0,
    refetch,
  };
}
