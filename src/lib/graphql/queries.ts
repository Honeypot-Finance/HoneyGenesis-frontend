/**
 * Query to get NFTs from NFT subgraph (ownership info)
 * Note: NFT subgraph only tracks ownership, not staking/burn status
 */
export const GET_USER_NFTS_FROM_NFT_SUBGRAPH = `
  query GetUserNFTs($owner: String!, $skip: Int = 0) {
    nfts(
      where: {
        ownerAddress: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      contract
      tokenId
      ownerAddress
    }
  }
`;

/**
 * Query to get stakes from Staking subgraph
 */
export const GET_USER_STAKES_FROM_STAKING_SUBGRAPH = `
  query GetUserStakes($owner: String!, $skip: Int = 0) {
    stakes(
      where: {
        owner: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      tokenId
      owner {
        id
      }
      status
      burned
    }
  }
`;

/**
 * Query to get all staked NFTs for a specific address
 * Uses the NFT Staking subgraph schema
 */
export const GET_USER_STAKES = `
  query GetUserStakes($owner: String!, $skip: Int = 0) {
    stakes(
      where: {
        owner: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      tokenId
      owner {
        id
      }
      stakedAt
      lastClaimAt
      burned
      burnedAt
      lastBurnClaimAt
      status
    }
  }
`;

/**
 * Query to get staked NFTs that are not yet burned (for burning)
 * Uses the NFT Staking subgraph schema
 */
export const GET_USER_BURNABLE_STAKES = `
  query GetUserBurnableStakes($owner: String!, $skip: Int = 0) {
    stakes(
      where: {
        owner: $owner
        burned: false
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      tokenId
      owner {
        id
      }
      stakedAt
      lastClaimAt
      burned
      burnedAt
      lastBurnClaimAt
      status
    }
  }
`;

/**
 * Query to get burnable staked NFTs from Staking subgraph
 */
export const GET_USER_BURNABLE_STAKES_FROM_STAKING = `
  query GetUserBurnableStakes($owner: String!, $skip: Int = 0) {
    stakes(
      where: {
        owner: $owner
        burned: false
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      tokenId
      owner {
        id
      }
      stakedAt
      lastClaimAt
      burned
      status
    }
  }
`;

/**
 * Query to get burnable wallet NFTs from NFT subgraph
 * Note: NFT subgraph only tracks ownership, filtering by stake/burn status done in app logic
 */
export const GET_USER_BURNABLE_NFTS_FROM_NFT = `
  query GetUserBurnableNFTs($owner: String!, $skip: Int = 0) {
    nfts(
      where: {
        ownerAddress: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      contract
      tokenId
      ownerAddress
    }
  }
`;

/**
 * Query to get all staked NFTs from Staking subgraph (for claiming)
 * Includes both NFTs owned by the user AND NFTs where user is the payoutRecipient
 */
export const GET_USER_STAKES_FOR_CLAIMING = `
  query GetUserStakesForClaiming($owner: String!, $skip: Int = 0) {
    stakes(
      where: {
        or: [
          { owner: $owner },
          { payoutRecipient: $owner }
        ]
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      tokenId
      owner {
        id
      }
      payoutRecipient
      stakedAt
      lastClaimAt
      burned
      burnedAt
      lastBurnClaimAt
      status
    }
  }
`;

/**
 * Query to get burned but unstaked NFTs from NFT subgraph (for claiming)
 * Note: If NFT subgraph doesn't track burn status, this will return empty
 * Burn status should be tracked in Staking subgraph
 */
export const GET_USER_BURNED_NFTS_FROM_NFT = `
  query GetUserBurnedNFTs($owner: String!, $skip: Int = 0) {
    nfts(
      where: {
        ownerAddress: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      contract
      tokenId
      ownerAddress
    }
  }
`;

/**
 * Query to get global statistics
 */
export const GET_GLOBAL_STATS = `
  query GetGlobalStats {
    globalStats(id: "global") {
      id
      totalStaked
      totalBurned
      totalStakingRewardsClaimed
      totalBurnRewardsClaimed
      totalAllRewardsClaimed
    }
  }
`;
