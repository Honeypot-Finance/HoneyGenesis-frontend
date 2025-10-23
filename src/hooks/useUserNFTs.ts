import { useAccount } from "wagmi";
import { useContractAddresses } from "./useContractAddresses";
import { useState, useEffect } from "react";
import { stakingGraphqlClient, nftGraphqlClient } from "@/lib/graphql/client";
import {
  GET_USER_STAKES,
  GET_USER_NFTS_FROM_NFT_SUBGRAPH,
  GET_USER_STAKES_FROM_STAKING_SUBGRAPH,
  GET_USER_BURNABLE_STAKES,
  GET_USER_BURNABLE_STAKES_FROM_STAKING,
  GET_USER_BURNABLE_NFTS_FROM_NFT,
  GET_USER_STAKES_FOR_CLAIMING,
  GET_USER_BURNED_NFTS_FROM_NFT,
} from "@/lib/graphql/queries";

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
  owner: {
    id: string;
  };
  stakedAt: string;
  lastClaimAt: string;
  burned: boolean;
  burnedAt?: string;
  lastBurnClaimAt?: string;
  status: string;
}

/**
 * Hook to fetch user's NFTs dynamically from the subgraph
 * @param mode - 'wallet' to get NFTs in wallet (unstaked), 'staked' to get staked NFTs, 'burnable' to get staked non-burned NFTs, 'all-burnable' to get both staked and unstaked burnable NFTs, 'claimable' to get all NFTs that can claim rewards (staked + burned)
 */
export function useUserNFTs(
  mode:
    | "wallet"
    | "staked"
    | "burnable"
    | "all-burnable"
    | "claimable" = "wallet"
) {
  const { address } = useAccount();
  const { nftAddress } = useContractAddresses();
  const [nfts, setNfts] = useState<NFTToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchNFTs() {
      if (!address) {
        console.log("Missing address:", { address });
        setNfts([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (mode === "claimable") {
          // Fetch from Staking subgraph only (includes both staked and burned NFTs)
          const stakingData = await stakingGraphqlClient.request<{
            stakes: SubgraphStake[];
          }>(GET_USER_STAKES_FOR_CLAIMING, {
            owner: address.toLowerCase(),
          });

          console.log(`${mode} - Staking subgraph response:`, stakingData);
          console.log("Total stakes found:", stakingData.stakes?.length || 0);

          // Transform all stakes (both staked and burned can claim rewards)
          // Filter out only UNSTAKED status (those can't claim)
          const claimableNFTs: NFTToken[] = (stakingData.stakes || [])
            .filter((stake) => stake.status !== "UNSTAKED")
            .map((stake) => ({
              id: stake.id,
              tokenId: stake.tokenId,
              owner: stake.owner.id,
              contract: nftAddress || "",
              isStaked: stake.status === "STAKED",
              stakedAt: stake.stakedAt,
              lastClaimAt: stake.lastClaimAt,
              burned: stake.burned,
            }));

          console.log(`${mode} NFTs:`, claimableNFTs);
          setNfts(claimableNFTs);
        } else if (mode === "all-burnable") {
          // Fetch from both NFT and Staking subgraphs
          const [stakingData, nftData] = await Promise.all([
            stakingGraphqlClient.request<{
              stakes: SubgraphStake[];
            }>(GET_USER_BURNABLE_STAKES_FROM_STAKING, {
              owner: address.toLowerCase(),
            }),
            nftGraphqlClient.request<{
              nfts: SubgraphNFT[];
            }>(GET_USER_BURNABLE_NFTS_FROM_NFT, {
              owner: address.toLowerCase(),
            }),
          ]);

          console.log(`${mode} - Staking subgraph response:`, stakingData);
          console.log(`${mode} - NFT subgraph response:`, nftData);
          console.log("Total burnable stakes found:", stakingData.stakes?.length || 0);
          console.log("Total burnable wallet NFTs found:", nftData.nfts?.length || 0);

          // Transform staked NFTs (filter out UNSTAKED)
          const stakedTokens: NFTToken[] = (stakingData.stakes || [])
            .filter((stake) => stake.status !== "UNSTAKED")
            .map((stake) => ({
              id: stake.id,
              tokenId: stake.tokenId,
              owner: stake.owner.id,
              contract: nftAddress || "",
              isStaked: true,
              stakedAt: stake.stakedAt,
              lastClaimAt: stake.lastClaimAt,
              burned: stake.burned,
            }));

          // Build set of currently staked token IDs to exclude from wallet NFTs
          // Only exclude NFTs that are currently STAKED (not UNSTAKED)
          const excludeTokenIds = new Set<string>();
          (stakingData.stakes || []).forEach((stake) => {
            if (stake.status !== "UNSTAKED") {
              excludeTokenIds.add(stake.tokenId);
            }
          });

          // Transform wallet NFTs (exclude those that are staked)
          const walletTokens: NFTToken[] = (nftData.nfts || [])
            .filter((nft) => !excludeTokenIds.has(nft.tokenId))
            .map((nft) => ({
              id: nft.id,
              tokenId: nft.tokenId,
              owner: nft.ownerAddress,
              contract: nft.contract,
              isStaked: false,
              burned: false,
            }));

          // Combine both lists
          const allBurnableNFTs = [...stakedTokens, ...walletTokens];
          console.log(`${mode} NFTs (combined):`, allBurnableNFTs);
          setNfts(allBurnableNFTs);
        } else if (mode === "staked" || mode === "burnable") {
          // Fetch staked NFTs from staking subgraph
          // For 'burnable' mode, only get non-burned staked NFTs
          const query =
            mode === "burnable" ? GET_USER_BURNABLE_STAKES : GET_USER_STAKES;
          const data = await stakingGraphqlClient.request<{
            stakes: SubgraphStake[];
          }>(query, {
            owner: address.toLowerCase(),
          });

          console.log(`${mode} subgraph response:`, data);
          console.log("Total stakes found:", data.stakes?.length || 0);

          // Filter out unstaked NFTs and transform staking data to NFTToken format
          const stakedTokens: NFTToken[] = (data.stakes || [])
            .filter((stake) => stake.status !== "UNSTAKED") // Only include active stakes
            .map((stake) => ({
              id: stake.id,
              tokenId: stake.tokenId,
              owner: stake.owner.id,
              contract: nftAddress || "",
              isStaked: true,
              stakedAt: stake.stakedAt,
              lastClaimAt: stake.lastClaimAt,
              burned: stake.burned,
            }));

          console.log(`${mode} NFTs (after filtering):`, stakedTokens);
          setNfts(stakedTokens);
        } else {
          // For wallet mode: Fetch from both NFT and Staking subgraphs
          console.log("=== WALLET NFTs DEBUG ===");

          // Fetch from NFT subgraph
          const nftData = await nftGraphqlClient.request<{
            nfts: SubgraphNFT[];
          }>(GET_USER_NFTS_FROM_NFT_SUBGRAPH, {
            owner: address.toLowerCase(),
          });

          // Fetch from Staking subgraph
          const stakingData = await stakingGraphqlClient.request<{
            stakes: SubgraphStake[];
          }>(GET_USER_STAKES_FROM_STAKING_SUBGRAPH, {
            owner: address.toLowerCase(),
          });

          console.log("NFT subgraph response:", nftData);
          console.log("Staking subgraph response:", stakingData);
          console.log("Total NFT entities found:", nftData.nfts?.length || 0);
          console.log("Total stake entities found:", stakingData.stakes?.length || 0);

          // Build a set of currently staked/burned token IDs from staking subgraph
          const stakedOrBurnedTokenIds = new Set<string>();
          (stakingData.stakes || []).forEach((stake) => {
            if (stake.status === "STAKED" || stake.burned) {
              stakedOrBurnedTokenIds.add(stake.tokenId);
            }
          });

          console.log("Staked or burned token IDs:", Array.from(stakedOrBurnedTokenIds));

          // Combine NFTs from both sources
          const nftMap = new Map<string, NFTToken>();

          // Add all NFTs from NFT subgraph that are NOT currently staked or burned
          (nftData.nfts || []).forEach((nft) => {
            if (!stakedOrBurnedTokenIds.has(nft.tokenId)) {
              nftMap.set(nft.tokenId, {
                id: nft.id,
                tokenId: nft.tokenId,
                owner: nft.ownerAddress,
                contract: nft.contract,
                isStaked: false,
                burned: false,
              });
            }
          });

          // Also add stakes with UNSTAKED status (they were staked before but now returned to wallet)
          (stakingData.stakes || []).forEach((stake) => {
            if (stake.status === "UNSTAKED" && !stake.burned) {
              nftMap.set(stake.tokenId, {
                id: stake.id,
                tokenId: stake.tokenId,
                owner: stake.owner.id,
                contract: nftAddress || "",
                isStaked: false,
                burned: stake.burned,
              });
            }
          });

          const walletTokens = Array.from(nftMap.values());
          console.log("Merged wallet NFTs:", walletTokens);
          console.log("=== END DEBUG ===");
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
      if (mode === "claimable") {
        // Fetch from Staking subgraph only (includes both staked and burned NFTs)
        const stakingData = await stakingGraphqlClient.request<{
          stakes: SubgraphStake[];
        }>(GET_USER_STAKES_FOR_CLAIMING, {
          owner: address.toLowerCase(),
        });

        // Transform all stakes (both staked and burned can claim rewards)
        // Filter out only UNSTAKED status (those can't claim)
        const claimableNFTs: NFTToken[] = (stakingData.stakes || [])
          .filter((stake) => stake.status !== "UNSTAKED")
          .map((stake) => ({
            id: stake.id,
            tokenId: stake.tokenId,
            owner: stake.owner.id,
            contract: nftAddress || "",
            isStaked: stake.status === "STAKED",
            stakedAt: stake.stakedAt,
            lastClaimAt: stake.lastClaimAt,
            burned: stake.burned,
          }));

        setNfts(claimableNFTs);
      } else if (mode === "all-burnable") {
        // Fetch from both NFT and Staking subgraphs
        const [stakingData, nftData] = await Promise.all([
          stakingGraphqlClient.request<{
            stakes: SubgraphStake[];
          }>(GET_USER_BURNABLE_STAKES_FROM_STAKING, {
            owner: address.toLowerCase(),
          }),
          nftGraphqlClient.request<{
            nfts: SubgraphNFT[];
          }>(GET_USER_BURNABLE_NFTS_FROM_NFT, {
            owner: address.toLowerCase(),
          }),
        ]);

        // Transform staked NFTs (filter out UNSTAKED)
        const stakedTokens: NFTToken[] = (stakingData.stakes || [])
          .filter((stake) => stake.status !== "UNSTAKED")
          .map((stake) => ({
            id: stake.id,
            tokenId: stake.tokenId,
            owner: stake.owner.id,
            contract: nftAddress || "",
            isStaked: true,
            stakedAt: stake.stakedAt,
            lastClaimAt: stake.lastClaimAt,
            burned: stake.burned,
          }));

        // Build set of currently staked token IDs to exclude from wallet NFTs
        // Only exclude NFTs that are currently STAKED (not UNSTAKED)
        const excludeTokenIds = new Set<string>();
        (stakingData.stakes || []).forEach((stake) => {
          if (stake.status !== "UNSTAKED") {
            excludeTokenIds.add(stake.tokenId);
          }
        });

        // Transform wallet NFTs (exclude those that are staked)
        const walletTokens: NFTToken[] = (nftData.nfts || [])
          .filter((nft) => !excludeTokenIds.has(nft.tokenId))
          .map((nft) => ({
            id: nft.id,
            tokenId: nft.tokenId,
            owner: nft.ownerAddress,
            contract: nft.contract,
            isStaked: false,
            burned: false,
          }));

        // Combine both lists
        const allBurnableNFTs = [...stakedTokens, ...walletTokens];
        setNfts(allBurnableNFTs);
      } else if (mode === "staked" || mode === "burnable") {
        const query =
          mode === "burnable" ? GET_USER_BURNABLE_STAKES : GET_USER_STAKES;
        const data = await stakingGraphqlClient.request<{
          stakes: SubgraphStake[];
        }>(query, {
          owner: address.toLowerCase(),
        });
        // Filter out unstaked NFTs
        const stakedTokens: NFTToken[] = (data.stakes || [])
          .filter((stake) => stake.status !== "UNSTAKED") // Only include active stakes
          .map((stake) => ({
            id: stake.id,
            tokenId: stake.tokenId,
            owner: stake.owner.id,
            contract: nftAddress || "",
            isStaked: true,
            stakedAt: stake.stakedAt,
            lastClaimAt: stake.lastClaimAt,
            burned: stake.burned,
          }));
        setNfts(stakedTokens);
      } else {
        // For wallet mode: Fetch from both NFT and Staking subgraphs
        console.log("=== REFETCH WALLET NFTs DEBUG ===");

        // Fetch from NFT subgraph
        const nftData = await nftGraphqlClient.request<{
          nfts: SubgraphNFT[];
        }>(GET_USER_NFTS_FROM_NFT_SUBGRAPH, {
          owner: address.toLowerCase(),
        });

        // Fetch from Staking subgraph
        const stakingData = await stakingGraphqlClient.request<{
          stakes: SubgraphStake[];
        }>(GET_USER_STAKES_FROM_STAKING_SUBGRAPH, {
          owner: address.toLowerCase(),
        });

        console.log("NFT subgraph response:", nftData);
        console.log("Staking subgraph response:", stakingData);
        console.log("Total NFT entities found:", nftData.nfts?.length || 0);
        console.log("Total stake entities found:", stakingData.stakes?.length || 0);

        // Build a set of currently staked/burned token IDs from staking subgraph
        const stakedOrBurnedTokenIds = new Set<string>();
        (stakingData.stakes || []).forEach((stake) => {
          if (stake.status === "STAKED" || stake.burned) {
            stakedOrBurnedTokenIds.add(stake.tokenId);
          }
        });

        console.log("Staked or burned token IDs:", Array.from(stakedOrBurnedTokenIds));

        // Combine NFTs from both sources
        const nftMap = new Map<string, NFTToken>();

        // Add all NFTs from NFT subgraph that are NOT currently staked or burned
        (nftData.nfts || []).forEach((nft) => {
          if (!stakedOrBurnedTokenIds.has(nft.tokenId)) {
            nftMap.set(nft.tokenId, {
              id: nft.id,
              tokenId: nft.tokenId,
              owner: nft.ownerAddress,
              contract: nft.contract,
              isStaked: false,
              burned: false,
            });
          }
        });

        // Also add stakes with UNSTAKED status (they were staked before but now returned to wallet)
        (stakingData.stakes || []).forEach((stake) => {
          if (stake.status === "UNSTAKED" && !stake.burned) {
            nftMap.set(stake.tokenId, {
              id: stake.id,
              tokenId: stake.tokenId,
              owner: stake.owner.id,
              contract: nftAddress || "",
              isStaked: false,
              burned: stake.burned,
            });
          }
        });

        const walletTokens = Array.from(nftMap.values());
        console.log("Merged wallet NFTs:", walletTokens);
        console.log("=== END REFETCH DEBUG ===");
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
