import { useContractAddresses } from "./useContractAddresses";
import { useDevAccount } from "./useDevAccount";
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
  payoutRecipient?: string | null;
  stakedAt: string;
  lastClaimAt: string;
  burned: boolean;
  burnedAt?: string;
  lastBurnClaimAt?: string;
  status: string;
}

/**
 * Hook to fetch user's NFTs dynamically from the subgraph
 * @param mode - 'wallet' to get NFTs in wallet (unstaked), 'staked' to get staked NFTs, 'burnable' to get staked non-burned NFTs, 'all-burnable' to get both staked and unstaked burnable NFTs, 'claimable' to get all NFTs that can claim rewards (owned by user OR user is payoutRecipient)
 */
export function useUserNFTs(
  mode:
    | "wallet"
    | "staked"
    | "burnable"
    | "all-burnable"
    | "claimable" = "wallet"
) {
  const { address } = useDevAccount();
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
          // Also includes NFTs where the connected wallet is the payoutRecipient
          const stakes = await stakingGraphqlClient.requestPaginated<SubgraphStake>(
            GET_USER_STAKES_FOR_CLAIMING,
            { owner: address.toLowerCase() },
            "stakes"
          );

          console.log(`${mode} - Staking subgraph response:`, { stakes });
          console.log("Total stakes found:", stakes.length);

          // Log NFTs where user is payoutRecipient
          const recipientNFTs = stakes.filter(
            (stake) => stake.payoutRecipient?.toLowerCase() === address.toLowerCase()
          );
          if (recipientNFTs.length > 0) {
            console.log(`Found ${recipientNFTs.length} NFTs where you are the payoutRecipient:`, recipientNFTs);
          }

          // Transform all stakes (both staked and burned can claim rewards)
          // Filter out only UNSTAKED status (those can't claim)
          const claimableNFTs: NFTToken[] = stakes
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

          console.log(`${mode} NFTs (total claimable):`, claimableNFTs);
          setNfts(claimableNFTs);
        } else if (mode === "all-burnable") {
          // Fetch from both NFT and Staking subgraphs
          const [stakes, nfts] = await Promise.all([
            stakingGraphqlClient.requestPaginated<SubgraphStake>(
              GET_USER_BURNABLE_STAKES_FROM_STAKING,
              { owner: address.toLowerCase() },
              "stakes"
            ),
            nftGraphqlClient.requestPaginated<SubgraphNFT>(
              GET_USER_BURNABLE_NFTS_FROM_NFT,
              { owner: address.toLowerCase() },
              "nfts"
            ),
          ]);

          console.log(`${mode} - Staking subgraph response:`, { stakes });
          console.log(`${mode} - NFT subgraph response:`, { nfts });
          console.log("Total burnable stakes found:", stakes.length);
          console.log("Total burnable wallet NFTs found:", nfts.length);

          // Transform staked NFTs (filter out UNSTAKED)
          const stakedTokens: NFTToken[] = stakes
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
          stakes.forEach((stake) => {
            if (stake.status !== "UNSTAKED") {
              excludeTokenIds.add(stake.tokenId);
            }
          });

          // Transform wallet NFTs (exclude those that are staked)
          const walletTokens: NFTToken[] = nfts
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
          const stakes = await stakingGraphqlClient.requestPaginated<SubgraphStake>(
            query,
            { owner: address.toLowerCase() },
            "stakes"
          );

          console.log(`${mode} subgraph response:`, { stakes });
          console.log("Total stakes found:", stakes.length);

          // Filter out unstaked NFTs and transform staking data to NFTToken format
          const stakedTokens: NFTToken[] = stakes
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
          const nfts = await nftGraphqlClient.requestPaginated<SubgraphNFT>(
            GET_USER_NFTS_FROM_NFT_SUBGRAPH,
            { owner: address.toLowerCase() },
            "nfts"
          );

          // Fetch from Staking subgraph
          const stakes = await stakingGraphqlClient.requestPaginated<SubgraphStake>(
            GET_USER_STAKES_FROM_STAKING_SUBGRAPH,
            { owner: address.toLowerCase() },
            "stakes"
          );

          console.log("NFT subgraph response:", { nfts });
          console.log("Staking subgraph response:", { stakes });
          console.log("Total NFT entities found:", nfts.length);
          console.log("Total stake entities found:", stakes.length);

          // Build a set of currently staked/burned token IDs from staking subgraph
          const stakedOrBurnedTokenIds = new Set<string>();
          stakes.forEach((stake) => {
            if (stake.status === "STAKED" || stake.burned) {
              stakedOrBurnedTokenIds.add(stake.tokenId);
            }
          });

          console.log("Staked or burned token IDs:", Array.from(stakedOrBurnedTokenIds));

          // Combine NFTs from both sources
          const nftMap = new Map<string, NFTToken>();

          // Add all NFTs from NFT subgraph that are NOT currently staked or burned
          nfts.forEach((nft) => {
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

          // DO NOT add UNSTAKED stakes to wallet view
          // UNSTAKED status means the NFT was unstaked, but it doesn't mean it's in the current wallet
          // We only show NFTs that are actually in the wallet (from NFT subgraph)
          // If an NFT was unstaked, it went back to the original owner, not necessarily the current connected wallet

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
        // Also includes NFTs where the connected wallet is the payoutRecipient
        const stakes = await stakingGraphqlClient.requestPaginated<SubgraphStake>(
          GET_USER_STAKES_FOR_CLAIMING,
          { owner: address.toLowerCase() },
          "stakes"
        );

        console.log(`Refetch ${mode} - Staking subgraph response:`, { stakes });

        // Log NFTs where user is payoutRecipient
        const recipientNFTs = stakes.filter(
          (stake) => stake.payoutRecipient?.toLowerCase() === address.toLowerCase()
        );
        if (recipientNFTs.length > 0) {
          console.log(`Refetch: Found ${recipientNFTs.length} NFTs where you are the payoutRecipient:`, recipientNFTs);
        }

        // Transform all stakes (both staked and burned can claim rewards)
        // Filter out only UNSTAKED status (those can't claim)
        const claimableNFTs: NFTToken[] = stakes
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

        console.log(`Refetch ${mode} NFTs (total claimable):`, claimableNFTs);
        setNfts(claimableNFTs);
      } else if (mode === "all-burnable") {
        // Fetch from both NFT and Staking subgraphs
        const [stakes, nfts] = await Promise.all([
          stakingGraphqlClient.requestPaginated<SubgraphStake>(
            GET_USER_BURNABLE_STAKES_FROM_STAKING,
            { owner: address.toLowerCase() },
            "stakes"
          ),
          nftGraphqlClient.requestPaginated<SubgraphNFT>(
            GET_USER_BURNABLE_NFTS_FROM_NFT,
            { owner: address.toLowerCase() },
            "nfts"
          ),
        ]);

        // Transform staked NFTs (filter out UNSTAKED)
        const stakedTokens: NFTToken[] = stakes
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
        stakes.forEach((stake) => {
          if (stake.status !== "UNSTAKED") {
            excludeTokenIds.add(stake.tokenId);
          }
        });

        // Transform wallet NFTs (exclude those that are staked)
        const walletTokens: NFTToken[] = nfts
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
        const stakes = await stakingGraphqlClient.requestPaginated<SubgraphStake>(
          query,
          { owner: address.toLowerCase() },
          "stakes"
        );
        // Filter out unstaked NFTs
        const stakedTokens: NFTToken[] = stakes
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
        const nfts = await nftGraphqlClient.requestPaginated<SubgraphNFT>(
          GET_USER_NFTS_FROM_NFT_SUBGRAPH,
          { owner: address.toLowerCase() },
          "nfts"
        );

        // Fetch from Staking subgraph
        const stakes = await stakingGraphqlClient.requestPaginated<SubgraphStake>(
          GET_USER_STAKES_FROM_STAKING_SUBGRAPH,
          { owner: address.toLowerCase() },
          "stakes"
        );

        console.log("NFT subgraph response:", { nfts });
        console.log("Staking subgraph response:", { stakes });
        console.log("Total NFT entities found:", nfts.length);
        console.log("Total stake entities found:", stakes.length);

        // Build a set of currently staked/burned token IDs from staking subgraph
        const stakedOrBurnedTokenIds = new Set<string>();
        stakes.forEach((stake) => {
          if (stake.status === "STAKED" || stake.burned) {
            stakedOrBurnedTokenIds.add(stake.tokenId);
          }
        });

        console.log("Staked or burned token IDs:", Array.from(stakedOrBurnedTokenIds));

        // Combine NFTs from both sources
        const nftMap = new Map<string, NFTToken>();

        // Add all NFTs from NFT subgraph that are NOT currently staked or burned
        nfts.forEach((nft) => {
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

        // DO NOT add UNSTAKED stakes to wallet view
        // UNSTAKED status means the NFT was unstaked, but it doesn't mean it's in the current wallet
        // We only show NFTs that are actually in the wallet (from NFT subgraph)
        // If an NFT was unstaked, it went back to the original owner, not necessarily the current connected wallet

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
