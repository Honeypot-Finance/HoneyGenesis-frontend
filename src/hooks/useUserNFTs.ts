import { useAccount } from 'wagmi';
import { useContractAddresses } from './useContractAddresses';
import { useState, useEffect } from 'react';
import { stakingGraphqlClient } from '@/lib/graphql/client';
import { GET_USER_STAKES, GET_USER_WALLET_NFTS, GET_USER_BURNABLE_STAKES, GET_USER_ALL_BURNABLE_NFTS } from '@/lib/graphql/queries';

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
 * @param mode - 'wallet' to get NFTs in wallet (unstaked), 'staked' to get staked NFTs, 'burnable' to get staked non-burned NFTs, 'all-burnable' to get both staked and unstaked burnable NFTs
 */
export function useUserNFTs(mode: 'wallet' | 'staked' | 'burnable' | 'all-burnable' = 'wallet') {
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
      console.log('Subgraph URL:', 'https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/nft-staking-berachain/1.0.0/gn');

      setIsLoading(true);
      setError(null);

      try {
        if (mode === 'all-burnable') {
          // Fetch both staked and unstaked NFTs for burning
          const data = await stakingGraphqlClient.request<{ stakes: SubgraphStake[], nfts: SubgraphNFT[] }>(GET_USER_ALL_BURNABLE_NFTS, {
            owner: address.toLowerCase(),
          });

          console.log(`${mode} subgraph response:`, data);
          console.log('Total stakes found:', data.stakes?.length || 0);
          console.log('Total wallet NFTs found:', data.nfts?.length || 0);

          // Transform staked NFTs (filter out UNSTAKED)
          const stakedTokens: NFTToken[] = (data.stakes || [])
            .filter(stake => stake.status !== 'UNSTAKED')
            .map(stake => ({
              id: stake.id,
              tokenId: stake.tokenId,
              owner: stake.ownerAddress,
              contract: nftAddress || '',
              isStaked: true,
              stakedAt: stake.stakedAt,
              lastClaimAt: stake.lastClaimAt,
              burned: stake.burned,
            }));

          // Transform wallet NFTs (unstaked)
          const walletTokens: NFTToken[] = (data.nfts || [])
            .filter(nft => !nft.isBurned)
            .map(nft => ({
              id: nft.id,
              tokenId: nft.tokenId,
              owner: nft.ownerAddress,
              contract: nft.contract,
              isStaked: false,
              burned: nft.isBurned,
            }));

          // Combine both lists
          const allBurnableNFTs = [...stakedTokens, ...walletTokens];
          console.log(`${mode} NFTs (combined):`, allBurnableNFTs);
          setNfts(allBurnableNFTs);
        } else if (mode === 'staked' || mode === 'burnable') {
          // Fetch staked NFTs from staking subgraph
          // For 'burnable' mode, only get non-burned staked NFTs
          const query = mode === 'burnable' ? GET_USER_BURNABLE_STAKES : GET_USER_STAKES;
          const data = await stakingGraphqlClient.request<{ stakes: SubgraphStake[] }>(query, {
            owner: address.toLowerCase(),
          });

          console.log(`${mode} subgraph response:`, data);
          console.log('Total stakes found:', data.stakes?.length || 0);

          // Filter out unstaked NFTs and transform staking data to NFTToken format
          const stakedTokens: NFTToken[] = (data.stakes || [])
            .filter(stake => stake.status !== 'UNSTAKED') // Only include active stakes
            .map(stake => ({
              id: stake.id,
              tokenId: stake.tokenId,
              owner: stake.ownerAddress,
              contract: nftAddress || '',
              isStaked: true,
              stakedAt: stake.stakedAt,
              lastClaimAt: stake.lastClaimAt,
              burned: stake.burned,
            }));

          console.log(`${mode} NFTs (after filtering):`, stakedTokens);
          setNfts(stakedTokens);
        } else {
          // For wallet mode: Query both nfts and stakes entities
          const data = await stakingGraphqlClient.request<{ nfts: SubgraphNFT[], stakes: SubgraphStake[] }>(GET_USER_WALLET_NFTS, {
            owner: address.toLowerCase(),
          });

          console.log('=== WALLET NFTs DEBUG ===');
          console.log('Wallet NFTs subgraph response:', data);
          console.log('Total NFT entities found:', data.nfts?.length || 0);
          console.log('Total stake entities found:', data.stakes?.length || 0);
          console.log('Raw NFTs data:', JSON.stringify(data.nfts, null, 2));
          console.log('Raw stakes data:', JSON.stringify(data.stakes, null, 2));

          // Combine NFTs from both sources
          const nftMap = new Map<string, NFTToken>();

          // First, add NFTs from the nfts entity (filter unstaked and not burned)
          (data.nfts || []).forEach(nft => {
            if (!nft.isStaked && !nft.isBurned) {
              nftMap.set(nft.tokenId, {
                id: nft.id,
                tokenId: nft.tokenId,
                owner: nft.ownerAddress,
                contract: nft.contract,
                isStaked: false,
                burned: nft.isBurned,
              });
            }
          });

          // Then, add stakes with UNSTAKED status (they override nfts if present)
          (data.stakes || []).forEach(stake => {
            if (stake.status === 'UNSTAKED' && !stake.burned) {
              nftMap.set(stake.tokenId, {
                id: stake.id,
                tokenId: stake.tokenId,
                owner: stake.ownerAddress,
                contract: nftAddress || '',
                isStaked: false,
                burned: stake.burned,
              });
            }
          });

          const walletTokens = Array.from(nftMap.values());
          console.log('Merged wallet NFTs:', walletTokens);
          console.log('=== END DEBUG ===');
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
      if (mode === 'all-burnable') {
        // Fetch both staked and unstaked NFTs for burning
        const data = await stakingGraphqlClient.request<{ stakes: SubgraphStake[], nfts: SubgraphNFT[] }>(GET_USER_ALL_BURNABLE_NFTS, {
          owner: address.toLowerCase(),
        });

        // Transform staked NFTs (filter out UNSTAKED)
        const stakedTokens: NFTToken[] = (data.stakes || [])
          .filter(stake => stake.status !== 'UNSTAKED')
          .map(stake => ({
            id: stake.id,
            tokenId: stake.tokenId,
            owner: stake.ownerAddress,
            contract: nftAddress || '',
            isStaked: true,
            stakedAt: stake.stakedAt,
            lastClaimAt: stake.lastClaimAt,
            burned: stake.burned,
          }));

        // Transform wallet NFTs (unstaked)
        const walletTokens: NFTToken[] = (data.nfts || [])
          .filter(nft => !nft.isBurned)
          .map(nft => ({
            id: nft.id,
            tokenId: nft.tokenId,
            owner: nft.ownerAddress,
            contract: nft.contract,
            isStaked: false,
            burned: nft.isBurned,
          }));

        // Combine both lists
        const allBurnableNFTs = [...stakedTokens, ...walletTokens];
        setNfts(allBurnableNFTs);
      } else if (mode === 'staked' || mode === 'burnable') {
        const query = mode === 'burnable' ? GET_USER_BURNABLE_STAKES : GET_USER_STAKES;
        const data = await stakingGraphqlClient.request<{ stakes: SubgraphStake[] }>(query, {
          owner: address.toLowerCase(),
        });
        // Filter out unstaked NFTs
        const stakedTokens: NFTToken[] = (data.stakes || [])
          .filter(stake => stake.status !== 'UNSTAKED') // Only include active stakes
          .map(stake => ({
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
        const data = await stakingGraphqlClient.request<{ nfts: SubgraphNFT[], stakes: SubgraphStake[] }>(GET_USER_WALLET_NFTS, {
          owner: address.toLowerCase(),
        });
        console.log('=== REFETCH WALLET NFTs DEBUG ===');
        console.log('Refetch wallet NFTs response:', data);
        console.log('Total NFT entities found:', data.nfts?.length || 0);
        console.log('Total stake entities found:', data.stakes?.length || 0);
        console.log('Raw NFTs data:', JSON.stringify(data.nfts, null, 2));
        console.log('Raw stakes data:', JSON.stringify(data.stakes, null, 2));

        // Combine NFTs from both sources
        const nftMap = new Map<string, NFTToken>();

        // First, add NFTs from the nfts entity (filter unstaked and not burned)
        (data.nfts || []).forEach(nft => {
          if (!nft.isStaked && !nft.isBurned) {
            nftMap.set(nft.tokenId, {
              id: nft.id,
              tokenId: nft.tokenId,
              owner: nft.ownerAddress,
              contract: nft.contract,
              isStaked: false,
              burned: nft.isBurned,
            });
          }
        });

        // Then, add stakes with UNSTAKED status (they override nfts if present)
        (data.stakes || []).forEach(stake => {
          if (stake.status === 'UNSTAKED' && !stake.burned) {
            nftMap.set(stake.tokenId, {
              id: stake.id,
              tokenId: stake.tokenId,
              owner: stake.ownerAddress,
              contract: nftAddress || '',
              isStaked: false,
              burned: stake.burned,
            });
          }
        });

        const walletTokens = Array.from(nftMap.values());
        console.log('Merged wallet NFTs:', walletTokens);
        console.log('=== END REFETCH DEBUG ===');
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
